const MessageDAO = require('../../DAO/messageDAO')
const ClassDAO = require('../../DAO/ClassDAO')
const UserDAO = require('../../DAO/userDAO')

const Controller = require('../Controller')
const e = require('express')

module.exports = new (class extends Controller {
  constructor() {
    super()
    this.init()
  }

  init() {
    this.messageDao = new MessageDAO()
    this.classDao = new ClassDAO()
    this.userDao = new UserDAO()
  }

  async addMessageWriteAt(info, classId, userId) {
    for (let i = 0; i < info.length; i += 1) {
      info[i] = info[i].dataValues
      // eslint-disable-next-line no-await-in-loop
      info[i].writeAt = await this.messageDao.getLastMessageTime(
        classId,
        info[i].sendUserId,
        userId,
      )
    }
  }

  async addMessageUnReadCount(info, classId, userId) {
    for (let i = 0; i < info.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      info[i].unReadCount = await this.messageDao.countUnreadMessage(
        classId,
        userId,
        info[i].sendUserId,
      )
    }
  }

  getProcess = async (req, res) => {
    const { type } = req.query
    const { userId, classId } = res.locals
    const { paramsInfo } = req.params

    if ((await this.classDao.getUserJob(classId, userId)) === null) {
      this.sendFailure(402, '권한이 없음', res)
      return
    }

    if (!type) {
      const info = await this.messageDao.getClassMessageAll(classId, userId)
      if (info) {
        this.sendSuccess(200, info, res)
      } else {
        this.sendFailure(404, 'not found', res)
      }
      return
    }

    let info = []

    if (type === 'receive') {
      info = await this.messageDao.getReceiveMessage(classId, userId)

      info = await info.filter(
        async (x) =>
          // eslint-disable-next-line no-return-await
          !(await this.messageDao.isClose(
            classId,
            x.dataValues.sendUserId,
            userId,
          )),
      )

      await this.addMessageWriteAt(info, classId, userId)
      await this.addMessageUnReadCount(info, classId, userId)
    } else if (type === 'send') {
      info = await this.messageDao.getSendMessage(classId, userId)
      await this.addMessageWriteAt(info, classId, userId)
    } else if (type === 'only') {
      info = await this.messageDao.getMessage(paramsInfo)

      if (!info) {
        this.sendFailure(404, 'not found', res)
        return
      }

      if (
        info.dataValues.sendUserId !== userId &&
        info.dataValues.recevie !== userId
      ) {
        this.sendFailure(402, 'forbidden ', res)
        return
      }
    } else if (type === 'user') {
      info = await this.messageDao.getUserMessage(classId, userId, paramsInfo)
    } else {
      this.sendFailure(400, 'bad request', res)
      return
    }

    if (info) {
      this.sendSuccess(200, info, res)
    } else {
      this.sendFailure(404, 'not found', res)
    }
  }

  putProcess = async (req, res) => {
    const { userId: otherUserId } = req.body
    const { messageId, userId } = res.locals

    if (!otherUserId) {
      const msg = await this.messageDao.getMessage(messageId)

      if (!msg) {
        this.sendFailure(404, 'not found', res)
        return
      }

      if (
        msg.dataValues.sendUserId !== userId &&
        msg.dataValues.receiveUserId === userId
      ) {
        this.sendFailure(402, 'forbidden', res)
        return
      }

      if (await this.messageDao.updateRead(messageId)) {
        this.sendSuccess(204, '조회 처리 성공', res)
      } else {
        this.sendFailure(409, '조회 처리를 하는 도중 오류가 발생했습니다', res)
      }
    } else if (await this.messageDao.updateClose(userId, otherUserId)) {
      this.sendSuccess(204, true, res)
    } else {
      this.sendFailure(409, '닫기 처리를 하는 도중 오류가 발생했습니다', res)
    }

    this.sendFailure(400, 'bad request', res)
  }

  postProcess = async (req, res) => {
    const { userList, content } = req.body
    const { classId, messageId, userId } = res.locals

    if (messageId) {
      const msg = await this.messageDao.getMessage(messageId)

      if (!msg) {
        this.sendFailure(404, 'not found', res)
        return
      }

      let sendUserId = ''
      let receiveUserId = ''

      if (msg.dataValues.receiveUserId === userId) {
        sendUserId = msg.dataValues.sendUserId
        receiveUserId = userId
      } else if (msg.dataValues.sendUserId === userId) {
        sendUserId = msg.dataValues.sendUserId
        receiveUserId = userId
      } else {
        this.sendFailure(402, 'forbidden', res)
      }

      const contentId = await this.messageDao.createContent(content)
      console.log(contentId)
      if (!contentId) {
        this.sendFailure(409, 'conflict', res)
        return
      }

      await this.messageDao.sendMessage(
        sendUserId,
        receiveUserId,
        classId,
        contentId,
        messageId,
      )

      this.sendSuccess(201, true, res)
      return
    }

    const job = await this.classDao.getUserJob(userId)
    if (job === null) {
      this.sendFailure(402, 'forbidden', res)
      return
    }

    // 유저가 학생일때
    if (job === 1) {
      // 학생에게 보내는지 검사
      for (let i = 0; i < userList.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const job2 = await this.classDao.getUserJob(userList[i])
        if (job2 === 1) {
          this.sendFailure(402, 'forbidden', res)
          return
        }
      }

      await this.sendMessageForUsers(content, userId, userList, classId)
      this.sendSuccess(201, true, res)
      return
    }

    // 유저가 교사일때
    await this.sendMessageForUsers(content, userId, userList, classId)
    this.sendSuccess(201, true, res)
  }

  async sendMessageForUsers(content, userId, userList, classId) {
    const contentId = await this.messageDao.createContent(content)

    if (!contentId) {
      return false
    }

    for (let i = 0; i < userList.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      if (
        // eslint-disable-next-line no-await-in-loop
        !(await this.messageDao.sendMessage(
          userId,
          userList[i],
          classId,
          contentId,
        ))
      ) {
        return false
      }
    }

    return true
  }
})()

// 전체적으로 유저 검사를 안함

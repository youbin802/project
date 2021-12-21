const db = require('../models')
const exception = require('../Exception')

const { message, messageContent, Sequelize } = db
const { Op } = Sequelize
const { Exception } = exception
const ErrorCode = 204

module.exports = class messageDAO {
  async getLastMessageTime(classId, sendUserId, receiveUserId) {
    try {
      const time = await message.findOne({
        include: [
          {
            attribute: ['writeAt'],
            model: messageContent,
          },
        ],
        where: {
          classId,
          sendUserId,
          receiveUserId,
          [Op.and]: Sequelize.literal('messages.status & 64 != 64'),
          [Op.and]: Sequelize.literal('message_content.status & 64 != 64'),
        },
        order: Sequelize.literal('messageId DESC'),
      })

      if (!time) {
        return null
      }

      return time.dataValues.message_content.dataValues.writeAt
    } catch (err) {
      console.log(err)
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  async getUserMessage(classId, user1, user2) {
    try {
      return await message.findOne({
        where: {
          classId,
          [Op.or]: [
            {
              [Op.and]: {
                sendUserId: user2,
                receiveUserId: user1,
              },
            },
            {
              [Op.and]: {
                sendUserId: user1,
                receiveUserId: user2,
              },
            },
          ],
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
        order: Sequelize.literal('messageId DESC'),
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  async isClose(classId, sendUserId, receiveUserId) {
    try {
      const status = await message.findOne({
        attribute: ['status'],
        where: {
          classId,
          sendUserId,
          receiveUserId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
        order: Sequelize.literal('messageId DESC'),
      })

      if ((status & 2) === 2) {
        return true
      }

      return false
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async getReceiveMessage(classId, userId) {
    try {
      return await message.findAll({
        attribute: [
          'messageId',
          'sendUserId',
          'receiveUserId',
          'classId',
          'replyMessageId',
          'contentId',
          'status',
        ],
        where: {
          classId,
          receiveUserId: userId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
        group: ['sendUserId'],
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  // 보낸 쪽지들, userId는 쪽지를 보낸 사람의 id(send_user_id)
  async getSendMessage(classId, userId) {
    try {
      return await message.findAll({
        attribute: [
          'messageId',
          'sendUserId',
          'receiveUserId',
          'classId',
          'replyMessageId',
          'contentId',
          'status',
        ],
        where: {
          classId,
          sendUserId: userId,
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
        group: ['receiveUserId'],
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  // id에 해당하는 쪽지를 불러오는 함수, id는 쪽지의 id
  async getMessage(messageId) {
    try {
      return await message.findOne({
        include: [
          {
            model: messageContent,
          },
        ],
        where: {
          messageId,
          [Op.and]: Sequelize.literal('messages.status & 64 != 64'),
          [Op.and]: Sequelize.literal('message_content.status & 64 != 64'),
        },
      })
    } catch {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  async getClassMessageAll(classId, userId) {
    try {
      return await message.findAll({
        include: [
          {
            attribute: ['writeAt'],
            model: messageContent,
          },
        ],
        where: {
          classId,
          [Op.or]: [
            {
              sendUserId: userId,
            },
            {
              receiveUserId: userId,
            },
          ],
          [Op.and]: Sequelize.literal('messages.status & 64 != 64'),
          [Op.and]: Sequelize.literal('message_content.status & 64 != 64'),
        },
        order: Sequelize.literal('messageId DESC'),
      })
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  async createContent(content) {
    try {
      return (
        await messageContent.create({
          writeAt: Sequelize.fn('NOW'),
          content,
          status: 0,
        })
      ).dataValues.contentId
    } catch (error) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return null
  }

  // 쪽지 보내기 함수, messageId : message의 id, userId : 보내는 사람의id, classId : 수업id,recieverId : 받는 사람의id, content : 내용
  async sendMessage(
    sendUserId,
    receiveUserId,
    classId,
    contentId,
    replyMessageId = null,
  ) {
    try {
      return (
        (await message.create({
          sendUserId,
          receiveUserId,
          contentId,
          classId,
          replyMessageId,
          status: 0,
        })) !== null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async countUnreadMessage(classId, userId1, userId2) {
    try {
      const { QueryTypes } = require('sequelize')
      const result = await db.sequelize.query(
        'SELECT COUNT(message_id) as count FROM messages WHERE (status&1)=0 AND receive_user_id = :userId1 AND class_id = :classId AND send_user_id = :userId2',
        {
          replacements: { userId1, classId, userId2 },
          type: QueryTypes.SELECT,
        },
      )

      if (!result[0]) {
        return 0
      }

      return result[0].count
    } catch (err) {
      console.log(err)
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return 0
  }

  async updateRead(messageId) {
    try {
      console.log(typeof messageId, messageId)
      return (
        (await message.update(
          {
            status: Sequelize.literal('status | 1'),
          },
          {
            where: {
              messageId,
              [Op.and]: Sequelize.literal('status & 64 != 64'),
            },
          },
        )) !== null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }

  async updateClose(userId, myUserId) {
    try {
      const msg = await message.findOne({
        attribute: ['messageId', 'sendUserId', 'receiveUserId'],
        where: {
          [Op.or]: [
            {
              [Op.and]: {
                sendUserId: userId,
                receiveUserId: myUserId,
              },
            },
            {
              [Op.and]: {
                sendUserId: myUserId,
                receiveUserId: userId,
              },
            },
          ],
          [Op.and]: Sequelize.literal('status & 64 != 64'),
        },
      })

      if (msg === null) {
        return false
      }

      const { messageId, sendUserId, receiveUserId } = msg.dataValues

      if (sendUserId !== userId && receiveUserId !== userId) {
        return false
      }

      return (
        (await message.update(
          {
            status: Sequelize.literal('status | 2'),
          },
          {
            where: {
              messageId,
            },
          },
        )) !== null
      )
    } catch (err) {
      exception.addThrow(new Exception(ErrorCode, 'null pointer exception'))
    }

    return false
  }
}

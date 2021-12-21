const ClassDAO = require('../../DAO/ClassDAO')
const Controller = require('../Controller')

module.exports = new (class extends Controller {
  constructor() {
    super()
    this.init()
  }

  init() {
    this.dao = new ClassDAO()
  }

  getProcess = async (req, res) => {
    const { userId, classId } = res.locals

    if (!classId) {
      // 참가 중인 수업들의 정보
      const info = await this.dao.getUserClass(userId)
      if (!info) {
        this.sendFailure(404, 'not found', res)
        return
      }

      this.sendSuccess(200, info, res)
      return
    }

    // 참가 중인 수업의 정확한 정보
    const myClassList = await this.dao.getUserClass(userId)

    if (!myClassList) {
      this.sendFailure(404, 'not fount', res)
      return
    }

    let isMyClass = false
    for (let i = 0; i < myClassList.length; i += 1) {
      if (classId === myClassList[i].dataValues.classId) {
        isMyClass = true
        break
      }
    }

    if (isMyClass) {
      const info = await this.dao.getClass(classId)

      if (!info) {
        this.sendFailure(404, 'not fount', res)
        return
      }

      this.sendSuccess(200, info, res)

      return
    }

    this.sendFailure(400, 'bad request', res)
  }

  postProcess = async (req, res) => {
    const { userId } = res.locals // student 추가
    const { classId } = req.body

    if (!classId) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    // 이미 추가되어있으면 추가 x

    if ((await this.dao.getMyClassOne(classId, userId)) !== null) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    const info = await this.dao.addMyClass(classId, userId)

    if (!info) {
      this.sendFailure(409, 'conflict', res)
      return
    }
    this.sendSuccess(204, true, res)
  }

  deleteProcess = async (req, res) => {
    const { userId, classId } = res.locals // 내 수업에서 삭제

    // 관리자가 나가는 경우 수업삭제
    if ((await this.dao.getUserJob(classId, userId)) === 2) {
      const info = await this.dao.deleteClass(classId)

      if (!info) {
        this.sendFailure(409, 'conflict', res)
        return
      }
      this.sendSuccess(204, true, res)
    }

    // 이미 나간 클래스는 또 나가지 못함
    console.log(await this.dao.getMyClassOne(classId, userId))
    if (!(await this.dao.getMyClassOne(classId, userId))) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    const info = await this.dao.deleteMyClass(classId, userId)

    if (!info) {
      this.sendFailure(409, 'conflict', res)
      return
    }

    this.sendSuccess(204, true, res)
  }
})()

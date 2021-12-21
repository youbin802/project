const UserDAO = require('../../DAO/UserDAO')
const Controller = require('../Controller')

module.exports = new (class extends Controller {
  constructor() {
    super()
    this.dao = new UserDAO()
  }

  checkSession = (req, res, next) => {
    const { user } = req.session

    if (!user) {
      this.sendFailure(402, 'no session', res)
      return
    }

    res.locals.userId = user.userId

    next()
  }

  // 미구현
  github = async (req, res) => {
    const { code } = req.query
    console.log(req.body)
    if ((await this.dao.getUser(code)) !== null) {
      // 로그인
    } else if (await this.dao.join(code, 0, 'user')) {
      // 회원가입
    }
  }

  getListProcess = async (req, res) => {
    const { type } = req.query

    console.log(type)

    if (type) {
      switch (type) {
        case 'student':
          this.sendSuccess(200, await this.dao.getStudentList(), res)
          return

        case 'teacher':
          this.sendSuccess(200, await this.dao.getTeacherList(), res)
          return

        default:
          this.sendFailure(400, 'bad request', res)
          return
      }
    }

    this.sendFailure(400, 'bad reqeust', res)
  }

  getProcess = async (req, res) => {
    const myUserId = res.locals.userId
    const { userId } = req.params

    if (userId === undefined || myUserId === undefined) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    const userInfo = await this.dao.getUser(userId)

    if (userInfo === null) {
      this.sendFailure(404, 'not found', res)
      return
    }

    if (myUserId === userId) {
      this.sendSuccess(200, userInfo, res)
    } else {
      delete userInfo.dataValues.userId
      this.sendSuccess(200, userInfo, res)
    }
  }

  postProcess = async (req, res) => {
    const { userId, userName, job } = req.body

    if (!userId || !userName || !job) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    if (await this.dao.getUser(userId)) {
      this.sendFailure(409, 'conflict', res)
      return
    }

    if (await this.dao.join(userId, job, userName)) {
      this.sendSuccess(201, true, res)
    } else {
      this.sendFailure(201, false, res)
    }
  }

  deleteProcess = async (req, res) => {
    // 세션 삭제 후 유저 삭제
    const { userId } = res.locals

    if (!(await this.dao.deleteUser(userId))) {
      this.sendFailure(409, 'conflict', res)
      return
    }

    require('../SessionController').deleteProcess(req, res)
    // res.redirect('http://localhost:3000/session/logout') // 세션 삭제
  }

  putProcess = async (req, res) => {
    const { userId } = res.locals
    const userInfo = req.body

    const info = await this.dao.updateUser(userId, userInfo)

    if (!info) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    this.sendSuccess(204, true, res)
  }
})()

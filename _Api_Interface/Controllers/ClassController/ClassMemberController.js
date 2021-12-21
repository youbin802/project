const ClassDAO = require('../../DAO/ClassDAO')
const UserDAO = require('../../DAO/UserDAO')
const exeption = require('../../Exception')

const Controller = require('../Controller')

const { Exception } = exeption
const errorCode = 103

module.exports = new (class extends Controller {
  constructor() {
    super()

    this.classDao = new ClassDAO()
    this.userDao = new UserDAO()
  }

  getStudent = async (req, res) => {
    const { classId } = res.locals
    const info = await this.userDao.getClassStudent(classId)

    if (info) {
      this.sendSuccess(200, info, res)
    } else {
      this.sendFailure(404, 'not found', res)
    }
  }

  getTeacher = async (req, res) => {
    const { type } = req.query
    const { classId } = res.locals

    if (type === 'true') {
      const info = await this.userDao.getClassTeacher(classId)
      if (info) {
        this.sendSuccess(200, info, res)
      } else {
        this.sendFailure(404, 'not found', res)
      }
      return
    }

    const info = await this.userDao.getNotClassTeacher(classId)

    if (info) {
      this.sendSuccess(200, info, res)
    } else {
      this.sendFailure(404, 'not found', res)
    }
  }

  getMembers = async (req, res) => {
    const { classId } = res.locals

    const info = await this.userDao.getClassMembers(classId)
    if (info) {
      this.sendSuccess(200, info, res)
    } else {
      this.sendFailure(404, 'not found', res)
    }
  }
})()

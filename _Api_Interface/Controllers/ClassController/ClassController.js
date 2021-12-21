const ClassDAO = require('../../DAO/ClassDAO')
const FileDAO = require('../../DAO/FileDAO')
const UserDAO = require('../../DAO/UserDAO')
const exeption = require('../../Exception')

const Controller = require('../Controller')

const { Exception } = exeption
const errorCode = 101

module.exports = new (class extends Controller {
  constructor() {
    super()

    this.classDao = new ClassDAO()
    this.userDao = new UserDAO()
    this.fileDao = new FileDAO()
  }

  getAllClasses = async (req, res) => {
    let info = null
    try {
      info = await this.classDao.getClasses()
    } catch (error) {
      this.sendFailure(200, 'not found', res)
      return
    }

    this.sendSuccess(200, info, res)
  }

  getSearchClass = async (req, res) => {
    const { keyword } = req.query

    if (!keyword) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    const info = await this.classDao.searchClass(keyword)

    if (info) {
      this.sendSuccess(200, info, res)
    } else {
      this.sendFailure(404, 'not found', res)
    }
  }

  getClass = async (req, res) => {
    const { classId } = req.params

    if (!classId) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    const info = await this.classDao.getClass(classId)
    if (info) {
      this.sendSuccess(200, info, res)
    } else {
      this.sendFailure(404, 'not found', res)
    }
  }

  putControl = async (req, res) => {
    const { classId } = res.locals
    const { className, jobToggleUserList: userList } = req.body

    if (!classId) {
      this.sendFailure(400, 'bad request', res)
    }

    const info = await this.classDao.getClass(classId)

    if (!info) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    if (className) {
      if (!(await this.classDao.updateClass(classId, className))) {
        this.sendFailure(409, 'conflict', res)
        return
      }
    }

    if (userList && userList.length > 0) {
      const putResult = []
      for (let i = 0; i < userList.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const job = await this.classDao.getUserJob(classId, userList[i])
        if (job !== null && job !== 2) {
          putResult.push(this.classDao.toggleMemberJob(classId, userList[i]))
        }
      }

      if ((await Promise.all(putResult)).some((x) => !x)) {
        this.sendFailure(409, 'conflict', res)
        return
      }
    }

    this.sendSuccess(204, true, res)
  }

  deleteClass = async (req, res) => {
    const { classId } = req.params
    const { userId } = req.session.user

    if (!userId || !classId) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    if (!(await this.classDao.getClass(classId, userId))) {
      this.sendFailure(404, 'not found', res)
      return
    }

    const job = await this.classDao.getUserJob(classId, userId)

    if (!job) {
      this.sendFailure(402, '권한이 없습니다.', res)
      return
    }

    if (job !== 2) {
      if (await this.classDao.deleteMyClass(classId, userId)) {
        this.sendSuccess(204, true, res)
      } else {
        this.sendFailure(409, 'conflict', res)
      }
      return
    }

    if (await this.classDao.deleteClass(classId)) {
      this.sendSuccess(204, true, res)
    } else {
      this.sendFailure(409, 'conflict', res)
    }
  }

  postControl = async (req, res) => {
    const { name, teachers } = req.body
    const { userId } = req.session.user

    if (!name || !teachers || !userId) {
      this.sendFailure(400, 'bad request', res)
    }

    const postResult = await this.classDao.createClass(name, userId)

    if (!postResult) {
      this.sendFailure(409, 'conflict', res)
      return
    }

    for (let i = 0; i < teachers.length; i += 1) {
      if (teachers[i] === userId) {
        teachers.splice(i, 1)
      }
    }

    if (!(await this.classDao.createTeacher(postResult, teachers))) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    this.sendSuccess(201, true, res)

    // result = new this.FailRes()
    // result.setCode = 400
    // result.setErrMessage = [
    //   name ? '' : "'result' ",
    //   teachers ? '' : "'teachers' ",
    //   userId ? '' : "'userId' ",
    //   'is required but undefined',
    // ].join('')
    // res.send(result)
  }
})()

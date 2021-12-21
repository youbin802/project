const path = require('path')

const ClassDAO = require('../../DAO/ClassDAO')
const FileDAO = require('../../DAO/FileDAO')
const Crypto = require('../../Util/CryptoUtil')
const FsUtil = require('../../Util/FsUtil')
const Controller = require('../Controller')
const UploadUtil = require('../../Util/UploadUtil')
const exception = require('../../Exception')

const { Exception } = exception
const ErrorCode = 102

module.exports = new (class extends Controller {
  constructor() {
    super()
    this.classDao = new ClassDAO()
    this.fileDao = new FileDAO()
  }

  uploadProcess = async (req, res, next) => {
    const { app } = res
    const config = app.get('config')

    const upload = new UploadUtil(
      path.join(config.development.storage.path, 'file'),
      'file',
    )

    upload.getUpload()(req, res, (err) => {
      if (err) {
        exception.addThrow(new Exception(ErrorCode, err.message))
      }

      next()
    })
  }

  // 중요
  postClassFile = async (req, res) => {
    const { classId } = res.locals
    const { userId } = req.session.user
    const { setting, fileName, content } = req.body
    const { file } = req

    // 현재 수업의 유저 상태
    const job = await this.classDao.getUserJob(classId, userId)

    // 파일 아이디
    const crypto = new Crypto()
    const ext = path.extname(fileName)

    const { hash: fileId } = await crypto.encodeAbs(
      `${path.basename(fileName, ext)}${userId}${Date.now()}${ext}`,
    )

    if (file) {
      // req.body = file, fileName, setting
      // 파일을 보냈을 경우

      let fs = null
      try {
        fs = new FsUtil(file.path)
      } catch (error) {
        this.sendFailure(409, '요청 처리중 오류 발생', res)

        return
      }

      if (job === 1 || job === 0) {
        // 권한 불충분
        fs.remove()

        this.sendFailure(402, '권한이 없습니다.', res)
        return
      }

      fs.rename(fileId)

      try {
        await this.fileDao.insertFile(fileId, fileName, userId)
        await this.fileDao.insertClassFile(fileId, classId, setting)
        await this.fileDao.insertUserFile(userId, fileId, userId)
      } catch (error) {
        this.sendFailure(409, 'DB처리중 오류', res)
      }

      this.sendSuccess(201, true, res)
      return
    }

    const { app } = res

    const config = app.get('config')

    try {
      const fs = new FsUtil(
        path.join(config.development.storage.path, 'file', fileId),
        async function callback() {
          await require('fs').promises.writeFile(this.path, '')
        },
      )

      fs.write(content)
    } catch (error) {
      this.sendFailure(409, '파일 처리중 오류 발생', res)

      return
    }

    try {
      await this.fileDao.insertFile(fileId, fileName, userId)
      await this.fileDao.insertClassFile(fileId, classId, setting)
      await this.fileDao.insertUserFile(userId, fileId, userId)
    } catch (error) {
      this.sendFailure(409, 'DB처리중 오류', res)
    }

    this.sendSuccess(204, true, res)
  }

  getClassFile = async (req, res) => {
    const { classFileId } = req.params

    if (!classFileId) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    const info = await this.fileDao.getClassFile(classFileId)

    if (info) {
      this.sendSuccess(200, info, res)
    } else {
      this.sendFailure(404, 'not found', res)
    }
  }

  getClassFileAll = async (req, res) => {
    const { classId } = res.locals

    console.log('classId : ', classId)

    if (!(await this.classDao.getClass(classId))) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    const info = await this.fileDao.getClassFiles(classId)

    if (info) {
      this.sendSuccess(200, info, res)
    } else {
      this.sendFailure(404, 'not found', res)
    }
  }

  deleteClassFile = async (req, res) => {
    const { classFileId } = req.params
    const { classId } = res.locals
    console.log(req.params)
    if (!req.session.user) {
      this.sendFailure(402, '로그인 되어 있지 않습니다', res)
      return
    }
    const { userId } = req.session.user
    const job = await this.classDao.getUserJob(classId, userId)

    console.log(classId, userId, job)

    if (job === null || job === 1) {
      this.sendFailure(402, '권한이 없습니다', res)
      return
    }

    if (await this.fileDao.removeClassFile(classFileId)) {
      this.sendSuccess(204, true, res)
    } else {
      this.sendFailure(409, 'conflict', res)
    }
  }

  putClassFile = async (req, res) => {
    if (!req.session.user) {
      this.sendFailure(402, 'forbidden', res)
      return
    }

    const { userId } = req.session.user
    const { classId } = res.locals
    const { classFileId, setting, fileName } = req.body
    const job = await this.classDao.getUserJob(classId, userId)

    if (job === null || job === 1) {
      this.sendFailure(402, 'forbidden', res)
      return
    }

    if (setting) {
      if (!(await this.fileDao.updateClassFileSetting(classFileId, setting))) {
        this.sendFailure(409, '공유파일 설정을 변경할 수 없음', res)
      }
    }

    if (fileName) {
      console.log(classFileId)
      let fileId = await this.fileDao.getClassFile(classFileId)
      if (fileId) {
        fileId = fileId.dataValues.fileId
      } else {
        this.sendFailure(404, 'not found', res)
        return
      }

      if (!(await this.fileDao.updateFile(fileId, fileName, setting))) {
        this.sendFailure(409, '파일 이름을 변경할 수 없음', res)
      }
    }

    this.sendFailure(204, true, res)
  }
})()

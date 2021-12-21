const path = require('path')

const FileDAO = require('../../DAO/FileDAO')
const FolderDAO = require('../../DAO/FolderDAO')
const Crypto = require('../../Util/CryptoUtil')
const FsUtil = require('../../Util/FsUtil')
const config = require('../../../config/config')
const Upload = require('../../Util/UploadUtil')

const Controller = require('../Controller')

const exception = require('../../Exception')

const { Exception } = exception
const ErrorCode = 101

module.exports = new (class extends Controller {
  constructor() {
    super()

    this.init()
  }

  init() {
    this.dao = new FileDAO()
    this.folderDao = new FolderDAO()
  }

  getProcess = async (req, res) => {
    const { userId } = res.locals
    const { fileId } = req.params

    if (!(await this.dao.getUserFile(fileId, userId))) {
      this.sendFailure(404, '존재하지 않는 파일', res)
      return
    }

    const fs = new FsUtil(
      path.join(config.development.storage.path, 'file', fileId),
    )

    let fileInfo = await this.dao.getFile(fileId)
    if (fileInfo) {
      fileInfo = fileInfo.dataValues
      fileInfo.content = await fs.read()
      this.sendSuccess(200, fileInfo, res)
    } else {
      this.sendFailure(404, 'not found', res)
    }
  }

  uploadProcess = async (req, res, next) => {
    const upload = new Upload(
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

  postProcess = async (req, res) => {
    const { userId } = res.locals
    const { file } = req
    // const { fileId, folderId, fileName, fileOwner, setting } = req.body

    if (file) {
      // 유저가 파일을 직접 올릴때

      const crypto = new Crypto()
      const fs = new FsUtil(file.path)

      const { originalname } = file
      const ext = path.extname(originalname)
      const fileName = path.basename(originalname, ext)

      const { hash: fileId } = await crypto.encodeAbs(
        `${fileName}${userId}${Date.now()}${ext}`,
      )

      await fs.rename(fileId)

      if (!(await this.dao.insertFile(fileId, originalname, userId))) {
        this.sendFailure(409, 'DB 실행중 오류', res)
        return
      }
      if (!(await this.dao.insertUserFile(userId, fileId, userId))) {
        this.sendFailure(409, 'DB 실행중 오류', res)
        return
      }

      this.sendSuccess(201, true, res)
      return
    }

    const { fileId } = req.body

    if (!(await this.dao.getFile(fileId))) {
      try {
        this.sendFailure(404, 'undefined file', res)
      } catch (error) {
        console.log(error)
      }
      return
    }
    if (!(await this.dao.insertUserFile(userId, fileId, userId))) {
      this.sendFailure(409, 'DB 실행중 오류', res)
      return
    }

    this.sendSuccess(201, true, res)
  }

  deleteProcess = async (req, res) => {
    // 유저아이디도 검사후 삭제
    const { fileId } = req.params
    const { userId } = res.locals

    if (!(await this.dao.getUserFile(fileId, userId))) {
      this.sendFailure(404, '존재하지 않는 파일입니다.', res)
      return
    }

    if (!(await this.dao.isFileOwner(fileId, userId))) {
      this.sendFailure(401, '잘못된 접근입니다', res)
      return
    }

    if (!(await this.dao.removeUserFile(fileId))) {
      this.sendFailure(409, 'DB실행중 오류', res)
      return
    }

    this.sendSuccess(204, true, res)
  }

  putProcess = async (req, res) => {
    // 유저 이름 검사후 파일이동
    const { fileId } = req.params
    const { folderId } = req.body
    const { userId } = res.locals

    if (!(await this.dao.getUserFile(fileId, userId))) {
      this.sendFailure(404, '존재하지 않는 파일입니다.', res)
      return
    }

    if (
      !(await this.folderDao.isFolderOwner(folderId, userId)) &&
      !(userId === folderId)
    ) {
      this.sendFailure(402, '권한이 없습니다', res)
      return
    }

    if (!(await this.dao.updateMoveFile(fileId, folderId))) {
      this.sendFailure(409, 'DB실행중 오류', res)
      return
    }

    this.sendSuccess(204, true, res)
  }
})()

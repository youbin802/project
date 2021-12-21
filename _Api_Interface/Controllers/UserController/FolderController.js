const FileDAO = require('../../DAO/FileDAO')
const FolderDAO = require('../../DAO/FolderDAO')
const Crypto = require('../../Util/CryptoUtil')

const Controller = require('../Controller')

module.exports = new (class extends Controller {
  constructor() {
    super()

    this.init()
  }

  init() {
    this.fileDao = new FileDAO()
    this.folderDao = new FolderDAO()
  }

  getProcess = async (req, res) => {
    const { userId } = res.locals
    let { folderId } = res.locals

    if (!folderId) {
      folderId = userId
    }

    const folder = await this.folderDao.getFolderChildFile(folderId, userId)
    const file = await await this.fileDao.getFilesByFolderId(folderId, userId)

    if (!(file && folder)) {
      this.sendFailure(409, 'DB접속 중 오류', res)
      return
    }

    this.sendSuccess(
      200,
      {
        folder,
        file,
      },
      res,
    )
  }

  postProcess = async (req, res) => {
    const { userId } = res.locals
    const { parent, name } = req.body
    const crypto = new Crypto()

    const { hash: folderId } = await crypto.encodeAbs(
      `${userId}${Date.now()}${name}`,
    )

    if (!(await this.folderDao.scanFolder(parent, name))) {
      this.sendFailure(
        400,
        '같은 위치에 같은 이름의 폴더가 이미 존재합니다',
        res,
      )
      return
    }

    if (
      !(await this.folderDao.insertFolder(parent, {
        userId,
        folderName: name,
        folderId,
      }))
    ) {
      this.sendFailure(409, 'DB실행중 오류', res)
      return
    }

    this.sendSuccess(201, true, res)
  }

  deleteProcess = async (req, res) => {
    const { userId, folderId } = res.locals
    if (!(await this.folderDao.isFolderOwner(folderId, userId))) {
      this.sendFailure(402, '잘못된 접근입니다.', res)
      return
    }

    if (!(await this.folderDao.removeFolder(folderId))) {
      this.sendFailure(409, 'DB처리중 오류', res)
      return
    }

    this.sendSuccess(204, true, res)
  }

  putProcess = async (req, res) => {
    const { userId, folderId } = res.locals

    const { name, parent } = req.body

    const folder = await this.folderDao.getFolder(folderId)

    if (!folder) {
      this.sendFailure(404, 'not found', res)
      return
    }

    if (!(await this.folderDao.isFolderOwner(folderId, userId))) {
      this.sendFailure(402, '잘못된 접근입니다.', res)
      return
    }

    if (name) {
      if (
        !(await this.folderDao.scanFolder(
          folder.dataValues.parentFolderId,
          name,
        ))
      ) {
        this.sendFailure(
          400,
          '같은 위치에 똑같은 이름의 폴더가 존재합니다',
          res,
        )
        return
      }

      if (!(await this.folderDao.updateFolderName(folderId, name))) {
        this.sendFailure(409, 'DB처리중 오류', res)
        return
      }

      this.sendSuccess(402, true, res)

      return
    }

    if (parent) {
      if (
        !(await this.folderDao.scanFolder(parent, folder.dataValues.folderName))
      ) {
        this.sendFailure(
          400,
          '같은 위치에 똑같은 이름의 폴더가 존재합니다',
          res,
        )
        return
      }

      if (!(await this.folderDao.updateMoveFolder(folderId, parent))) {
        this.sendFailure(409, 'DB처리중 오류', res)
        return
      }

      this.sendSuccess(204, true, res)

      return
    }

    this.sendFailure(400, '처리할 요청이 없습니다..', res)
  }
})()

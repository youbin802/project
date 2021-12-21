const multer = require('multer')

module.exports = class Multer {
  constructor(storage, name) {
    this.storage = storage
    this.name = name
  }

  getUpload = () => {
    const { storage } = this

    return multer({
      storage: multer.diskStorage({
        destination(req, file, done) {
          done(null, storage)
        },
        filename(req, file, done) {
          done(null, file.originalname)
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }).single(this.name)
  }
}

// 파일명 : hash (기본 파일명 + 작성자 + 날짜.ext), filename,

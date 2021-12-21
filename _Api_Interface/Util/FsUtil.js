const fs = require('fs').promises
const path = require('path')
const exception = require('../Exception')

const { Exception } = exception
const ErrorCode = 301

// 프록시 사용 고려
module.exports = class FsUtil {
  constructor(_path, asyncCallback) {
    // storage/ ~~
    // 처음에 exist여부 확인후 error throw
    this.path = _path
    this.callback = asyncCallback
    this.dir = path.dirname(this.path)
    this.name = path.basename(this.path)
    this.ext = path.extname(this.path)
  }

  // 실행가능 확인
  async check(type) {
    if (!this.wait) {
      await this.callback()

      await (async () => {
        try {
          this.status = await fs.lstat(this.path)

          this.type = this.status.isDirectory() ? 'dir' : 'file'

          console.log(type)
        } catch (error) {
          if (error.code === 'ENOENT') {
            exception.addThrow(
              new Exception(ErrorCode, 'FsUtil: FileNotFoundException'),
            )
          }
        }
      })()

      this.wait = true
    }

    if (this.type !== type) {
      exception.addThrow(new Exception(ErrorCode, 'FsUtil: TypeError'))
    }

    return true
  }

  // 파일 읽기
  async read() {
    if (!(await this.check('file'))) {
      return false
    }

    const txt = (await fs.readFile(this.path)).toString()

    return txt
  }

  // 파일 쓰기
  async write(str) {
    if (!(await this.check('file'))) {
      return false
    }

    return fs.writeFile(this.path, str)
  }

  // rename
  async rename(name) {
    if (!(await this.check('file'))) {
      return false
    }

    const base = path.basename(this.path)
    const newPath = this.path.replace(base, name) // 파일 이동 안됨..

    await fs.rename(this.path, newPath)

    this.path = newPath

    return this.path
  }

  // 실제로 쓰지는 않을거 같음
  async remove(callback) {
    if (!(await this.check('file'))) {
      return false
    }

    if (typeof callback === 'function') {
      return fs.unlink(this.path, callback)
    }

    return fs.unlink(this.path)
  }

  // 상위 dir 리턴
  getParentPath() {
    return this.dir
  }

  // 폴더 전용
  async getFile(filename = '') {
    if (!(await this.check('folder'))) {
      return false
    }

    const file = (await fs.readdir(this.path)).find((name) => name === filename)

    if (typeof file === 'undefined') {
      exception.addThrow(
        new Exception(ErrorCode, 'FsUtil: FileNotFoundException'),
      )
    }
    return new File(path.join(path.basename(this.path), file))
  }

  async getFiles() {
    if (!(await this.check('folder'))) {
      return false
    }

    const fileList = (await fs.readdir(this.path)).map((file) => {
      const filePath = path.join(path.basename(this.path), file)
      return new File(filePath)
    })

    return fileList
  }
}

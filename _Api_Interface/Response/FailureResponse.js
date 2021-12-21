module.exports = class {
  constructor() {
    this.init()
  }

  init() {
    this.code = ''
    this.err = {
      message: '',
    }
  }

  set setCode(code) {
    this.code = code
  }

  set setErrMessage(message) {
    this.err.message = message
  }
}

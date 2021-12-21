module.exports = class {
  constructor() {
    this.init()
  }

  init() {
    this.code = ''
    this.result = {}
  }

  set setCode(code) {
    this.code = code
  }

  set setResult(result) {
    this.result = result
  }
}

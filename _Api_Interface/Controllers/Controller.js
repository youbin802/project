const {
  SuccessResponse: SucRes,
  FailureResponse: FailRes,
} = require('../Response')

const exception = require('../Exception')

module.exports = class Controller {
  constructor() {
    this.SucRes = SucRes
    this.FailRes = FailRes
  }

  sendSuccess(code, obj, res) {
    const result = new this.SucRes()

    result.setCode = code
    result.setResult = obj
    res.end(this.toString(result))
  }

  sendFailure(code, message, res) {
    const result = new this.FailRes()

    result.setCode = code
    result.setErrMessage = message

    res.end(this.toString(result))
  }

  toString(obj) {
    if (typeof obj !== 'object') {
      throw new Error('typeError')
    }

    return JSON.stringify(obj)
  }
}

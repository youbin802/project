const exception = require('../../_Api_Interface/Exception')
const { Exception } = exception
const ErrorCode = 301

module.exports = class {
  classStart = () => {
    this.code = []
  }

  putCode = (data) => {
    const { type } = data

    if (type === 'update') {
      this.updateCode(data.line, data.code)
      return
    }

    if (type === 'add') {
      this.addCode(data.line, data.code)
      return
    }

    if (type === 'delete') {
      this.deleteCode(data.line)
    }
  }

  updateCode = (line, code) => {
    this.code = code
  }

  addCode = (line, code) => {
    this.code = code
  }

  deleteCode = (line) => {
    this.code = line
  }
}

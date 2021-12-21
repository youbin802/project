const moment = require('moment')

module.exports = class extends Error {
  constructor(code, message = '') {
    super(message)

    this.code = code
    this.setName(this.code)

    this.init()
  }

  init() {
    this.setErrorMessage()
  }

  setName(name) {
    this.name = name
  }

  setErrorMessage() {
    // 타임캘린터
    const dateStr = `[${moment().format(`ddd MMM DD hh:mm:ss YYYY`)}]`
    const processPid = `[pid: ${process.pid}]`
    // const errorMessage = `${this.name}:${this.message} ${this.stack}`
    const errorMessage = `${this.stack}`
    this.message = `${dateStr} ${processPid} ${errorMessage}`
  }
  // [Mon May 10 13:59:14.803938 2021] [php7:error] [pid 185143] [client ::1:56320] PHP Parse error: syntax error, unexpected '<', expecting end of file in /var/www/html/index.php on line 21
}

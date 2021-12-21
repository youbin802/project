const fs = require('fs').promises
const path = require('path')
// eslint-disable-next-line import/no-dynamic-require
const config = require('../../config/config')
const Exception = require('./Exception')

module.exports = new (class index {
  root = config.root

  constructor() {
    this.init()
    this.exports()
  }

  init() {
    this.list = []
  }

  exports() {
    this.Exception = Exception
  }

  addThrow(err) {
    if (!(err instanceof Exception)) {
      return false
    }
    // this.list.push(err)

    this.list.push(err)

    this.throwAll()

    throw err
  }

  throwAll() {
    this.list.forEach((err) => {
      this.writeLog(err)
    })

    this.list = []
  }

  async writeLog(error) {
    const fileRoot = path.join(this.root, '/_log/errorLog') // process.env에 root박기 // 수정 config 에 있음

    const { message } = error

    const date = new Date()
    const fileName = path.join(
      fileRoot,
      `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}.log`,
    )

    const fd = await fs.open(fileName, 'a+')

    try {
      await fd.appendFile(`${message}\n`)
    } catch (err) {
      console.log(err)
    }
  }
})()

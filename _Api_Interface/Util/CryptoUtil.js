const crypto = require('crypto')

const env = process.env.NODE_ENV || 'development'
const config = require('../../config/config')[env]

module.exports = class CryptoUtil {
  constructor() {
    this.init()
  }

  init() {
    this.hashAlgorithm = 'sha256'

    this.algorithm = 'aes-256-cbc'
    this.key = crypto.scryptSync(config.crypto.password, config.crypto.salt, 32)
    this.iv = crypto.randomBytes(16)

    this.cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv)
    this.decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv)
  }

  reset() {
    this.salt = crypto.randomBytes(64).toString()
  }

  encode(str) {
    let result = this.cipher.update(str, 'utf-8', 'base64')
    result += this.cipher.final('base64')

    return result
  }

  decode(str) {
    let result = this.decipher.update(str, 'base64', 'utf-8')
    result += this.decipher.final('utf-8')

    return result
  }

  encodeAbs(string) {
    this.reset()
    const promise = new Promise((resolve, reject) => {
      crypto.pbkdf2(
        string,
        this.salt,
        1000,
        32,
        this.hashAlgorithm,
        (err, key) => {
          if (err) {
            reject(new Error(err.message))
          }

          const hashString = key.toString('base64')

          let hash = ''

          for (let i = 0; i < hashString.length; i += 1) {
            hash += String.fromCharCode(hashString.charCodeAt(i) + 256)
          }

          resolve({ salt: this.salt, hash })
        },
      )
    })

    return promise
  }
}

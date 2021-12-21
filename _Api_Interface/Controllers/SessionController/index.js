const Controller = require('../Controller')
const UserDAO = require('../../DAO/UserDAO')

module.exports = new (class extends Controller {
  constructor() {
    super()

    this.dao = new UserDAO()
  }

  getProcess = async (req, res) => {
    const { user } = req.session

    if (!user) {
      this.sendFailure(400, 'loginPlz', res)
      return
    }

    this.sendSuccess(200, user, res)
  }

  deleteProcess = async (req, res) => {
    const session = req.session.user
    if (!session) {
      this.sendFailure(402, 'forbibben', res)
      return
    }

    req.session.destroy((err) => {
      if (err) {
        this.sendFailure(402, 'forbibben', res)
      }
    })

    this.sendSuccess(204, true, res)
  }

  postProcess = async (req, res) => {
    const { userId } = req.body

    const result = await this.dao.getUser(userId)
    if (!result) {
      this.sendFailure(400, 'bad request', res)
      return
    }

    req.session.user = result

    this.sendSuccess(201, result, res)
  }
})()

const passport = require('passport')
const UserDAO = require('../DAO/UserDAO')
const github = require('./githubStrategy')
const google = require('./googleStrategy')

const dao = new UserDAO()

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      await dao.getUser(id)
    } catch (error) {
      console.log(error)
    }
  })
}

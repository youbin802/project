const router = require('express').Router()
const userRouter = require('./user')
const sessionRouter = require('./session')
// const authRouter = require('./auth')
const classRouter = require('./class')

router.use((req, res, next) => {
  res.contentType('application/json')

  next()
})

router.use('/session', sessionRouter)
// router.use('/auth', authRouter)
router.use('/class', classRouter)
router.use('/user', userRouter)

module.exports = router

const router = require('express').Router()
const ctr = require('../../_Api_Interface/Controllers').classController
  .classMemberController

router.use('/', (req, res, next) => {
  res.locals.type = 'student'
  next()
})

// 수업에 들어와있는 학생을 모두 가져오기 - class/:classId/student
router.get('/', ctr.getStudent)

module.exports = router

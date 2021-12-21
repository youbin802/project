const router = require('express').Router()
const ctr = require('../../_Api_Interface/Controllers').classController
  .classMemberController

router.use('/', (req, res, next) => {
  next()
})

// 수업에 들어와있는 학생을 모두 가져오기 - class/:classId/teacher?type=true
// 수업에 들어와있는 학생을 모두 가져오기 - class/:classId/teacher?type=false
router.get('/', ctr.getTeacher)

module.exports = router

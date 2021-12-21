const router = require('express').Router()
const ctr = require('../../_Api_Interface/Controllers').classController
  .classMemberController

// 수업에 들어와있는 유저를 모두 가져오기 - class/:classId/member
router.get('/', ctr.getMembers)

module.exports = router

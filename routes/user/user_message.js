const router = require('express').Router()
const ctr =
  require('../../_Api_Interface/Controllers/UserController').MessageController

// /user/class/:classId/message
router.use('/:messageId', (req, res, next) => {
  try {
    res.locals.messageId = parseInt(req.params.messageId, 10)
  } catch (error) {}
  next()
})

// 클래스에 있는 학생이 보냈거나 받은 쪽지를 모두 모아볼 수 있는 기능
// user/class/:classId/message/
// 클래스에 있는 학생이 보낸 쪽지를 학생을 기준으로 묶어서 닫지 않은 학생들만 안 읽은 갯수와 학생 이름, 마지막 메시지의 보낸 시간을 반환하는 기능
// user/class/:classId/message/?type=receive
// 클래스에 있는 학생에게 보낸 쪽지를 학생 기준으로 묶어서 마지막 메시지 보낸 시간 반환
// user/class/:classId/message/?type=send
router.get('/', ctr.getProcess)

// 한명에게 받거나 보낸 쪽지 리스트 따로 모아볼 수 있어야함
// user/class/:classId/message/:userId
// 메시지 하나의 자세한 정보
// user/class/:classId/message/:messageId
router.get('/:paramsInfo', ctr.getProcess)

// 학생이 클래스에 있는 교사들을 선택하여 똑같은 쪽지를 전송하는 기능
router.post('/', ctr.postProcess)

// 답장 보내기 기능
router.post('/:messageId', ctr.postProcess)

// 읽었을때
router.put('/:messageId', ctr.putProcess)

// 닫았을 때
router.put('/', ctr.putProcess)

module.exports = router

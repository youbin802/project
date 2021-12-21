const router = require('express').Router()
const ctr =
  require('../../_Api_Interface/Controllers/UserController').ClassController
const messageRouter = require('./user_message')

router.get('/', ctr.getProcess) // select * from class_member join classes using (:userId)

router.use('/:classId', (req, res, next) => {
  res.locals.classId = req.params.classId
  next()
})

router.get('/:classId', ctr.getProcess) // select * from classes join class_member using(:classId) where user_id = :userId

router.post('/', ctr.postProcess) // insert into student values(, :userId, :classId)
// post: {
//   // student에 추가
//   0: {
//     uri: "class",
//     body: {
//       classId: "",
//     },
//   },
// },

router.delete('/:classId', ctr.deleteProcess) // class_student where user_id = :userId AND class_id = :classId

router.use('/:classId/message', messageRouter)

module.exports = router

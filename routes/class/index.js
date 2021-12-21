const router = require('express').Router()
const ctr = require('../../_Api_Interface/Controllers').classController
  .classController

// router.use('/', (req, res, next) => {
//   const session = req.session.user

//   if (!session) {
//     res.send('nosession')
//     return
//   }

//   res.locals.userId = JSON.parse(session).userId

//   next()
// })

router.use('/:classId', (req, res, next) => {
  res.locals.classId = req.params.classId
  next()
})

router.get('/', ctr.getAllClasses)

router.get('/search/', ctr.getSearchClass)

router.get('/:classId', ctr.getClass)

// 클래스 생성
// classInfo : {
//     name : "수학",
//     teacherIdList : ["user1", "user2"]
//   }
//
router.post('/', ctr.postControl)

// 수업 삭제 - class/:classId
router.delete('/:classId', ctr.deleteClass)

// 수업정보 수정
// {
//     classId : "classId",
//     classInfo : {
//         className : 'className',
//         teacherList : ['user1', 'user2'],
//     }
// }
router.put('/:classId', ctr.putControl)

router.use('/:classId/file', require('./classFileRouter'))
router.use('/:classId/member', require('./classMemberRouter'))
router.use('/:classId/student', require('./classStudentRouter'))
router.use('/:classId/teacher', require('./classTeacherRouter'))

module.exports = router

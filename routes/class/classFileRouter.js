const router = require('express').Router()
const { classFileController: ctr } =
  require('../../_Api_Interface/Controllers').classController

router.use('/', (req, res, next) => {
  res.locals.type = 'file'
  next()
})

// 클래스 파일의 원본 파일 정보 가져오기
// class/:classId/file/:classFileId
router.get('/:classFileId', ctr.getClassFile)

// class에서 공유된 모든 파일의 정보를 불러옴
// class/:classId/file/
router.get('/', ctr.getClassFileAll)

// class에 공유할 파일을 삽입함
// router.post('/', upload.fields({ name: 'file' }), ctr.postClassFile)

router.post('/', ctr.uploadProcess, ctr.postClassFile)

// 공유된 파일 삭제 - class/:classId/file/:classFileId
router.delete('/:classFileId', ctr.deleteClassFile)

// 공유된 파일 내용 수정 (수업의 관리자, 부관리자만 가능)
router.put('/', ctr.putClassFile)

module.exports = router

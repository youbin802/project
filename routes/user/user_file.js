const router = require('express').Router()
const ctr =
  require('../../_Api_Interface/Controllers/UserController').FileController

router.use('/:fileId', (req, res, next) => {
  res.locals.fileId = req.params.fileId

  next()
})

router.get('/:fileId', ctr.getProcess) // select * from files where file_id = ":fileId" AND file_id = (select file_id from users_files where user_id = ":userId")

router.post('/', ctr.uploadProcess, ctr.postProcess)
// router.post('/', ctr.postProcess) // insert into users_files values(, body.folderId, :userId, body.fileId)

router.delete('/:fileId', ctr.deleteProcess) // delete from users_files where where file_id = ":fileId" AND file_id = :fileId AND user_id = :userId;

router.put('/:fileId', ctr.putProcess) // update users_files set folder_id = body.target where user_id = :userId

module.exports = router

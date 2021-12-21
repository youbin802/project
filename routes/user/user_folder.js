// 보류

const router = require('express').Router()
const ctr =
  require('../../_Api_Interface/Controllers/UserController').FolderController

router.use('/:folderId', (req, res, next) => {
  res.locals.folderId = req.params.folderId

  next()
})

router.get('/', ctr.getProcess)
router.get('/:folderId', ctr.getProcess) // select * from folders where user_id = :userId AND folder_id = :folderId

router.post('/', ctr.postProcess)

router.delete('/:folderId', ctr.deleteProcess)

router.put('/:folderId', ctr.putProcess)

module.exports = router

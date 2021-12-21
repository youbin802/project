const router = require('express').Router()
const { sessionController } = require('../../_Api_Interface/Controllers')

router.get('/', sessionController.getProcess)

router.delete('/logout', sessionController.deleteProcess)

router.post('/login', sessionController.postProcess)

module.exports = router

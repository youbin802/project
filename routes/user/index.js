const router = require('express').Router()

const folderRouter = require('./user_folder')
const fileRouter = require('./user_file')
const classRouter = require('./user_class')

const config = require('../../config/config')

const ctr =
  require('../../_Api_Interface/Controllers/UserController').UserController

router.post('/', ctr.postProcess) // insert into 제일 먼저
router.get('/github', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${config.development.github.clientId}`,
  )
})
router.get('/githubCallBack', ctr.github)

router.use('/', ctr.checkSession)

router.use('/folder', folderRouter)
router.use('/file', fileRouter)
router.use('/class', classRouter)

router.get('/:userId', ctr.getProcess)
router.get('/', ctr.getListProcess)

router.delete('/', ctr.deleteProcess) // 현재 로그인 되어 있는 유저 삭제

router.put('/', ctr.putProcess) // update user set name = query.name where user_id = :userId

module.exports = router

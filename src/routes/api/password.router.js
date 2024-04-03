const {Router} = require('express')

const PasswordController = require('../../controllers/password.controller')
const { passwordMail, restorePassword }= new PasswordController()

const router = Router()

router.post('/sendResetPassword', passwordMail)

router.post('/restorePassword', restorePassword)

module.exports = router
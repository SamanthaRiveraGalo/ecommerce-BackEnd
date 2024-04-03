const { Router } = require('express')
const { showChat } = require('../controllers/chat.controller')
const { privateAccess } = require('../middlewars/auth.middlewars')

const router = Router()

router.get("/chat", showChat, privateAccess)


module.exports = router
const { Router } = require('express')
const { MockingController } = require('../controllers/mocking.controller')
const { generateProducts } = new MockingController()

const router = Router()

//la ruta la llevo luego al index
router.get('/', generateProducts)

module.exports = router
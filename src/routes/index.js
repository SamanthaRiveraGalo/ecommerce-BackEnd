const { Router } = require('express')

const productsRouter = require('./api/products.router.js')
const cartRouter = require('./api/carts.router.js')
const userRouter = require('./api/users.router.js')
const sessionsRouter = require('./api/sessions.router.js')
const mailRouter = require('./api/mail.router.js')
const passwordRouter = require('./api/password.router.js')

const viewsRouter = require('./views.router.js')
const chatRouter = require('./chat.router.js')
const mockingRouter = require('./mockingProductsRoutes.js')
const logger = require('./logger.router.js')

const router = Router()

//VIEWS
router.use('/views', viewsRouter)
router.use('/views', chatRouter)

router.use('/mockingproduct', mockingRouter )
router.use('/logger', logger)


//API
router.use('/api/products', productsRouter)
router.use('/api/carts', cartRouter)
router.use('/api/users', userRouter)
router.use('/api/sessions', sessionsRouter)
router.use('/api', mailRouter)
router.use('/api', passwordRouter)


module.exports = router
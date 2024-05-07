const { Router } = require('express')

const viewsController = require('../controllers/viewsController')
const { passsportCall } = require('../utils/passportCall')
const { authorizationJwt } = require('../middlewars/jwtPassport.middleware')

const router = Router()

const {
    register,
    login,
    handlebars,
    realTimeProducts,
    products,
    productId,
    cartId,
    getPago,
    payments
} = new viewsController()

//VISTA LOGIN - REGISTER Y PROFILE

router.get('/register', register)
router.get('/login', login)

//RUTA CON HANDLEBARS
router.get('/', handlebars)

//WEBSOCKET AGREGAR UN PRODUCTO Y ELIMINAR UN PRODUCTO

router.get("/realtimeproducts", realTimeProducts);

//VISTA DE PRODUCTOS

router.get('/products', [passsportCall('jwt'), authorizationJwt(['ADMIN', 'USER', 'PREMIUN'])] ,products)

//DETALLE DE UN PRODUCTO

router.get('/products/:pid', [passsportCall('jwt'), authorizationJwt(['ADMIN', 'USER', 'PREMIUN'])],productId)

//VISTA DEL CARRITO

router.get('/cart/:cid', [passsportCall('jwt'), authorizationJwt(['USER', 'PREMIUN'])] , cartId)

//VISTA PAGO EXITOSO
router.get('/payments', [passsportCall('jwt'), authorizationJwt(['USER', 'PREMIUN'])], payments)

//VISTA PAGO TARJETA
router.get('/payments/:cid', [passsportCall('jwt'), authorizationJwt(['USER', 'PREMIUN'])], getPago)

//VISTA DE CONTRASENIA

router.get('/forgot', (req, res) => {
    res.render('forgot')
})

router.get('/restorePassword/:token', (req,res)=>{
    const { token } = req.params
    res.render('restorePassword', { token })
})

module.exports = router
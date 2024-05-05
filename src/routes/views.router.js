const { Router } = require('express')

const viewsController = require('../controllers/viewsController')
const { publicAccess, privateAccess } = require('../middlewars/auth.middlewars')
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
    cartId
} = new viewsController()


//VISTA LOGIN - REGISTER Y PROFILE

router.get('/register', publicAccess, register)

router.get('/login', publicAccess, login)


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

//VISTA DE CONTRASENIA

router.get('/forgot', (req, res) => {
    res.render('forgot')
})

router.get('/restorePassword/:token', (req,res)=>{
    const { token } = req.params
    res.render('restorePassword', { token })
})

module.exports = router
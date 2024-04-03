const { Router } = require('express')

const viewsController = require('../controllers/viewsController')
const { publicAccess, privateAccess } = require('../middlewars/auth.middlewars')

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

router.get('/products', products)

//DETALLE DE UN PRODUCTO

router.get('/products/:pid', productId)

//VISTA DEL CARRITO

router.get('/cart/:cid', privateAccess, cartId)

//VISTA DE CONTRASENIA

router.get('/forgot', (req, res) => {
    res.render('forgot')
})

router.get('/restorePassword/:token', (req,res)=>{
    const { token } = req.params
    res.render('restorePassword', { token })
})

module.exports = router
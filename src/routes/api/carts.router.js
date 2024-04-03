const { Router } = require('express')

const CartController = require('../../controllers/cart.controller')
const { passsportCall } = require('../../utils/passportCall')
const { authorizationJwt } = require('../../middlewars/jwtPassport.middleware')

const {
    carts,
    cartId,
    createCart,
    addProductCart,
    updateCart,
    quantityUpdate,
    cartDelete,
    deleteProductCart,
    finalizePurchase
} = new CartController()


const router = Router()


router.get('/', carts)

router.get('/:cid', cartId)

router.post('/',createCart)

router.post('/:cid/products/:pid', [passsportCall('jwt'), authorizationJwt(['USER'])], addProductCart)

router.put('/:cid', updateCart)

router.put('/:cid/products/:pid', quantityUpdate)

router.delete('/:cid', cartDelete);

router.delete('/:cid/products/:pid', deleteProductCart)

//TICKET
router.post('/:cid/purchase',[passsportCall('jwt'), authorizationJwt(['USER'])], finalizePurchase)



module.exports = router
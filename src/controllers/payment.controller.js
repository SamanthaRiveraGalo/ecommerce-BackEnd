const cartModel = require("../dao/models/carts.model.js");
const { usersService } = require("../repositories/index.js");
const PaymentService = require("../utils/payments.js");

class Payments {
    constructor() {
        this.userService = usersService
    }

    purchaseStripe = async (req, res) => {

        const uid = req.params.uid

        try {

            const user = this.userService.getUserBy({ _id: uid })
            const cart = cartModel.findById({ _id: cid }).populate("products._id").lean()
            const productsCart = cart.products

            console.log(productsCart)

            // const totalAmount = productsCart.reduce((acc, cartProduct) => {
            //     return acc + (cartProduct.product.price * cartProduct.quantity);
            // }, 0)

            const stripeProducts = productsCart.map((cartProduct) => ({
                name: cartProduct.product.title,
                amount: cartProduct.product.price * 100,
                currency: "usd",
                quantity: cartProduct.quantity,
                metadata: {
                    productId: cartProduct.product._id,
                },
            }))

            console.log(stripeProducts)

            const paymentsIntentsInfo = {
                amount: stripeProducts.price, //si son varios producto tendria que ser la suma total
                currency: 'usd',
                description: "Compra de productos",
                metadata: {
                    userId: uid,
                    // orderDetails: JSON.stringify({ [stripeProducts.name]: 2 }, null, '\t'),
                    // address: JSON.stringify({
                    //     street: 'calle de prueba',
                    //     postalCode: "4000",
                    //     externalNumber: '321654654'
                    // }, null, '\t')
                }
            }

            const service = new PaymentService()
            let result = await service.createPaymentIntent(paymentsIntentsInfo)


            res.send({ status: 'Success', payload: result })

        } catch (error) {

        }
    }
}

module.exports = Payments
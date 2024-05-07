const CartDaoMongo = require("../dao/managerMongo/cartManagerMongo");
const ProductDaoMongo = require("../dao/managerMongo/productManagerMongo");
const { ticketService, usersService } = require("../repositories/index.js");
const { CustomError } = require("../services/customError.js");
const { EErrors } = require("../services/enum.js");
const { generateCartRemoveErrorInfo } = require("../services/info.js");
const { sendMail } = require("../utils/sendMail.js");

class CartController {

    constructor() {
        this.cartService = new CartDaoMongo()
        this.productService = new ProductDaoMongo()
        this.ticket = ticketService
    }

    carts = async (req, res) => {
        try {
            const carts = await this.cartService.getCarts();
            if (!carts) {
                return res.status(404).send({
                    status: "Error",
                    message: { error: "Carrito no encontrado" },
                });
            }
            return res.send({ status: "Sucess", payload: carts });

        } catch (error) {
            req.logger.error(error)
        }
    }

    cartId = async (req, res) => {

        try {

            const cartId = req.params.cid;

            const carts = await this.cartService.getCartById(cartId);


            if (!carts) {
                return res.status(404).send({
                    status: "Error",
                    message: { error: "Carrito por id no encontrado" },
                });
            }
            return res.send({ status: "Sucess", payload: carts });

        } catch (error) {
            req.logger.error('carrito no encontrado', error)
        }
    }

    createCart = async (req, res) => {
        try {

            const newCart = req.body

            const result = await this.cartService.createCart(newCart)
            if (!result) {
                return res.status(400).send({ status: "Error", message: { error: "No se pudo agregar ningun producto" } });
            }

            res.send({
                status: 'success',
                payload: result
            })

        } catch (error) {
            req.logger.error(error)
        }

    }


    addProductCart = async (req, res) => {
        try {

            const cartId = req.params.cid;
            const prodId = req.params.pid;

            const cart = await this.cartService.AddProductToCart(cartId, prodId);
            if (!cart) {

                return res.status(400).send({
                    status: "Error",
                    message: { error: "no se pudo actualizar el carrito" }
                });

            }

            return res.status(200).send({
                status: "Success",
                payload: cart,
            });

        } catch (error) {
            console.log(error)
        }
    }

    updateCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const prod = req.body

            const update = await this.cartService.updateCart(cartId, prod)

            return res.status(200).send({
                status: "Success",
                payload: update,
            });


        } catch (error) {
            req.logger.error(error)
        }
    }

    quantityUpdate = async (req, res) => {
        try {
            const { cid, pid } = req.params
            const { quantity } = req.body

            const result = await this.cartService.updateQuantity(cid, pid, quantity)

            if (result.success) {
                res.json({
                    status: 'success',
                    message: 'Cantidad modificada',
                })
            } else {
                res.status(404).json({
                    status: 'error',
                    message: 'Carrito o producto no encontrado',
                })
            }
        } catch (error) {
            req.logger.error(error)
            res.status(500).send('Server error')
        }
    }

    cartDelete = async (req, res) => {
        try {
            const cartId = req.params.cid;

            const deleteCart = await this.cartService.deleteAllProducts(cartId);

            if (!deleteCart) {

                return res.status(400).send({
                    status: "Error",
                    message: { error: "no se pudo eliminar el carrito" }
                });

            }

            return res.status(200).send({
                status: "Success",
                payload: deleteCart,
            });

        } catch (error) {
            req.logger.error(error)
        }
    }

    deleteProductCart = async (req, res) => {
        try {
            const cartId = req.params.cid;
            const prodId = req.params.pid;

            if (!cartId || !prodId) {
                CustomError.createError({
                    name: 'product delete error',
                    cause: generateCartRemoveErrorInfo({ cartId, prodId }),
                    message: 'Error trying to delete product from cart',
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }

            const deleteProduct = await this.cartService.deleteProduct(cartId, prodId)

            if (!deleteProduct) {

                return res.status(400).send({
                    status: "Error",
                    message: { error: "no se pudo eliminar el producto del carrito" }
                });

            }

            return res.status(200).send({
                status: "Success",
                payload: deleteProduct,
            });

        } catch (error) {
            req.logger.error(error)
        }
    }

    //ticket 

    finalizePurchase = async (req, res) => {

        const { cid } = req.params

        try {
            const cart = await this.cartService.getCartById(cid)
            // console.log(JSON.stringify(cart, null, 3))

            //productos que no tenemos en stock
            const unavalibleProducts = []
            let totalAmount = 0

            for (const item of cart.products) {
                const productId = item._id
                const quantity = item.quantity

                const product = await this.productService.getProductById(productId)

                if (product.stock >= quantity) {
                    product.stock -= quantity
                    // await product.save()

                    totalAmount += product.price * quantity

                    this.cartService.deleteProduct(cid, productId)
                } else {
                    unavalibleProducts.push(productId)
                }
            }

            // ticket - mandamos el total y el email
            const userEmail = req.user.email

            const ticket = await this.ticket.createTicket(totalAmount, userEmail)

            const subject = "Confirmación de compra"
            const html = `
                        <h1>¡Tu compra se ha realizado con éxito!</h1>
                        <p>Hola ${userEmail},</p>
                        <p>Te informamos que tu compra ha sido confirmada.</p>
                        <p>Tu numero de ticket es: ${ticket.code}</p>
                        <p>El monto total de la compra es: $${totalAmount}</p>
                        <p>Gracias por confiar en nosotros!</p>
                         `
            await sendMail(userEmail, subject, html)

            res.status(200).send({ message: 'Compra exitosa', unavalibleProducts: unavalibleProducts })

        } catch (error) {
            res.status(500).send(error.message)
        }
    }

}

module.exports = CartController
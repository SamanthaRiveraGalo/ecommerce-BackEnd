const CartDaoMongo = require("../dao/managerMongo/cartManagerMongo");
const ProductDaoMongo = require("../dao/managerMongo/productManagerMongo");
const { ticketService } = require("../repositories/index.js");
const { CustomError } = require("../services/customError.js");
const { EErrors } = require("../services/enum.js");
const { generateCartRemoveErrorInfo } = require("../services/info.js");

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
            const cartId = req.params.cid;
            const prodId = req.params.pid;
            const quantity = req.body.quantity;

            const updateCart = await this.cartService.updateQuantity(cartId, prodId, quantity)

            return res.status(200).send({
                status: "Success",
                payload: updateCart,
            });


        } catch (error) {
            req.logger.error(error)
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
            //busco el carrito por el id
            const cart = await this.cartService.getCartById(cid)
            // console.log(JSON.stringify(cart, null, 3));

            //productos que no tenemos en stock
            const unavalibleProducts = []
            let totalAmount = 0

            //por cada item del carrito
            for (const item of cart.products) {
                const productId = item._id
                const quantity = item.quantity

                const product = await this.productService.getProductById(productId); //el id del producto si lo toma
                //cerificamos el stock y cantidad y actualizamos
                if (product.stock >= quantity) {
                    product.stock -= quantity;
                    await product.save()
                    // monto total
                    totalAmount += product.price * quantity
                    //eliminamos el product del carrito 
                    this.cartService.deleteProduct(cid, productId)
                } else {
                    //sino lo agregamos a productos no disponibles
                    unavalibleProducts.push(productId)
                }
            }

            // ticket - mandamos el total y el email
            const userEmail = req.user.email

            const tiket = await this.ticket.createTicket(totalAmount, userEmail)

            res.status(200).send({ message: 'Compra exitosa', unavalibleProducts: unavalibleProducts });

        } catch (error) {
            res.status(500).send(error.message)
        }
    }

}

module.exports = CartController
const cartModel = require("../models/carts.model")
const productModel = require("../models/product.model")

// aca debe haber algun error por que no me los metodos
class CartDaoMongo {
    constructor() {
        this.model = cartModel
        this.productModel = productModel
    }

    async getCarts() {
        return await this.model.find().lean()
    }
    async getCartById(cid) {

        return await this.model.findOne({ _id: cid })
    }

    async createCart(newCart) {
        return await this.model.create({ products: [] })
    }

    async AddProductToCart(cid, pid) {
        try {

            const cart = await this.model.findOne({ _id: cid })
            if (!cart) {
                return 'No se encuentra el carrito'
            }

            const productIndex = cart.products.findIndex(product => product._id.equals(pid))
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1
            } else {
                cart.products.push({ _id: pid, quantity: 1 })
            }

            await cart.save()
            return cart

        } catch (error) {
            req.logger.error(error)
        }
    };
    //revisar
    async updateCart(cid, prods) {
        try {

            const updatedCart = await this.model.findOneAndUpdate(
                { _id: cid },
                { $push: { products: prods } },
                { new: true }
            );

            return updatedCart;

        } catch (error) {
            req.logger.error(error)
        }

    }

    async updateQuantity(cartId, productId, newQuantity) {
        try {
            const cart = await this.model.findOne({ _id: cartId })

            if (!cart) {
                return { success: false }
            }

            const productIndex = cart.products.findIndex(
                (item) => item._id.toString() === productId
            )

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity

                await cart.save()

                return { success: true }
            } else {
                return { success: false }
            }
        }
        catch (error) {
            req.logger.error(error)
        }
    }

    deleteAllProducts = async (cid) => {
        try {

            const cart = await this.model.findOne({ _id: cid });

            if (!cart) {
                req.logger.error('no se encontro el carrito/manager', error)
            }


            cart.products = [];

            const updatedCart = await cart.save();

            return updatedCart;

        } catch (error) {
            req.logger.error(error)
        }
    }

    //eliminar un producto 
    async deleteProduct(cid, pid) {
        try {

            const cart = await this.model.findOne({ _id: cid })

            if (!cart) {
                return 'No se encuentra el producto a eliminar'
            }

            const productIndex = cart.products.findIndex(product => product._id.equals(pid))

            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
            }


            await cart.save();
            return cart;

        } catch (error) {
            req.logger.error(error)
        }
    }


}

module.exports = CartDaoMongo
const CartDaoMongo = require("../dao/managerMongo/cartManagerMongo")
const ProductDaoMongo = require("../dao/managerMongo/productManagerMongo")
const cartModel = require("../dao/models/carts.model")
const { ticketService } = require("../repositories")

const productService = new ProductDaoMongo()

class viewsController {
    constructor() {
        this.cartModel = cartModel
        this.ticket = ticketService
    }

    register = (req, res) => {
        res.render('register')
    }

    login = (req, res) => {
        res.render('login')
    }

    handlebars = async (req, res) => {

        const products = await productService.getProducts()

        res.render('home', { products })

    }

    realTimeProducts = async (req, res) => {
        try {

            const products = await productService.getProducts()
            res.status(200).render("realTimeProducts", { products });

        } catch (error) {
            req.logger.error(error)
        }

    }

    products = async (req, res) => {
        try {

            const { page = 1 } = req.query;
            const limit = req.query.limit;
            const query = req.query;
            const user = req.user

            const {
                payload: products,
                hasPrevPage,
                hasNextPage,
                nextPage,
                prevPage,
            } = await productService.getProducts(limit, page, query)

            if(user){

                return res.render("products", {
                    products: products,
                    page,
                    hasPrevPage,
                    hasNextPage,
                    prevPage,
                    nextPage,
                    user: user
                })
            }
            
            return res.render("home")

        } catch (error) {
            req.logger.error(error)
        }

    }

    productId = async (req, res) => {

        try {

            const proId = req.params.pid
            const user = req.user

            const product = await productService.getProductById(proId)

            if (!product) {
                return res.status(404).send({ status: "Error", error: "id no encontrado", })
            }

            res.status(200).render("productDetail", { product, user })

        } catch (error) {
            req.logger.error(error)
        }
    }

    cartId = async (req, res) => {

        const cid = req.params.cid
        const user = req.user

        const cart = await this.cartModel.findById({ _id: cid }).populate("products._id").lean()

        const products = cart.products

        let amountTotal = 0
        let quantityTotal = 0

        products.forEach(product => {
            quantityTotal += product.quantity
            amountTotal += product.quantity * product._id.price
        })
        amountTotal = amountTotal.toFixed(2)


        res.status(200).render('cart', { products, amountTotal, user, cart, cid })
    }

    payments = async (req, res) => {
        const user = req.user

        res.render('paymentSucces', user)
    }

    getPago = async (req, res) => {

        const cid = req.params.cid
        const user = req.user

        const cart = await this.cartModel.findById({ _id: cid })

        res.render('payments', { cart, user })
    }
}

module.exports = viewsController
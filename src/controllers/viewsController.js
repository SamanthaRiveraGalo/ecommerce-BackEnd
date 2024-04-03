const CartDaoMongo = require("../dao/managerMongo/cartManagerMongo")
const ProductDaoMongo = require("../dao/managerMongo/productManagerMongo")

const productService = new ProductDaoMongo()
const cartService = new CartDaoMongo()

class viewsController {
    constructor() { }

    register = (req, res) => {
        res.render('register')
    }

    login = (req, res) => {
        res.render('login')
    }

    handlebars = async (req, res) => {

        const products = await productService.getProducts()

        res.render('index', { products })

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

            const {
                payload: products,
                hasPrevPage,
                hasNextPage,
                nextPage,
                prevPage,
            } = await productService.getProducts(limit, page, query);

            return res.render("products", {
                products: products,
                page,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
            });


        } catch (error) {
            req.logger.error(error)
        }

    }

    productId = async (req, res) => {

        try {

            const proId = req.params.pid;

            const product = await productService.getProductById(proId)


            if (!product) {
                return res.status(404).send({ status: "Error", error: "id no encontrado", });
            }

            res.status(200).render("productDetail", product);

        } catch (error) {
            req.logger.error(error)
        }
    }

    cartId = async (req, res) => {

        const cid = req.params.cid

        const cart = await cartService.getCartById(cid)

        res.status(200).render('cart', cart)
    }
}

module.exports = viewsController
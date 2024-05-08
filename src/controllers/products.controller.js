const ProductDaoMongo = require("../dao/managerMongo/productManagerMongo")
const { CustomError }  = require("../services/CustomError.js")
const { EErrors } = require("../services/enum.js");
const { createProductErrorInfo } = require("../services/info");
const { logger } = require("../utils/logger.js");
const { sendMail } = require("../utils/sendMail.js");

class ProductController {

    constructor() {

        this.productServiceMongo = new ProductDaoMongo()
    }

    getsProducts = async (req, res) => {

        try {

            const limit = req.query.limit
            const page = req.query.page
            const query = req.query

            const products = await this.productServiceMongo.getProducts(limit, page, query)

            res.status(200).send({ status: "Success", payload: products })


        } catch (error) {
            req.logger.error(error)
        }

    }

    getProductId = async (req, res) => {

        try {

            const pid = req.params.pid
            const product = await this.productServiceMongo.getProductById(pid)

            if (!product) {
                return res.status(404).send({ status: "Error", error: "producto para id no encontrado", })
            }

            return res.status(200).send({ status: "Success", payload: product })

        } catch (error) {
            req.logger.error(error)
        }

    }

    createProduct = async (req, res, next) => {

        try {

            const { title, description, code, price, thumbnail, stock, category } = req.body;
            const user = req.user
            console.log('user-en productos:', user)

            if (!title || !description || !code || !price || !stock || !category) {
                CustomError.createError({
                    name: 'product creation error',
                    cause: createProductErrorInfo({ title, description, code, stock, price, category }),
                    message: 'Error trying to created product',
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }

            if (!user.role === 'premium') {
                return res.status(403).send({ status: "Error", error: 'Solo usuarios premium pueden crear productos' });
            }

            const newProduct = {
                title,
                description,
                code,
                price,
                stock,
                thumbnail,
                category,
                owner: user.email,
            };

            console.log('producto con owner:', newProduct)

            const result = await this.productServiceMongo.createProduct(newProduct);

            if (!result) {
                return res.status(400).send({ status: "Error", error: "El producto no se agrego", });
            }

            return res.status(201).send({ status: "Success", payload: result, })

        } catch (error) {
            req.logger.error(error)
        }

    }

    updateProduct = async (req, res) => {
        try {
            const productToUpdate = req.body
            const pid = req.params.pid

            const updateProduct = await this.productServiceMongo.updateProduct(pid, productToUpdate)
            if (!updateProduct) {

                return res.status(400).send({
                    status: "Error",
                    error: "el producto no se pudo actualizar",
                });

            }
            return res.status(200).send({
                status: "Success",
                payload: updateProduct,
            })

        } catch (error) {
            req.logger.error(error)
        }

    }

    deleteProduct = async (req, res) => {
        try {

            const pid = req.params.pid
            const user = req.user

            const product = await this.productServiceMongo.getProductById(pid)

            if (user.role === 'admin' || user.email === product.owner) {
                if (user.email === product.owner) {
                    try {
                        const htmlContent = `
                            <p>Hola ${product.owner},</p>
                            <p>Le informamos que su producto "${product.title}" ha sido eliminado de nuestra plataforma.</p>
                            <p>Si tiene alguna pregunta o inquietud, no dude en contactarnos.</p>
                        `
                        await sendMail(product.owner, 'Producto eliminado', htmlContent)
                        console.log(`Correo electrónico enviado a: ${product.owner}`)
                    } catch (error) {
                        req.logger.error(error)
                        console.log(`Error al enviar correo electrónico: ${error.message}`)
                    }
                }

                const response = await this.productServiceMongo.deleteProduct(pid)
                res.status(200).send({ message: 'Producto eliminado', response })

            } else {
                return res.status(403).send({ status: "Error", error: 'No tienes permiso para eliminar este producto' })
            }

            return res.status(404).send({ status: "Error", error: "producto para eliminar no encontrado", })

        } catch (error) {
            req.logger.error(error)
        }

    }

}

module.exports = ProductController
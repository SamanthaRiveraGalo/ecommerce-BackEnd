const { logger } = require("../../utils/logger");
const productModel = require("../models/product.model")

class ProductDaoMongo {
    constructor() {
        this.model = productModel
    }

    async getProducts(limit, page, query) {

        try {

            const options = {
                limit: limit || 4,
                page: page || 1,
                sort: {}
            }

            const filter = {}
            const categoryFilter = query && query.category;
            const sortOption = query && query.sort;

            if (categoryFilter) {
                filter.category = query.category
            }
            if (sortOption) {
                if (query.sort === "asc") {
                    options.sort = { price: 1 };
                } else {
                    options.sort = { price: -1 };
                }
            }

            const data = await this.model.paginate(filter,options)

            const products = data.docs.map((prod)=>prod.toObject())

            if (products.length === 0) {
              logger.info('producto no encontrado')
            }

            const totalPages = data.totalPages;
            const prevPage = data.prevPage;
            const nextPage = data.nextPage;
            const currentPage = data.page;
            const hasPrevPage = data.hasPrevPage;
            const hasNextPage = data.hasNextPage;
            const prevLink = hasPrevPage ? `/products?page=${prevPage}` : null;
            const nextLink = hasNextPage ? `/products?page=${nextPage}` : null;

            const response = {
                status: "success",
                payload: products,
                totalPages,
                prevPage,
                nextPage,
                page: currentPage,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink
            };

            return response;

        } catch (error) {
            req.logger.error(error)
        }
    }

    async getProductById(pid) {

        return await this.model.findOne({ _id: pid })
    }

    async createProduct(newProduct) {

        return await this.model.create(newProduct)
    }

    async updateProduct(pid, productToUpdate) {

        return await this.model.findByIdAndUpdate({ _id: pid }, productToUpdate)
    }

    async deleteProduct(pid) {

        return await this.model.deleteOne({ _id: pid })
    }

}

module.exports = ProductDaoMongo
const {faker} = require('@faker-js/faker')

class MockingProducts {
    constructor() { }

    async generateProducts() {
        const categories = ['Hombre', 'Mujer']
        const numOfProducts = faker.number.int({ min: 0, max: 100 })
        const products = []

        for (let i = 0; i < numOfProducts; i++) {
            const product = {
                _id: faker.database.mongodbObjectId(),
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                code: faker.string.alphanumeric(8),
                price: faker.commerce.price(),
                stock: faker.number.int({ min: 0, max: 20 }),
                category: faker.helpers.arrayElement(categories),
                thumbnail: faker.image.url()
            }
            products.push(product)
        }
        return products
    }
}

module.exports = { MockingProducts }
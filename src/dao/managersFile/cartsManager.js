const fs = require('node:fs')
const { logger } = require('../../utils/logger')

const path = './src/mockDB/carts.json'

class CartsManager {
    constructor() {
        this.path = path
        this.cart = []
    }

    //leo el archivo 
    readFile = async () => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            logger.info(data)
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }

    //crear carrito
    createCart = async () => {

        const carts = await this.readFile()

        let newCart;
        if (carts.length > 0) {
            newCart = { id: carts.length + 1, products: [] };
        } else {
            newCart = { id: 1, products: [] };
        }

        carts.push(newCart);

        const resultsCart = await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8');
        return resultsCart;
    };

    //por id
    getCartById = async (cid) => {

        const carts = await this.readFile();
        const cartId = carts.find((cart) => cart.id === parseInt(cid));

        return cartId || []; // Devuelve el carrito si lo encuentra, o un array vacío si no lo encuentra
    }


    addProductToCart = async (cid, pid) => {
        //leo el archivo
        const carts = await this.readFile()
        //busco el cart por el id
        const cartIndex = carts.findIndex((cart) => cart.id === cid)

        if (cartIndex !== -1) {
            return 'No se encuentra el carrito'
        }

        //busco el producto en el carrito con el id
        const productIndex = carts[cartIndex].products.findIndex(product => product.productId === pid)

        if (productIndex !== 1) {
            carts[cartIndex].products[productIndex].quantity += 1
        } else {
            //si el producto existe, incremento la cantidad
            carts[cartIndex].products.push({ productId: pid, quantity: 1 })
        }
        //luego lo escribo
        const results = await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), 'utf-8')
        return results
    }

}

module.exports = CartsManager
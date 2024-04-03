const fs = require("node:fs");

const path = "./src/mockDB/products.json"

class ProductManager {

    constructor() {
        this.products = [];
        this.path = path;
    }

    // clear products
    async clearProducts() {

        this.products = [];
        const productsJSON = JSON.stringify(this.products, null, 2);

        await fs.promises.writeFile(this.path, productsJSON);

    }

    readFile = async () => {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }


    //validaciones
    validateProduct = ({ title, description, price, thumbnails, code, stock }) => {

        if (!title || !description || !price || !thumbnails || !code || !stock) {
            // throw new Error("Por favor, complete todos los campos");
            return ("Por favor, complete todos los campos");
        }

        const existingProduct = this.products.find((product) => product.code === code);
        if (existingProduct) {
            // throw new Error("Ya existe un producto con el mismo título.");
            return ("Ya existe un producto con el mismo título.");
        }
    };


    async addProduct({ title, description, price, thumbnails, code, stock }) {

        const products = await this.readFile()

        const newProduct = {
            id: products[products.length - 1].id + 1,
            title,
            description,
            price,
            thumbnails,
            code,
            stock
        };

        this.validateProduct(newProduct);
        products.push(newProduct);
        const productsJSON = JSON.stringify(products, null, 2);
        await fs.promises.writeFile(this.path, productsJSON);
        return newProduct;

    }


    async getProducts() {

        const products = await this.readFile()
        return products;
    }


    async getProductById(id) {

        const product = this.products.find((product) => product.id === id);

        if (!product) {
            throw new Error("No se encontro el producto");
        }

        return product;
    }


    async updateProduct(id, title, description, price, thumbnails, code, stock) {

        this.products = await this.readFile()

        const productIndex = this.products.findIndex((product) => product.id === id);

        if (productIndex === -1) {
            return "Producto no encontrado";
        }

        if (!title || !description || !price || !thumbnails || !code || !stock) {
            // throw new Error("Completar todos los campos");
            return "Completar todos los campos";
        }

        //actualizo el producto
        this.products[productIndex] = { id, title, description, price, thumbnails, code, stock };

        const productsJSON = JSON.stringify(this.products, null, 2);
        await fs.promises.writeFile(this.path, productsJSON);

        return this.products[productIndex];
    }


    async deleteProduct(id) {
        console.log('entra al manager')

        const products = await this.readFile()

        const productIndex = products.findIndex((product) => product.id === id);

        if (productIndex === -1) {
            return "Product not found";
        }

        const deletedProduct = products[productIndex];
        products.splice(productIndex, 1);

        const productsJSON = JSON.stringify(products, null, 2);
        await fs.promises.writeFile(this.path, productsJSON);

        return deletedProduct;
    }

}

module.exports = ProductManager;
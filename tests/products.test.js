const chai = require('chai')
const supertest = require('supertest')
const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing de products', () => {

    // it('should return a list of products', async () => {

    //     const response = await requester.get('/api/products');

    //     expect(response.status).to.equal(200);
    //     expect(response._body.payload.payload).to.be.an('array');
    // })

    // it('Deberia traer un producto por el id', async () => {

    //     const productId = '658383513b801dcfe9bc2075'

    //     const response = await requester.get(`/api/products/${productId}`)
    //     const { statusCode, ok } = response

    //     expect(statusCode, 200)
    //     expect(ok, true)
    //     expect(response._body.payload).to.have.property('_id')
    // })

    it('Deberia agregar un nuevo producto', async () => {

        const newProduct = {
            title: "Nuevo Producto",
            description: "Descripción del nuevo producto",
            code: "adg56",
            price: 800,
            stock: 10,
            thumbnail: "sin img",
            category: "mujer"
        }

        const response = await requester.post('/api/products').send(newProduct).set()

        console.log(response._body)

        // expect(response).to.have.status(200)
        expect(response.body.status).to.equal('success')
        // expect(response._body.payload).to.have.property('_id')
    })

})
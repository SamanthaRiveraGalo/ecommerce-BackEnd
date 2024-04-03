const chai = require('chai')
const supertest = require('supertest')
const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('test cart', () => {

    it('debria traer la lista de carritos', async () => {

        const response = await requester.get('/api/carts')

        expect(response.status).to.equal(200)
        expect(response._body.payload).to.be.an('array')
    });

    it('Deberia traer un carrito por el id', async () => {

        const cartId = '65838a2fa76ab3cf10efaca7'

        const response = await requester.get(`/api/carts/${cartId}`)
        const { statusCode, ok } = response

        expect(statusCode, 200)
        expect(ok, true)
        expect(response._body.payload).to.have.property('_id')
    })

    it("Deberia crear un carrito", async  () => {

        const response = await requester.post('/api/carts')

        expect(response.status).to.equal(200)
        expect(response._body.payload).to.have.property('_id')
        expect(response._body.payload).to.have.property('products')
    });

});
const chai = require('chai')
const supertest = require('supertest')
const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Test para sessions', () => {
    let cookie

    // it('Deberia registrar un usuario', async () => {
    //     let userMock = {
    //         first_name: 'sam',
    //         last_name: 'prueba testing',
    //         email: 'sam@gmail.com',
    //         password: '12345'
    //     }

    //     const response = await requester.post('/api/sessions/register').send(userMock)

    //     expect(response).to.be.ok
    // })

    // it('Deberia ingresar un usuario correctamente y devolver una cookie', async () => {

    //     const userMock = {
    //         email: "s@gmail.com",
    //         password: "123456",
    //     }

    //     const response = await requester.post(`/api/login`).send(userMock)

    //     const cookieResult = response.header['set-cookie'][0]

    //     expect(cookieResult).to.be.ok

    //     cookie = {
    //         name: cookieResult.split('=')[0],
    //         value: cookieResult.split('=')[1]
    //     }

    //     expect(cookie.name).to.be.ok.and.eql('connect.sid')
    //     expect(cookie.value).to.be.ok
        
    // })

    it('Deberia cerrar sesion', async () => {

        const response = await requester.post('/api/sessions/logout')

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('status', 'success')
    })
})
const chai = require('chai')
const supertest = require('supertest')
const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Test para sessions', () => {
    let cookie
    let cookieResult

    it('Deberia registrar un usuario', async () => {
        let userMock = {
            first_name: 'sam',
            last_name: 'prueba testing',
            email: 'sam@gmail.com',
            password: '12345'
        }

        const response = await requester.post('/api/sessions/register').send(userMock)
        expect(response).to.be.ok
    })

    it('Deberia ingresar un usuario correctamente y devolver una cookie', async () => {

        const userMock = {
            email: "adminCoder@coder.com",
            password: "1234",
        }

        const response = await requester.post(`/api/login`).send(userMock)

        cookieResult = response.header['set-cookie'][0]

        expect(cookieResult).to.be.ok

        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1]
        }

        expect(cookie.name).to.be.ok.and.eql('connect.sid')
        expect(cookie.value).to.be.ok

    })

    it('test para la ruta current', async () => {
        
        const response = await requester.get('/api/sessions/current').set('Cookie', cookieResult)

        const { statusCode } = response

        expect(statusCode, 200)
    })
})
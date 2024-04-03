const jwt = require('jsonwebtoken')
const JWT_PRIVATE_KEY = "CoderSecretoJsonWebToken"

//una fn parra generar una firma

exports.createToken = user => {
    const token = jwt.sign(user, JWT_PRIVATE_KEY, { expiresIn: '24h' })
    return token
}
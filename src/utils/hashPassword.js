const bcrypt = require('bcrypt')

exports.createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
//el primer passwors es el de login y el segundo es el de la base de datos
// esto retorna true o false
exports.isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}
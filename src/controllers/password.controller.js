const { configObject } = require("../config/index.js")
const { usersService } = require("../repositories/index.js")
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const { createHash } = require("../utils/hashPassword.js")

class PasswordController {
    constructor() {
        this.userServiceMongo = usersService
    }

    passwordMail = async (req, res) => {

        try {
            const email = req.body.email

            const user = await this.userServiceMongo.getUserBy({ email })

            if (!user) {
                return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' })
            }

            //generar el token nuevo - en una hora expira
            const newToken = jwt.sign({ email }, configObject.jwt_secret_key, { expiresIn: '1 h' })

            const transport = nodemailer.createTransport({

                service: 'gmail',
                port: 587,
                auth: {
                    user: configObject.gmail_user_app,
                    pass: configObject.gmail_pass_app
                }

            })

            const mailOptions = {
                from: 'Este mail lo envia <samirivera1808@gmail.com>',
                to: email,
                subject: "Restaurar contraseña",
                html: `<h1>Recuperar la contraseña</h1>
                      <hr>
                      <p> Por favor ingrese al siguiente link para recuperar su contraseña, el link expira dentro de 1 hora</p>
                      <a href="http://localhost:8080/views/restorePassword/${newToken}">CLICK HERE</a>
                     `,
            };

            transport.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar correo electrónico:', error);
                    return res.status(500).json({ error: 'Error al enviar correo electrónico' });
                }

                console.log('Correo electrónico enviado:', info.response)
                return res.status(200).json({ message: 'Correo electrónico de restablecimiento enviado' })
            });


        } catch (error) {
            console.log(error)
        }
    }

    //ruta para restablecer la contrasenia

    restorePassword = async (req, res) => {
        try {
            const newpassword = req.body.newpassword
            const { token } = req.body

            console.log(newpassword)// esto me da undefine
            //verificacion de token
            const data = jwt.verify(token, configObject.jwt_secret_key)

            const email = data.email

            if (!data) {
                return res.status(401).json({ error: 'Token no válido o expirado' })
            }

            const user = await this.userServiceMongo.getUserBy({ email })

            if (!user) {
                return res.status(401).send('Usuario no encontrado')
            }

            const hashPassword = createHash(newpassword);
            console.log(hashPassword)

            if (hashPassword === user.password) {
                return res.status(400).json({ error: 'La nueva contraseña no puede ser igual a la anterior' });
            }

            const result = await this.userServiceMongo.updateUser(user._id, { password: hashPassword })
            console.log(result)

            // return res.status(200).json({ message: 'Contraseña actualizada correctamente' })

            if (result.success) {
                res.status(200).send({
                    success: true,
                    message: "Contraseña actualizada correctamente",
                    redirect: "/views/login" 
                })
            } else {
                res.status(400).send({
                    success: false,
                    message: "Error al actualizar la contraseña"
                })
            }

        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = PasswordController
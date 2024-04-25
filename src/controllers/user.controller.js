const { configObject } = require("../config/index.js")
const { usersService } = require("../repositories/index.js")
const { CustomError } = require("../services/customError.js")
const { EErrors } = require("../services/enum.js")
const { generateUserErrorInfo } = require("../services/info.js")
const nodemailer = require('nodemailer')


class UserController {

    constructor() {
        this.userServiceMongo = usersService
    }

    getUsers = async (req, res) => {
        const users = await this.userServiceMongo.getUsers()
        res.send(users)
    }

    getUserBy = async (req, res) => {
        const { email } = req.params

        try {
            const user = await this.userServiceMongo.getUserBy({ email });
            res.json(user);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }

    }

    createUser = async (req, res, next) => {
        try {

            const { first_name, last_name, email, password } = req.body

            if (!first_name || !last_name || !email) {
                CustomError.createError({
                    name: 'User creation error',
                    cause: generateUserErrorInfo({ first_name, last_name, email }),
                    message: 'Error trying to created user',
                    code: EErrors.INVALID_TYPE_ERROR
                })
            }

            const newUser = { first_name, last_name, email, password }

            const result = await this.userServiceMongo.createUser(newUser)

            res.status(201).send({
                status: 'succes',
                payload: result
            })

        } catch (error) {
            // console.log(error)
            next(error)
        }
    }

    updateUser = async (req, res) => {

        const { uid } = req.params
        const userToReplace = req.body

        const result = await this.userServiceMongo.updateUser(uid, userToReplace)

        res.status(201).send({
            status: 'succes',
            payload: result
        })
    }

    deleteUser = async (req, res) => {
        try {
            const { uid } = req.params
            const result = await this.userServiceMongo.deleteUser(uid)
            res.status(200).send({ message: "Usuario borrado", result })

        } catch (error) {
            return res.status(500).json({ error: 'Error al eliminar el usuario' })
        }
    }

    changeRole = async (req, res) => {

        const { uid } = req.params

        try {

            let user = await this.userServiceMongo.getUserBy({ _id: uid })

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' })
            }

            const requireDocuments = 3

            if (user.role === 'user' && user.documents.length === requireDocuments) {

                const newRole = 'premium'
                await this.userServiceMongo.updateUser(uid, { role: newRole })

                return res.status(200).json({ message: `Usuario ${user.first_name} ${user.last_name} ahora tiene el rol de ${newRole}` })
            }

            if (user.role === 'premium') {

                user.role = 'user'
                await this.userServiceMongo.updateUser(uid, { role: user.role })

                return res.status(200).json({ message: `Usuario ${user.first_name} ${user.last_name} ahora tiene el rol de ${user.role}` })
            }

            return res.status(200).json({ message: `El usuario ya tiene el rol correcto: ${user.role}` })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'Error al actualizar el rol del usuario' })
        }
    }

    uploadFiles = async (req, res) => {
        try {
            const { uid } = req.params
            const user = await this.userServiceMongo.getUserBy({ _id: uid })

            if (!user) return res.send({ message: 'Usuario no encontrado' })

            if (!req.files) return res.send({ message: 'Documentos no encontrados' })
            console.log('files:', req.files)

            user.documents.push(
                {
                    name: req.files['imageProfile'][0].originalname,
                    reference: req.files['imageProfile'][0].path
                },
                {
                    name: req.files['imageProduct'][0].originalname,
                    reference: req.files['imageProduct'][0].path
                },
                {
                    name: req.files['profileDocuments'][0].originalname,
                    reference: req.files['profileDocuments'][0].path
                }
            )

            await this.userServiceMongo.updateUser(uid, user)

            res.status(200).json({ message: 'Documentos subidos correctamente' })

        } catch (error) {
            res.status(400).json({ message: 'Error al subir archivos' })
        }
    }

    deleteInactiveUser = async (req, res) => {
        try {

            const users = await this.userServiceMongo.getUsers()
            let deletedUsers = 0

            users.forEach(async user => {

                if (user.last_connection) {

                    console.log('entra aca',user.last_connection)// me da undefine

                    const twoDaysAgo = new Date(Date.now() - 1 * 60 * 1000)
                    // const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)// dos dias

                    if (twoDaysAgo < 2 && user.role !== 'admin') {
                        deletedUsers++
                        await this.userServiceMongo.deleteUser(user._id)
                        console.log("Usuario eliminado.")

                        const transport = nodemailer.createTransport({
                            service: 'gmail',
                            port: 587,
                            auth: {
                                user: configObject.gmail_user_app,
                                pass: configObject.gmail_pass_app
                            }
                        })

                        const mailOptions = {
                            from: 'Este mail lo envia <riveragalosamantha@gmail.com>',
                            to: user.email,
                            subject: 'Cuenta eliminada por inactividad',
                            html: `<p>Hola ${user.first_name},</p>
                                   <p>Lamentablemente tu cuenta ha sido eliminada de nuestra plataforma debido a inactividad.</p>
                                   <p>Si deseas volver a utilizar nuestros servicios, por favor regístrate nuevamente en <a href="http://localhost:8080/api/sessions/register">CLICK HERE</a></p>
                                `,
                        }

                        transport.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('Error al enviar correo electrónico:', error);
                                return res.status(500).json({ error: 'Error al enviar correo electrónico' });
                            }

                            console.log('Correo electrónico enviado:', info.response)
                            return res.status(200).json({ message: 'Correo electrónico de restablecimiento enviado' })
                        })

                        res.status(200).json({ message: "Success", payload: `Usuarios eliminados: ${deletedUsers}` })
                    }
                }

            })

        } catch (error) {
            res.status(400).json({ message: 'Error al eliminar usuarios inactivos' })
        }


    }
}

module.exports = UserController
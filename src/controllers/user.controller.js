const { configObject } = require("../config/index.js")
const userModel = require("../dao/models/users.model.js")
const { usersService } = require("../repositories/index.js")
const { CustomError } = require("../services/customError.js")
const { EErrors } = require("../services/enum.js")
const { generateUserErrorInfo } = require("../services/info.js")
const nodemailer = require('nodemailer')



class UserController {

    constructor() {
        this.userServiceMongo = usersService
        this.usermodel = userModel
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

        const twoDaysAgo = new Date()
        twoDaysAgo.setMinutes(twoDaysAgo.getMinutes() - 1)
        // twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

        try {
            const adminEmail = configObject.user_admin

            const users = await this.usermodel.find({ last_connection: { $lt: twoDaysAgo }, email: { $ne: adminEmail } })
            console.log('usuario encontrados',users)

            if (users.length === 0) {
                return res.status(404).json({ error: 'No se encontraron usuarios para eliminar.' })
            }

            const emailAddresses = users.map(user => user.email)
            console.log('email del usuario a eliminar', emailAddresses)

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
                subject: 'Cuenta eliminada por inactividad',
                html: `
                      <p>Lamentablemente tu cuenta ha sido eliminada de nuestra plataforma debido a inactividad.</p>
                      <p>Si deseas volver a utilizar nuestros servicios, por favor regístrate nuevamente en <a href="http://localhost:8080/views/register">CLICK HERE</a></p>`
            }

            const emailResults = []
            for (const emailAddress of emailAddresses) {
                mailOptions.to = emailAddress
                try {
                    const result = await transport.sendMail(mailOptions)
                    emailResults.push({ email: emailAddress, status: 'success' })
                    console.log(`Correo electrónico enviado a: ${emailAddress}`)
                } catch (error) {
                    console.error(`Error al enviar correo electrónico a: ${emailAddress}`, error)
                    emailResults.push({ email: emailAddress, error: error.message })
                }
            }

            const deletionResult = await this.usermodel.deleteMany({ last_connection: { $lt: twoDaysAgo }, email: { $ne: adminEmail } })

            const response = {message: 'Usuarios eliminados exitosamente.', deletedCount: deletionResult.deletedCount, emailResults: emailResults}

            res.status(200).json(response)

        } catch (error) {
            console.error('Error al eliminar usuarios inactivos:', error)
            res.status(500).json({ error: 'Error interno del servidor' })
        }
    }
}

module.exports = UserController
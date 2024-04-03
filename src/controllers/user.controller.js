const { usersService } = require("../repositories/index.js")
const { CustomError } = require("../services/customError.js")
const { EErrors } = require("../services/enum.js")
const { generateUserErrorInfo } = require("../services/info.js")


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
        const { userId } = req.params
        const result = await this.userServiceMongo.deleteUser(userId)
        res.status(200).send({ message: "Usuario borrado", result })
    }

    changeRole = async (req, res) => {

        const { uid } = req.params

        try {

            let user = await this.userServiceMongo.getUserBy({ _id: uid })

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' })
            }

            const newRole = user.role === 'user' ? 'premium' : 'user'

            await this.userServiceMongo.updateUser(uid, { role: newRole })

            user = await this.userServiceMongo.getUserBy({ _id: uid })

            return res.status(200).json({ message: `Usuario ${user.first_name} ${user.last_name} ahora tiene el rol de ${user.role}` })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: 'Error al actualizar el rol del usuario' })
        }
    }
}

module.exports = UserController
const User = require("../dao/managerMongo/userMongoManager");
const { isValidPassword, createHash } = require("../utils/hashPassword");
const { createToken } = require("../utils/jwt");
const { logger } = require("../utils/logger");

const userManager = new User()

class SessionsController {
    constructor() {
    }

    signUp = async (req, res) => {
        try {

            const { first_name, last_name, email, password } = req.body

            if (first_name === '' || last_name === '' || email === '' || password === '') {
                return res.status(404).json({ error: "Por favor ingrese todos los datos" });
            }

            const user = await userManager.getUserBy({ email: email })

            if (user) {
                return res.send({ status: 'error', error: 'El email ya se encuentra registrado' })
            }

            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password)
            }

            const result = await userManager.createUser(newUser)

            const token = createToken({ id: result._id })

            req.logger.info(token)

            res.cookie('token', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true,
            }).json({
                status: 'succes',
                message: 'registro exitoso'
            })


        } catch (error) {
            req.logger.error(error)
        }

    }

    login = async (req, res) => {

        try {

            const { email, password } = req.body

            if (email === '' || password === '') {
                return res.status(404).json({ error: "Por favor ingrese todos los datos" })
            }

            const user = await userManager.getUserBy({ email: email })

            if (!isValidPassword(user, password)) {
                return res.send('email o contraseña incorrecta')
            }

            user.last_connection = new Date()
            await userManager.updateUser(user._id, user)
            console.log(`La fecha de ingreso del usuario ${user.email} es ${user.last_connection}`)

            const token = createToken({ id: user._id, role: user.role })
            req.logger.info(token)

            res.cookie('token', token, {
                maxAge: 60 * 60 * 1000 * 24,
                httpOnly: true,
            }).json({
                status: 'success',
                message: 'logged in',
            })

        } catch (error) {
            req.logger.error(error)

        }
    }

    logout = async (req, res) => {

        req.session.destroy(err => {
            if (err) return res.send({ status: 'error', error: err })
        })

        res.redirect('/views/login')
    }

    current = async (req, res) => {
        try {
            const user = await req.user;

            if (user) {
                const { first_name, last_name, role } = user;

                const userDto = {
                    first_name,
                    last_name,
                    role
                };

                logger.info(userDto);
                res.json(userDto);
            } else {
                res.status(401).json({ error: "No autorizado" });
            }
        } catch (error) {
            console.error("Error de autenticación:", error);
            res.status(500).json({ error: "Error interno" });
        }
    }

    github = async (req, res) => { }

    githubCallback = (req, res) => {
        req.session.user = req.user
        res.redirect('/views/products')
    }

    failRegister = (req, res) => {

        res.send({ status: 'error', error: 'failed' })

    }

    loginGithub = async (req, res) => {

        if (!req.user) return res.status(400).send({ status: 'error', error: 'credenciales no validas' })

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }

        res.send({ status: 'succes', message: 'login exitoso' })
    }

    failLogin = (req, res) => {
        res.send({ status: 'error', error: 'failed login' })
    }


}

module.exports = SessionsController
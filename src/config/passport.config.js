const passport = require('passport')
const User = require('../dao/managerMongo/userMongoManager')
const local = require('passport-local')
const { createHash, isValidPassword } = require('../utils/hashPassword')
const GithubStrategy = require('passport-github2') //ya no usamos
const jwt = require('passport-jwt')
const { configObject } = require('.')
const { logger } = require('../utils/logger')

const LocalStrategy = local.Strategy
const userService = new User()
const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt //para extraer las cookies

exports.initializePassport = () => {

    const coookieExtractor = req =>{
        let token = null
        if(req && req.cookies){
            token = req.cookies['token']
        }
        return token
    }
    
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([coookieExtractor]),
        secretOrKey: configObject.jwt_secret_key
    }, async (jwt_payload, done)=>{
        try {

            console.log('jwtpayload passport config:', jwt_payload)

            const userId = jwt_payload.id

            const user = await userService.getUserBy({_id: userId})

            return done (null, user)
        } catch (error) {
            return done(error)
        }
    }))

    // GITHUB

    passport.use('github', new GithubStrategy({
        clientID: configObject.gh_client_id,
        clientSecret: configObject.gh_client_secret,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            let user = await userService.getUserBy({ email: profile._json.email })
            if (!user) {
                //para registrar en caso que no exista user
                let newUser = {
                    first_name: profile.username,
                    last_name: profile.username,
                    email: profile._json.email,
                    password: ''
                }
                let result = await userService.createUser(newUser)
                return done(null, result)
            }
            // null-no hay error
            done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    // guardar y recuperar credenciales del usario de session
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userService.getUserBy({ _id: id })
        done(null, user)
    })


    passport.use('registergithub', new LocalStrategy({
        //para acepte la llamada del req
        passReqToCallback: true,
        //cambiamos el nombre por que no tenemos username
        usernameField: 'email'
    }, async (req, username, password, done) => {

        try {

            const { first_name, last_name, email } = req.body

            console.log(req.body)

            let userFound = await userService.getUserBy({ email: username })
            console.log(userFound)

            if (userFound) return done(null, false)

            let newUser = {
                first_name,
                last_name,
                email: username,
                role: 'user',
                password: createHash(password)
            }

            let result = await userService.createUser(newUser)

            return done(null, result)

        } catch (error) {
            console.log('entra al catch')
            return done('No se pudo crear el usuario' + error)
        }
    }))


    passport.use('logingithub', new LocalStrategy({
        usernameField: 'email'

    }, async (username, password, done) => {

        try {

            const user = await userService.getUserBy({ email: username })

            if (!user) {
                logger.info('No existe el usuario')
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)


            return done(null, user)

        } catch (error) {
            return done(error)
        }
    }))
    
}
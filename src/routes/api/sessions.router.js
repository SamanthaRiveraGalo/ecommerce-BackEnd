const { Router } = require('express')

const passport = require('passport')
const { passsportCall } = require('../../utils/passportCall')
const { authorizationJwt } = require('../../middlewars/jwtPassport.middleware')
const SessionsController = require('../../controllers/sessionsController')

const {
    signUp,
    login,
    logout,
    current,
    github,
    githubCallback,
    failRegister,
    loginGithub,
    failLogin
} = new SessionsController()

const router = Router()


//JWT

router.post('/register', signUp)

router.post('/login', login)

router.get('/logout', logout)

router.get('/current', [passsportCall('jwt'), authorizationJwt(['ADMIN', 'USER'])], current)

//GitHUB

// //cuando apretamos el boton de login de github nos lleva a esta ruta
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), github)
//cuando nos redirecciones nos devuelve los datos aca

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), githubCallback)

router.post('/registergithub', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }))

router.get('/failregister', failRegister)


router.post('/logingithub', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), loginGithub)

router.get('/faillogin', failLogin)



module.exports = router
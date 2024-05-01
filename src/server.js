const express = require('express')
const handlebars = require('express-handlebars')
const { connectDb, configObject } = require('./config/index.js')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')
const routerApp = require('./routes/index.js')
const socketIoConfig = require('./utils/socketio.js')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require('cors')
const { handleError } = require('./middlewars/error/handleError.js')
const { addLogger, logger } = require('./utils/logger.js')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')

const app = express()
const port = configObject.PORT

connectDb()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
// app.use(cors())
app.use(cors({credentials: true, origin: "http://localhost:5173"}))
app.use(cookieParser(configObject.cookies_code)) //firma de la cookie

app.use(session({
  store: MongoStore.create({
      mongoUrl: configObject.mongo_url,
      mongoOptions: {
          useNewUrlParser: true,
          useUnifiedTopology: true
      },
      ttl: 160,
  }),
  secret: configObject.mongo_secret,
  resave: true,
  saveUninitialized: true
}))

//MIDDLEWARE PASSPORT
initializePassport()
app.use(passport.initialize())

//MOTOR DE PLANTILLA
app.engine('hbs', handlebars.engine({
  extname: '.hbs'
}))
app.set('view engine', '.hbs')
app.set('views', __dirname + '/views')


app.use(addLogger)
app.use(routerApp)
app.use(handleError)

//SWAGGER

const swaggerOptions = {
  definition :{
    openapi: '3.0.1',
    info:{
      title:'Documentacion',
      descreption:'Api docs para documentacion'
    }
  },
  apis:[`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions)

app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

const serverHttp = app.listen(port, () => {
  logger.info(`Server listening at [localhost:${port}]`);
});

socketIoConfig(serverHttp)

module.exports = app
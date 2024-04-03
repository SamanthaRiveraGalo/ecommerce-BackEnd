const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { connect } = require('mongoose')
const { program } = require('./commander')
const { logger } = require('../utils/logger')

dotenv.config()

const opts = program.opts()

dotenv.config({
    path: opts.mode == 'production' ? './.env.production' : './.env.development'
})


const configObject = {
    PORT: process.env.PORT || 8080,
    env: process.env.NODE_ENV || 'development',
    mongo_url: process.env.MONGO_URL,
    mongo_secret: process.env.MONGO_SECRET,
    cookies_code: process.env.COOKIES_SECRET_CODE,
    user_admin: process.env.USER_ADMIN,
    user_admin_password: process.env.USER_ADMIN_PASSWORD,
    jwt_secret_key: process.env.JWT_SECRET_KEY,
    gh_client_id: process.env.GITHUB_CLIENT_ID,
    gh_client_secret: process.env.GITHUB_CLIENT_SECRET,
    gmail_user_app: process.env.GMAIL_USER_APP,
    gmail_pass_app: process.env.GMAIL_PASS_APP,
    twilio_account_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
    twilio_phone: process.env.TWILIO_PHONE
}

//conexion con MONGO
const connectDb = async () => {
    try {
        MongoSingleton.getInstance()
        logger.info('Base de datos conectada')
        return mongoose.connection;
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error);
    }
}

class MongoSingleton {
    static instance
    constructor() {
        connect(process.env.MONGO_URL);
    }

    static getInstance() {
        if (!this.instance) {
            logger.info('Conectado a Base de Datos');
            return this.instance = new MongoSingleton();
        }
        logger.info('Base de Datos ya conectada');
        return this.instance;
    }
}

module.exports = {
    configObject,
    connectDb
}
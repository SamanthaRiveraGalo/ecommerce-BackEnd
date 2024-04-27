// const nodemailer = require('nodemailer')
// const { configObject } = require('../config')

// const transport = nodemailer.createTransport({

//     service: 'gmail',
//     port: 587,
//     auth: {
//         user: configObject.gmail_user_app,
//         pass: configObject.gmail_pass_app
//     }

// })

// exports.sendMail = async (destino, subject, html) => {

//     return await transport.sendMail({
//         from: 'Este mail lo envia <riveragalosamantha@gmail.com>',
//         to: destino,
//         subject,
//         html
//     })

// }

const nodemailer = require('nodemailer')
const { configObject } = require('../config')

async function sendMail(to, subject, html) {
    
    const transport = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: configObject.gmail_user_app,
            pass: configObject.gmail_pass_app
        }
    })

    const mailOptions = {
        from: 'Este mail lo envia <ecommerce-nike@gmail.com>',
        to,
        subject,
        html,
    }

    try {
        await transport.sendMail(mailOptions)
        console.log(`Correo electrónico enviado a: ${to}`)
    } catch (error) {
        console.error(`Error al enviar correo electrónico a: ${to}`, error)
    }
}

module.exports = { sendMail };
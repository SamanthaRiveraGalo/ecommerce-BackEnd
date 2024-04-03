const { Router } = require('express')
const { sendMail } = require('../../utils/sendMail')
const { sendSms } = require('../../utils/sendSms')

const router = Router()

router.get('/sendsms', (req,res)=>{
    sendSms(`Gracias por su compra`, {first_name: 'Samantha', last_name:'Rivera', phone:''})// va con el +, funciona!
    res.send('SMS enviado')
})

router.get('/mail', (req, res) => {
    try {

        const user = {
            email: 'riveragalosamantha@gmail.com',
            first_name: 'Samantha',
            last_name: 'Rivera Galo'
        }

        const to = user.email
        const subject = 'Mail de prueba'
        const html = `<div>
                      <h1>Mail de prueba ${user.first_name}</h1>
                  </div>`
        sendMail(to, subject, html)

        res.send('Mail enviado')

    } catch (error) {
        req.logger.error(error)
    }
})

module.exports = router
const twilio = require('twilio')
const { configObject } = require('../config')

const twilio_sid = configObject.twilio_account_sid
const twilio_token = configObject.twilio_auth_token
const twilio_phone = configObject.twilio_phone

const client = twilio(twilio_sid,twilio_token)

exports.sendSms = (body, user )=> client.messages.create({
    body: body + ' ' + user.first_name + ' ' + user.last_name,
    from: twilio_phone,
    to: user.phone //aca iria mi numero de telefono o al que quiero enviarle
})
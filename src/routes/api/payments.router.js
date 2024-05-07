const { Router} = require('express')
const Payments = require('../../controllers/payment.controller')

const { purchaseStripe } = new Payments()

const router = Router()

router.post('/payment-intents', purchaseStripe )

module.exports = router
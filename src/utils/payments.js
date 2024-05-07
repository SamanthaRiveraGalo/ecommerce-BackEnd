const { configObject } = require("../config")

const Stripe = require ('stripe')

class PaymentService {
    constructor() {
        this.stripe = new Stripe(configObject.stripe_key_secret)
    }

    createPaymentIntent = async (data) => {
        const paymentIntent = await this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
}

module.exports = PaymentService
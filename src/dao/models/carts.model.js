const { Schema, model } = require('mongoose')

const cartCollection = 'carts'

const cartSchema = new Schema({

    products: {

        type: [
            {
                _id: {
                    type: Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        
        default: [],
    },


})

const cartModel = model(cartCollection, cartSchema)

module.exports = cartModel
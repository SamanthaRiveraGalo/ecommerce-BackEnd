const { Schema, model } = require('mongoose')

const userCollection = 'users'

const UserSchema = Schema({

    fullname: String,

    first_name: {
        type: String,
        required: true
    },

    last_name: String,

    email: {
        type: String,
        required: true,
        unique: true
    },

    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user',
    },

    password: {
        type: String,
        required: true, 
    },

    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }],

    documents: [{
        name: String,
        reference: String,
    }],

    last_connection: {
        type: Date
    }
})

const userModel = model(userCollection, UserSchema)

module.exports = userModel 
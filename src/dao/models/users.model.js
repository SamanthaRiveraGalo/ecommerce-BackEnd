const { Schema, model } = require('mongoose')

const userCollection = 'users'

const UserSchema = Schema({

    // fullname:{
    //     type:String,
    //     required: true
    // },

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
        // required: true, 
    },

    cart: [{type: Schema.Types.ObjectId,ref: 'carts',}]
})

const userModel = model(userCollection, UserSchema)

module.exports = userModel 
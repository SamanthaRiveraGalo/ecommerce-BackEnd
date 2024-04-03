const { Schema, model } = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const productCollection = 'products'

const productSchema = Schema({

    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    thumbnails: {
        type: String,
    },
    owner:{
        type: String,
        ref: 'User',
        default: 'admin'
    }
})

productSchema.plugin(mongoosePaginate)

const productModel = model(productCollection, productSchema)

module.exports = productModel
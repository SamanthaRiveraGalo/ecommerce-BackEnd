const { Schema, model } = require('mongoose');

const ticketCollection = 'tickets'


const ticketSchema = Schema({

    code: {
        type: String,
        required: true,
        unique: true,
        default: () => Math.random().toString(36).substring(2, 10).toUpperCase(), // Generar código aleatorio
    },

    purchase_datetime: {
        type: Date,
        default: Date.now
    },

    amount: {
        type: Number,
        required: true
    },
    //mail
    purchaser: {
        type: String,
        required: true
    }
})

const ticketModel = model(ticketCollection, ticketSchema)

module.exports = ticketModel
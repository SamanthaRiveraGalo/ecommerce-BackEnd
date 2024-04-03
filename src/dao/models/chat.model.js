const { Schema, model } = require('mongoose')

const chatCollection = 'chats'

const chatSchema = new Schema  ({

    user: { type: String, required: true },
    message: { type: String, required: true }

})

const chatModel = model(chatCollection,chatSchema)

module.exports = chatModel

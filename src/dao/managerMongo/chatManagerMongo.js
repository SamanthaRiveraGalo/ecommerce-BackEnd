const chatModel = require("../models/chat.model");

class ChatMassage {

    constructor() {
        this.messagesModel = chatModel;
    }

    async addMessage(user, message) {

        try {
            const messages = await this.messagesModel.create({
                user: user,
                message: message,
            });
            return messages;
        } catch (error) {
            req.logger.error(error)
        }
    }

    async getMessages() {
       
        return await this.messagesModel.find().lean();
         
    }

}

module.exports = ChatMassage
const ticketModel = require("../models/ticket")

class TicketDao {

    async createTicket(totalAmount, purchaser) {
        try {
            const ticket = new ticketModel({ amount: totalAmount, purchaser: purchaser })

            await ticket.save()

            return ticket

        } catch (error) {
            req.logger.info(error)
        }

    }

    async getTicketId(tid) {
        return await ticketModel.findOne({ _id: tid })
    }

    // async getTicketsUser(purchaserMail) {

    //     const tickets = await ticketModel.find({ purchaser: purchaserMail })
    //     console.log(tickets)

    //     return tickets
    // }

}

module.exports = { TicketDao };
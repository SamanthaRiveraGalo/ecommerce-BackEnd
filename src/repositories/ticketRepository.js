class TicketRepository {

    constructor(dao) {
        this.dao = dao;
    }

    createTicket = async (totalAmount, purchaser, code, ) => {
       return await this.dao.createTicket(totalAmount, purchaser)
    }

    getTickets = async (purchaser) => {
        let result = await this.dao.getTicketsUser(purchaser);
        return result
    }
}

module.exports = { TicketRepository };
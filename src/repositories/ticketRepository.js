class TicketRepository {

    constructor(dao) {
        this.dao = dao
    }

    createTicket = async (totalAmount, purchaser, code, ) => {
       return await this.dao.createTicket(totalAmount, purchaser)
    }

    getTicketId = async (tid)=>{
        return await this.dao.getTicketId(tid)
    }

    // getTicketsUser = async (purchaserMail) => {
    //     let result = await this.dao.getTicketsUser(purchaserMail)
    //     return result
    // }
}

module.exports = { TicketRepository };
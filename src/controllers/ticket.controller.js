const { ticketService } = require("../repositories")

class TicketController {
    constructor() {
        this.ticket = ticketService
    }

    getTicketId = async (req, res) => {
        try {
            const { tid } = req.params

            const ticket = await this.ticket.getTicketId(tid)

            if (ticket) {
                res.status(200).send({ message: "ticket encontrado", ticket })
            } else {
                res.status(404).send({ message: "ticket no encontrado" })
            }
        } catch (error) {
            console.error(error)
            res.status(500).send({ message: "Error al obtener el ticket" })
        }
    }

    // getTicketsUser = async (req, res) => {
    //     try {
    //         const { purchaserMail } = req.params

    //         const ticket = await this.ticket.getTicketsUser({ purchaserMail })
    //         res.status(200).send({ message: "ticket encontrado", ticket })

    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).send({ message: "Error al obtener el ticket" })
    //     }
    // }
}

module.exports = TicketController
const { Router } = require('express')
const TicketController = require('../../controllers/ticket.controller')
const { authorizationJwt } = require('../../middlewars/jwtPassport.middleware')
const { passsportCall } = require('../../utils/passportCall')

const router = Router()

const { getTicketsUser, getTicketId } = new TicketController()

router.get('/:tid',[passsportCall('jwt'), authorizationJwt(['ADMIN', 'USER'])], getTicketId)
// router.get('/:temail', getTicketsUser)


module.exports = router
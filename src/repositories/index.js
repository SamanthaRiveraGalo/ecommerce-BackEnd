const { TicketDao } = require("../dao/managerMongo/ticketDao");
const User = require("../dao/managerMongo/userMongoManager");
const { TicketRepository } = require("./ticketRepository.js");
const { UserRepository } = require("./userRepository");

const usersService = new UserRepository(new User())
const ticketService = new TicketRepository( new TicketDao())

module.exports = { usersService, ticketService } 
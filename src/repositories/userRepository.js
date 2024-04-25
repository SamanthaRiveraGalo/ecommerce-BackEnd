const { UserDto } = require("../dto/usersDto")

class UserRepository {

    constructor(dao) {
        this.dao = dao
    }

    getUsers = async () => {
        //    const users =  await this.dao.getUsers()
        //    const filterAdmin = users.filter(user => user.role !== "admin") //traigo todos menos al admin
        //    const usersDto = filterAdmin.map(user =>new UserDto(user))
        //    return usersDto
        const users = await this.dao.getUsers()
        // return users.map((user) => new UserDto(user))
        return users
    }

    getUserBy = async (filter) => await this.dao.getUserBy(filter)

    createUser = async (newUser) => {
        const newUserDto = new UserDto(newUser)
        return this.dao.createUser(newUserDto)
    }

    updateUser = async (uid, userUpdate) => await this.dao.updateUser(uid, userUpdate)

    deleteUser = async (uid) => await this.dao.deleteUser(uid)

}

module.exports = { UserRepository }
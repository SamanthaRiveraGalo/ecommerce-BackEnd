const { UserDto } = require("../dto/usersDto")

class UserRepository {

    constructor(dao) {
        this.dao = dao
    }

    getUsers = async () => await this.dao.getUsers()

    getUserBy = async (filter) => await this.dao.getUserBy(filter)

    createUser = async (newUser) => {
        const newUserDto = new UserDto(newUser)
        return this.dao.createUser(newUserDto)
    }

    updateUser = async (uid, userUpdate) => await this.dao.updateUser(uid, userUpdate)

    deleteUser = async (uid) => await this.dao.deleteUser(uid)

}

module.exports = { UserRepository }
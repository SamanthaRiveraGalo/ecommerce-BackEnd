const userModel = require("../models/users.model")

class User {

    constructor() {
        this.model = userModel
    }

    async getUsers() {
        return await this.model.find()
    }

    async findInactiveUsers(timeLimit) {
        try {
          return await userModel.find({ lastConnection: { $lt: timeLimit } }).lean()
        } catch (error) {
          throw new Error('Error finding inactive users')
        }
    }

    async getUserBy(filter) {
        return await this.model.findOne(filter)
    }

    async createUser(newUser) {

        return await this.model.create(newUser)
    }

    async updateUser(uid, userUpdate) {

        return await this.model.findOneAndUpdate({ _id: uid }, userUpdate, { new: true })

    }

    async deleteUser(uid) {
        return await this.model.findOneAndDelete({ _id: uid })
    }


}

module.exports = User
class UserDto {

    constructor(newUser){
        this.first_name =  newUser.first_name
        this.last_name = newUser.last_name
        this.email = newUser.email
        this.role = newUser.role
        this.password = newUser.password
        this.fullname = `${newUser.first_name} ${newUser.last_name}`,
        this.last_connection = newUser.last_connection
    }

}

module.exports = { UserDto }
const { Router } = require('express');
const UserController = require('../../controllers/user.controller');

const router = Router()

const {
    getUsers,
    getUserBy,
    createUser,
    updateUser,
    deleteUser,
    changeRole
} = new UserController()

router.get('/', getUsers)

router.get('/:email', getUserBy);

router.post('/', createUser)

router.put('/:uid', updateUser)

router.delete('/:uid', deleteUser)

//cambio de rol
router.get('/premium/:uid', changeRole)

module.exports = router

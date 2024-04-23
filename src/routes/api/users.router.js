const { Router } = require('express');
const UserController = require('../../controllers/user.controller');
const uploader = require('../../middlewars/multer');
const { passsportCall } = require('../../utils/passportCall');
const { authorizationJwt } = require('../../middlewars/jwtPassport.middleware');

const router = Router()

const {
    getUsers,
    getUserBy,
    createUser,
    updateUser,
    deleteUser,
    changeRole,
    uploadFiles
} = new UserController()

router.get('/', [passsportCall('jwt'), authorizationJwt(['ADMIN'])] , getUsers)

router.get('/:email', getUserBy);

router.post('/', createUser)

router.put('/:uid', updateUser)

router.delete('/:uid', deleteUser)

//cambio de rol
router.get('/premium/:uid', changeRole)

//documentos
router.post('/:uid/documents', uploader.fields([{name:'imageProfile', maxCount: 1},{name:'imageProduct', maxCount: 1},{name:'profileDocuments', maxCount: 1}]), uploadFiles)

module.exports = router

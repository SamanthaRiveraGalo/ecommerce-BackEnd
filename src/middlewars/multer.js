const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        if (file.fieldname === 'imageProfile') {
            cb(null, path.join(__dirname, './public/uploads/imageProfile'))
        }

        if (file.fieldname === 'imageProduct') {
            cb(null, path.join(__dirname, './public/uploads/imageProduct'))
        }

        if (file.fieldname === 'profileDocuments') {
            cb(null, path.join(__dirname, './public/uploads/profileDocuments'))
        }
    },

    filename: function (req, file, cb) {
        cb (null, `${Date.now()} - ${file.originalname}`)
    }
})

const uploader = multer({storage: storage})

module.exports = uploader
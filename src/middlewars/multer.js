const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req,file,cb){
    
        if (file.fieldname === 'imageProfile') {
            cb(null, path.join(`${__dirname}/public/uploads/profile`))
        }

        if (file.fieldname === 'imageProduct') {
            cb(null, path.join(`${__dirname}/public/uploads/products`))
        }

        if (file.fieldname === 'profileDocuments') {
            cb(null, path.join(`${__dirname}/public/uploads/documents`))
        }
    },

    filename: function (req, file, cb) {
        cb (null, `${Date.now()} - ${file.originalname}`)
    }
})

const uploader = multer(storage)

module.exports = uploader
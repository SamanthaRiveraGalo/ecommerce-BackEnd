const multer = require("multer")
const path = require("path")
const fs = require("fs")

const profilePath = path.resolve(__dirname, "../public/uploads/profile")
const productsPath = path.resolve(__dirname, "../public/uploads/products")
const documentsPath = path.resolve(__dirname, "../public/uploads/documents")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "imageProfile") {
            cb(null, profilePath);
        }

        if (file.fieldname === "imageProduct") {
            cb(null, productsPath);
        }

        if (file.fieldname === "profileDocuments") {
            cb(null, documentsPath);
        }
    },

    filename: function (req, file, cb) {
        cb(null, `${Date.now()} - ${file.originalname}`)
    },
})

const createMulterFolders = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
        console.log(`Directorio creado en ${folderPath}`)
    } else {
        console.log(`El directorio ${folderPath} ya existe.`)
    }
};

createMulterFolders(profilePath)
createMulterFolders(productsPath)
createMulterFolders(documentsPath)

const uploader = multer({ storage })

module.exports = uploader;
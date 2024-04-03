const { Router } = require("express");
const ProductController = require("../../controllers/products.controller");
const { passsportCall } = require("../../utils/passportCall");
const { authorizationJwt } = require("../../middlewars/jwtPassport.middleware");

const {
    getsProducts,
    getProductId,
    createProduct,
    updateProduct,
    deleteProduct
} = new ProductController()

const router = Router();


router.get("/", getsProducts);

router.get("/:pid", getProductId);

router.post("/", [passsportCall('jwt'), authorizationJwt(['ADMIN', 'PREMIUM'])], createProduct);

router.put("/:pid", [passsportCall('jwt'), authorizationJwt(['ADMIN'])], updateProduct);

router.delete("/:pid", [passsportCall('jwt'), authorizationJwt(['ADMIN', 'PREMIUM'])], deleteProduct);

module.exports = router;
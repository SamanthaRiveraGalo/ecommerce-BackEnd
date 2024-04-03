const generateUserErrorInfo = (user) => {

    return `One or more properties were incomplete or not valid
    list of requiere properties:
    *first_name : nedd to be String, recived ${user.first_name}
    *last_name : nedd to be String, recived ${user.last_name}
    *email : nedd to be String, recived ${user.email}
    `
}

const generateCartErrorInfo = (user, cartId) => {

    return ` One or more properties were incomplete or not valid
    list of requires properties
    *Product not addes to cart: can't add product to cart, recived ${user} and ${cartId}
    `
}

const generateCartRemoveErrorInfo = (cid, pid) => {
    return `One or more properties were incomplete or not valid
    list of requires properties
    *Product not removed from cart: can't removed product from cart, recived ${cid} and ${pid}`
}

const createProductErrorInfo = (product)=>{
    return `One or more properties were incomplete or not valid
    list or requires properties
    * title: nedd to be String, recived ${product.title}
    * description: nedd to be String, recived ${product.description}
    * price: nedd to be Number, recived ${product.price}
    * code: nedd to be String, recived ${product.code}
    * stock: nedd to be Number, recived ${product.stock}
    * category: nedd to be String, recived ${product.category}
    `
}

module.exports = {
    generateUserErrorInfo,
    generateCartErrorInfo,
    generateCartRemoveErrorInfo,
    createProductErrorInfo
}
// este crea la causa
// y esto lo llamamos en controller, en user en caso de user o products o cart
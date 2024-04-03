const { Server } = require('socket.io')
const ChatMassage = require('../dao/managerMongo/chatManagerMongo.js')
const ProductDaoMongo = require('../dao/managerMongo/productManagerMongo.js')

function socketIoConfig (serverHttp){

    const io = new Server(serverHttp)
    
    const massageManager = new ChatMassage()
    const productService = new ProductDaoMongo()
    
    io.on("connection", socket => {
    
      //SOCKETIO PRODUCTS
      console.log("Client connected");
    
      socket.on('add-product', async newProduct => {
        try {
    
          await productService.createProduct(newProduct)
          const productsList = await productService.getProducts()
    
          io.emit('update-products', productsList);
    
        } catch (error) {
          console.log(error)
        }
    
      });
    
      socket.on('delete-product', async productId => {
        try {
    
          await productService.deleteProduct(productId)
          const productsList = await productService.getProducts()
          console.log(productId)//null
          io.emit('update-products', productsList)
    
        } catch (error) {
          console.error(error)
        }
    
      })
    
      //SOCKETIO MENSSAJE
    
      socket.on('message', async data => {
    
        try {
    
          let user = data.user;
          let message = data.message;
    
          await massageManager.addMessage(user, message);
    
          // Obtener todos los mensajes desde Mongo
          const allMessages = await massageManager.getMessages();
    
          // Emitir los mensajes actualizados a los clientes
          io.emit('messageLogs', allMessages);
    
        } catch (error) {
          console.error('Error al guardar o emitir mensajes:', error);
        }
      })
    
    });
}

module.exports = socketIoConfig

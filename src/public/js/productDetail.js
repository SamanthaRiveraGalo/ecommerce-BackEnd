const botonesAgregarCarrito = document.querySelectorAll('.addProduct')

botonesAgregarCarrito.forEach(boton => {
  boton.addEventListener('click', async (e) => {
    e.preventDefault()
    const prodId = req.params.pid 
    const cartId = req.params.cid 

    try {
      const respuesta = await fetch(`/api/carts/${cartId}/products/${prodId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ prodId, cartId }) // Enviar ID del producto e ID del carrito en el cuerpo de la solicitud
      })

      if (!respuesta.ok) {
        throw new Error('Error agregando producto al carrito')
      }

      console.log('Producto agregado al carrito exitosamente')

    } catch (error) {
      console.error('Error agregando producto al carrito:', error)
    }
  })
})
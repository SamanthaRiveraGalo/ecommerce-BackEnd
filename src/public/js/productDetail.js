const purchaseBtn = document.getElementById('purchase');

purchaseBtn.addEventListener('click', async () => {
    const productId = purchaseBtn.dataset.productid
    const cartId = purchaseBtn.dataset.cartid

    try {
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const response_text = await response.text()
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Producto Agregado',
                text: `El producto ha sido agregado al carrito exitosamente`,
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al agregar el producto al carrito.\n${response_text}`,
            })
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Hubo un error al agregar el producto al carrito: ${cartId}`,
        })
    }
})
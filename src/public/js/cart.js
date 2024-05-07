document.getElementById('contenido').addEventListener('click', async function (e) {

    if (e.target.id === 'subtract') {
        const productId = e.target.getAttribute('data-productid')
        const cartId = e.target.getAttribute('data-cartid')
        let quantity = e.target.getAttribute('current-quantity')
        if (quantity > 1) {
            quantity = parseInt(quantity) - 1
            try {
                const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: quantity }),
                })

                location.reload(true)

            } catch (error) {
                console.error('Error al realizar la solicitud:', error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Hubo un error al eliminar la cantidad`,
                })
            }
        }
    }

    if (e.target.id === 'add') {
        const productId = e.target.getAttribute('data-productid')
        const cartId = e.target.getAttribute('data-cartid')
        let quantity = e.target.getAttribute('current-quantity')
        quantity = parseInt(quantity) + 1
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: quantity }),
            })

            location.reload(true)

        } catch (error) {
            console.error('Error al realizar la solicitud:', error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al agregar el producto`,
            })
        }
    }

    const deleteButton = e.target.closest('.delete')
    if (deleteButton) {
        const productId = deleteButton.getAttribute('data-productid')
        const cartId = deleteButton.getAttribute('data-cartid')
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

        } catch (error) {
            console.error('Error al realizar la solicitud:', error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al eliminar el producto`,
            })
        }
        location.reload(true)
    }

    if (e.target.id === 'delete-cart') {
        const cartId = e.target.getAttribute('data-cartid')

        try {
            const response = await fetch(`/api/carts/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            location.reload(true)

        } catch (error) {
            console.error('Error al realizar la solicitud:', error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al vaciar el carrito`,
            })
        }
    }

})

let btnCartPurchase = document.getElementById('payButton')

btnCartPurchase.addEventListener('click', async function (e) {
    const cartId = e.target.getAttribute('data-cartid')

    try {

        const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Compra realizada exitosamente!'
            }).then(() => {
                window.location.href = '/views/payments'
            })
        } else {
            Swal.fire('Error', 'Hubo un problema al realizar la compra. Inténtelo de nuevo más tarde.', 'error')
        }
    } catch (error) {
        console.error('Error during purchase:', error)
    }

})

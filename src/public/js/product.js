const productDetailLinks = document.querySelectorAll('.product-detail-link')

productDetailLinks.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault()

    const productId = link.dataset.productId
    window.location.href = `/views/products/${productId}`
  })
})
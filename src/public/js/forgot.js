const form = document.querySelector('#formPassword')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.querySelector('input[name="email"]').value

  try {
    const respuesta = await fetch('/api/sendResetPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }), 
    })

    if (!respuesta.ok) {
      console.log(`Error al enviar el correo electrónico: ${respuesta.statusText}`)
    }

    const datos = await respuesta.json() 

    alert('Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error)
    alert('Error al enviar el correo electrónico. Por favor, intente nuevamente.');
  }
})

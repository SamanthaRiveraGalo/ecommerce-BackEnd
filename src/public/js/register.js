const form = document.getElementById('registerForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const first_name = document.getElementById('first_name').value.trim();
    const last_name = document.getElementById('last_name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    console.log(first_name)

    fetch('/api/sessions/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            password
        })
    }).then(result => {
        console.log(result)
        if (result.status === 200) {
            window.location.href = '/views/login';
        }
    }).catch((error) => {
        alert(`Ha ocurrido un error al intentar registrar su usuario: ${error}`)
    })

})
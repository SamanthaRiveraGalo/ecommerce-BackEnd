// // const token = window.location.pathname.split('/')[2]
// const form = document.querySelector('#formResetPassword')
// const apiUrl = '/api/restorePassword'

// form.addEventListener('submit', async (e) => {
//     e.preventDefault()

//     const newPassword = document.getElementById('newPassword').value

//     fetch(apiUrl, {

//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ newPassword, token }),

//     }).then(result=>{
//         console.log(result.status)
//         if(result.status===200){
//             window.location.replace('/views/login');
//         }
//     }).catch(err => {
//         console.log(err);
//     })
// })
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (username === 'admin' && password === 'admin123') {
        alert('Login successful!');
        window.location.href = '/';
    } else {
        errorMessage.textContent = '아이디나 비밀번호가 잘못되었습니다.';
    }
});

// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault();
//     var username = document.getElementById('username').value;
//     var password = document.getElementById('password').value;
//
//     fetch('/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ username: username, password: password })
//     })
//         .then(response => {
//             if (response.ok) {
//                 alert("Login successful");
//             } else {
//                 alert("Invalid username or password");
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//         });
// });
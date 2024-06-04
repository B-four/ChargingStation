document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    console.log("Sending login request with:", { username: username, password: password });

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
        .then(response => {
            console.log("Response status:", response.status);
            return response.text();
        })
        .then(text => {
            console.log("Response body:", text);
            if (text === "Login successful") {
                alert("Login successful");
                window.location.href = '/';
            } else {
        errorMessage.textContent = '아이디나 비밀번호가 잘못되었습니다.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});



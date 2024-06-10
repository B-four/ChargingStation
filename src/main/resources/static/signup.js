async function registerUser(user) {
    const response = await fetch('/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signupForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const message = document.getElementById('message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // 폼의 기본 제출 동작을 방지

        // 비밀번호와 비밀번호 확인이 일치하는지 확인
        if (password.value !== confirmPassword.value) {
            message.textContent = '비밀번호가 일치하지 않습니다.';
            message.style.color = 'red';
            return;
        }

        // 폼 데이터를 가져오기
        const formData = new FormData(form);
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
            email: formData.get('email'),
            created_at: new Date().toISOString()
        };

        console.log("데이터 가져오기: " + data.username + ", " + data.email + ", " + data.password + ", " + data.created_at);

        try {
            // 서버로 폼 데이터를 전송
            const result = await registerUser(data);

            console.log("데이터 전송: " + data.username + ", " + data.email + ", " + data.password);
            alert("회원가입 되었습니다! 로그인 후 이용하여 주세요 :-)");
            form.reset();
            window.location.href = '/';
        } catch (error) {
            console.error('Error:', error);
            message.textContent = '아이디가 중복되었습니다. 다시 입력해주세요.';
            message.style.color = 'red';
        }
    });
});

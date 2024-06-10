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
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            // 서버로 폼 데이터를 전송
            const response = await fetch('/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // 가입 성공 시
                message.textContent = '회원가입이 성공적으로 완료되었습니다.';
                message.style.color = 'green';
                form.reset();
            } else {
                // 가입 실패 시
                message.textContent = result.message || '회원가입 중 오류가 발생했습니다.';
                message.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            message.textContent = '서버와 통신 중 오류가 발생했습니다.';
            message.style.color = 'red';
        }
    });
});
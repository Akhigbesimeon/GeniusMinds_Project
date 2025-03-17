document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("#register-form form");
    const loginForm = document.querySelector("#login-form form");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log('Registration form submitted');
        
        const formData = {
            fullname: registerForm.fullname.value,
            username: registerForm.username.value,
            email: registerForm.email.value,
            userType: registerForm.userType.value, // This will be converted to 'role' in API call
            password: registerForm.password.value
        };

        try {
            const response = await ApiService.auth.register(formData);
            if (response.message === 'Registration successful') {
                alert('Registration successful! Please login.');
                showForm('login-form');
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message || "Registration failed!");
        }
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log('Login form submitted');
        
        const formData = {
            username: loginForm.username.value,
            password: loginForm.password.value
        };

        try {
            const response = await ApiService.auth.login(formData);
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('username', formData.username);
                localStorage.setItem('user_role', response.role); // Store role from backend
                localStorage.setItem('login_time', API_CONFIG.CURRENT_TIME);
                window.location.href = '/dashboard.html';
            } else {
                throw new Error('Login failed - no access token received');
            }
        } catch (error) {
            console.error("Login error:", error);
            alert(error.message || "Login failed!");
        }
    });
});

function showForm(formId) {
    document.querySelectorAll('.form-box').forEach(form => form.classList.remove('active'));
    document.getElementById(formId).classList.add('active');
}
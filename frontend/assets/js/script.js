function showForm(formId) {
    document.querySelectorAll(".form-box").forEach(form => form.classList.remove("active"));
    document.getElementById(formId).classList.add("active");
}

function showForm(formId) {
    document.querySelectorAll('.form-box').forEach(function(formBox) {
        formBox.classList.remove('active');
    });

    document.getElementById(formId).classList.add('active');
}
// Single showForm function
function showForm(formId) {
    document.querySelectorAll('.form-box').forEach(form => form.classList.remove('active'));
    document.getElementById(formId).classList.add('active');
}

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
            userType: registerForm.userType.value,
            password: registerForm.password.value
        };

        try {
            const response = await ApiService.auth.register(formData);
            alert('Registration successful! Please login.');
            showForm('login-form');
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message || "Registration failed!");
        }
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log('Login form submitted');
        
        const formData = {
            username: loginForm.username.value, // Changed from email to username
            password: loginForm.password.value
        };

        try {
            const response = await ApiService.auth.login(formData);
            if (response.access_token) {
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('username', formData.username);
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

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.querySelector("#register-form form");
    const loginForm = document.querySelector("#login-form form");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = {
            fullname: registerForm.fullname.value,
            username: registerForm.username.value,
            email: registerForm.email.value,
            role: registerForm.userType.value,
            password: registerForm.password.value
        };

        try {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);  
                showForm('login-form'); 
            } else {
                alert(data.error); 
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    });

    
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = {
            email: loginForm.email.value,
            password: loginForm.password.value
        };

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);  
                localStorage.setItem("token", data.token); 
            } else {
                alert(data.error); 
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        }
    });
});


function showForm(formId) {
    document.querySelectorAll(".form-box").forEach((form) => form.classList.remove("active"));
    document.getElementById(formId).classList.add("active");
}

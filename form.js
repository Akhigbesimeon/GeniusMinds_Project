document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.form-box').classList.add('active');
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const role = document.getElementById('signup-role').value;
    if (role === 'student') {
        window.location.href = '';
    } else if (role === 'parent') {
        window.location.href = '';
    } else if (role === 'educator') {
        window.location.href = '';
    }
});
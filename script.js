function showForm(formId) {
    document.querySelectorAll(".form-box").forEach(form => form.classList.remove("active"));
    document.getElementById(formId).classList.add("active");
}

function showForm(formId) {
    // Hide all form boxes
    document.querySelectorAll('.form-box').forEach(function(formBox) {
        formBox.classList.remove('active');
    });

    // Show the selected form box
    document.getElementById(formId).classList.add('active');
}

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

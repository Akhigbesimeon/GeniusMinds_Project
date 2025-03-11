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



// Login page logic

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorDiv = document.getElementById('error-message');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value.trim().toLowerCase();
        const password = document.getElementById('password').value.trim();

        // Clear previous errors
        clearInputError(document.getElementById('email'));
        clearInputError(document.getElementById('password'));
        errorDiv.style.display = 'none';

        // Basic validation
        let hasError = false;
        if (!email) {
            showInputError(document.getElementById('email'), 'El email es requerido');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showInputError(document.getElementById('email'), 'Email inválido');
            hasError = true;
        }

        if (!password) {
            showInputError(document.getElementById('password'), 'La contraseña es requerida');
            hasError = true;
        }

        if (hasError) return;

        // Attempt login
        const result = await login(email, password);

        if (result.success) {
            // Redirect based on role
            const user = result.user;
            if (user.role === 'admin') {
                window.location.href = 'dashboard_admin.html';
            } else if (user.role === 'coach') {
                window.location.href = 'dashboard_coach.html';
            } else {
                window.location.href = 'dashboard_user.html';
            }
        } else {
            errorDiv.textContent = result.message;
            errorDiv.style.display = 'block';
        }
    });
});
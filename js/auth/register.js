// Register page logic

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = registerForm.name.value.trim();
        const email = registerForm.email.value.trim().toLowerCase();
        const password = registerForm.password.value.trim();
        const confirmPassword = registerForm.confirmPassword ? registerForm.confirmPassword.value.trim() : password;

        // Clear previous errors
        clearInputError(registerForm.name);
        clearInputError(registerForm.email);
        clearInputError(registerForm.password);
        if (registerForm.confirmPassword) clearInputError(registerForm.confirmPassword);

        // Validation
        let hasError = false;

        if (!name) {
            showInputError(registerForm.name, 'El nombre es requerido');
            hasError = true;
        }

        if (!email) {
            showInputError(registerForm.email, 'El email es requerido');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showInputError(registerForm.email, 'Email inválido');
            hasError = true;
        }

        if (!password) {
            showInputError(registerForm.password, 'La contraseña es requerida');
            hasError = true;
        } else if (!isValidPassword(password)) {
            showInputError(registerForm.password, 'La contraseña debe tener al menos 8 caracteres');
            hasError = true;
        }

        if (confirmPassword !== password) {
            showInputError(registerForm.confirmPassword || registerForm.password, 'Las contraseñas no coinciden');
            hasError = true;
        }

        if (hasError) return;

        // Attempt registration
        const result = await register(name, email, password);

        if (result.success) {
            showAlert('Registro exitoso. Ahora puedes iniciar sesión.', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showAlert(result.message, 'danger');
        }
    });
});
// Profile edit logic

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    // Load current user data
    await loadProfile();

    // Setup form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
});

async function loadProfile() {
    const result = await getCurrentUser();

    if (!result.success) {
        showAlert(result.message, 'danger');
        return;
    }

    const user = result.user;

    // Fill form fields
    const nameInput = document.querySelector('input[name="name"]');
    const emailInput = document.querySelector('input[name="email"]');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';

    // Show role (read-only)
    const roleDisplay = document.getElementById('user-role');
    if (roleDisplay) {
        roleDisplay.innerHTML = getRoleBadge(user.role);
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();

    const name = document.querySelector('input[name="name"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();

    // Clear errors
    clearInputError(document.querySelector('input[name="name"]'));
    clearInputError(document.querySelector('input[name="email"]'));

    // Validation
    let hasError = false;
    if (!name) {
        showInputError(document.querySelector('input[name="name"]'), 'El nombre es requerido');
        hasError = true;
    }

    if (!email) {
        showInputError(document.querySelector('input[name="email"]'), 'El email es requerido');
        hasError = true;
    } else if (!isValidEmail(email)) {
        showInputError(document.querySelector('input[name="email"]'), 'Email inválido');
        hasError = true;
    }

    if (hasError) return;

    // Update profile
    const result = await updateProfile({ name, email });

    if (result.success) {
        showAlert('Perfil actualizado exitosamente', 'success');
        // Update localStorage user
        localStorage.setItem('loggedInUser', JSON.stringify(result.user));
    } else {
        showAlert(result.message, 'danger');
    }
}

async function handlePasswordChange(e) {
    e.preventDefault();

    const currentPassword = document.querySelector('input[name="currentPassword"]').value;
    const newPassword = document.querySelector('input[name="newPassword"]').value;
    const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;

    // Clear errors
    clearInputError(document.querySelector('input[name="currentPassword"]'));
    clearInputError(document.querySelector('input[name="newPassword"]'));
    clearInputError(document.querySelector('input[name="confirmPassword"]'));

    // Validation
    let hasError = false;
    if (!currentPassword) {
        showInputError(document.querySelector('input[name="currentPassword"]'), 'Contraseña actual requerida');
        hasError = true;
    }

    if (!newPassword) {
        showInputError(document.querySelector('input[name="newPassword"]'), 'Nueva contraseña requerida');
        hasError = true;
    } else if (!isValidPassword(newPassword)) {
        showInputError(document.querySelector('input[name="newPassword"]'), 'Debe tener al menos 8 caracteres');
        hasError = true;
    }

    if (newPassword !== confirmPassword) {
        showInputError(document.querySelector('input[name="confirmPassword"]'), 'Las contraseñas no coinciden');
        hasError = true;
    }

    if (hasError) return;

    // Change password
    const result = await changePassword(currentPassword, newPassword);

    if (result.success) {
        showAlert('Contraseña cambiada exitosamente', 'success');
        // Clear form
        document.querySelector('input[name="currentPassword"]').value = '';
        document.querySelector('input[name="newPassword"]').value = '';
        document.querySelector('input[name="confirmPassword"]').value = '';
    } else {
        showAlert(result.message, 'danger');
    }
}
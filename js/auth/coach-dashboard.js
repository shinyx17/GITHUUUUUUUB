document.addEventListener('DOMContentLoaded', async function() {
    if (!checkRoleAccess('coach')) return;

    const result = await getCurrentUser();
    if (!result.success) {
        showAlert(result.message, 'danger');
        logout();
        return;
    }

    setLoggedInUser(result.user);
    const user = getLoggedInUser();

    const welcome = document.getElementById('welcome-message');
    if (welcome) {
        welcome.innerHTML = `Bienvenido, Coach <strong>${user.name}</strong>`;
    }
});

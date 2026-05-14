document.addEventListener('DOMContentLoaded', async function() {
    if (!checkRoleAccess('user')) return;

    const result = await getCurrentUser();
    if (!result.success) {
        showAlert(result.message, 'danger');
        logout();
        return;
    }

    setLoggedInUser(result.user);
    const user = getLoggedInUser();

    const nameElement = document.getElementById('user-name');
    const emailElement = document.getElementById('user-email');

    if (nameElement) {
        nameElement.innerHTML = `<strong>Nombre:</strong> ${user.name}`;
    }

    if (emailElement) {
        emailElement.innerHTML = `<strong>Email:</strong> ${user.email}`;
    }
});

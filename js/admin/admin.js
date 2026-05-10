// Admin dashboard logic

document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    if (!checkRoleAccess('admin')) return;

    const user = getLoggedInUser();
    if (user) {
        document.getElementById('welcome-message').innerHTML = `Bienvenido, Admin <strong>${user.name}</strong>`;
    }

    // Load users table
    await loadUsersTable();

    // Setup event listeners for dynamic elements
    setupTableEventListeners();
});

async function loadUsersTable() {
    const result = await getUsers();

    if (!result.success) {
        showAlert(result.message, 'danger');
        return;
    }

    const users = result.users;
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${getRoleBadge(user.role)}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2 edit-btn" data-id="${user.id}">Editar</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${user.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Re-setup event listeners after loading
    setupTableEventListeners();
}

function setupTableEventListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            // For now, just alert. In a real app, open edit modal
            alert(`Editar usuario ${userId}`);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const userId = this.getAttribute('data-id');
            if (confirm('¿Estás seguro de eliminar este usuario?')) {
                const result = await deleteUser(userId);
                if (result.success) {
                    showAlert('Usuario eliminado exitosamente', 'success');
                    loadUsersTable();
                } else {
                    showAlert(result.message, 'danger');
                }
            }
        });
    });
}
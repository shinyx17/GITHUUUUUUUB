// Admin dashboard logic

document.addEventListener('DOMContentLoaded', async function() {
    if (!checkRoleAccess('admin')) return;

    const user = getLoggedInUser();
    if (user) {
        const welcome = document.getElementById('welcome-message');
        if (welcome) {
            welcome.innerHTML = `Bienvenido, Admin <strong>${user.name}</strong>`;
        }
    }

    setupUserForm();
    await loadUsersTable();
});

function setupUserForm() {
    const userForm = document.getElementById('user-form');
    const cancelButton = document.getElementById('cancel-edit-btn');

    if (userForm) {
        userForm.addEventListener('submit', handleUserFormSubmit);
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', resetUserForm);
    }
}

async function loadUsersTable() {
    const result = await getUsers();

    if (!result.success) {
        showAlert(result.message, 'danger');
        return;
    }

    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';

    result.users.forEach(user => {
        const displayName = user.full_name || user.name || 'Sin nombre';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${displayName}</td>
            <td>${user.email}</td>
            <td>${getRoleBadge(user.role)}</td>
            <td>${formatDate(user.createdAt || user.birth_date || '')}</td>
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
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const userId = this.getAttribute('data-id');
            const result = await getUserById(userId);
            if (!result.success) {
                showAlert(result.message, 'danger');
                return;
            }

            setEditUser(result.user);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const userId = this.getAttribute('data-id');
            const result = await getUserById(userId);
            const username = result.success ? (result.user.full_name || result.user.name || 'este usuario') : 'este usuario';
            const confirmed = await showConfirmation(`¿Eliminar a ${username}?`);
            if (!confirmed) return;

            const deleteResult = await deleteUser(userId);
            if (deleteResult.success) {
                showAlert('Usuario eliminado exitosamente', 'success');
                resetUserForm();
                await loadUsersTable();
            } else {
                showAlert(deleteResult.message, 'danger');
            }
        });
    });
}

async function handleUserFormSubmit(event) {
    event.preventDefault();

    const userId = document.getElementById('editing-user-id').value;
    const fullNameInput = document.getElementById('user-full-name');
    const emailInput = document.getElementById('user-email');
    const roleInput = document.getElementById('user-role');
    const passwordInput = document.getElementById('user-password');

    clearInputError(fullNameInput);
    clearInputError(emailInput);
    clearInputError(passwordInput);

    const full_name = fullNameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const role = roleInput.value;
    const password = passwordInput.value;

    let hasError = false;

    if (!full_name) {
        showInputError(fullNameInput, 'El nombre es obligatorio');
        hasError = true;
    }

    if (!email) {
        showInputError(emailInput, 'El email es obligatorio');
        hasError = true;
    } else if (!isValidEmail(email)) {
        showInputError(emailInput, 'Email inválido');
        hasError = true;
    }

    if (!role) {
        showInputError(roleInput, 'El rol es obligatorio');
        hasError = true;
    }

    const isEditing = Boolean(userId);
    if (!isEditing && !password) {
        showInputError(passwordInput, 'La contraseña es obligatoria para crear usuario');
        hasError = true;
    }

    if (password && !isValidPassword(password)) {
        showInputError(passwordInput, 'La contraseña debe tener al menos 8 caracteres');
        hasError = true;
    }

    if (hasError) return;

    const payload = { full_name, email, role };
    if (password) payload.password = password;

    let result;
    if (isEditing) {
        result = await updateUser(userId, payload);
    } else {
        result = await createUser(payload);
    }

    if (!result.success) {
        showAlert(result.message, 'danger');
        return;
    }

    showAlert(isEditing ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente', 'success');
    resetUserForm();
    await loadUsersTable();
}

function setEditUser(user) {
    const fullNameInput = document.getElementById('user-full-name');
    const emailInput = document.getElementById('user-email');
    const roleInput = document.getElementById('user-role');
    const passwordInput = document.getElementById('user-password');
    const editingIdInput = document.getElementById('editing-user-id');
    const formTitle = document.getElementById('user-form-title');
    const cancelButton = document.getElementById('cancel-edit-btn');

    fullNameInput.value = user.full_name || user.name || '';
    emailInput.value = user.email || '';
    roleInput.value = user.role || 'user';
    passwordInput.value = '';
    editingIdInput.value = user.id;
    formTitle.textContent = 'Editar usuario';
    cancelButton.classList.remove('d-none');
}

function resetUserForm() {
    const fullNameInput = document.getElementById('user-full-name');
    const emailInput = document.getElementById('user-email');
    const roleInput = document.getElementById('user-role');
    const passwordInput = document.getElementById('user-password');
    const editingIdInput = document.getElementById('editing-user-id');
    const formTitle = document.getElementById('user-form-title');
    const cancelButton = document.getElementById('cancel-edit-btn');

    fullNameInput.value = '';
    emailInput.value = '';
    roleInput.value = 'user';
    passwordInput.value = '';
    editingIdInput.value = '';
    formTitle.textContent = 'Crear usuario';
    cancelButton.classList.add('d-none');
}

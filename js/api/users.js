// API calls for users CRUD

// Get all users
async function getUsers() {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener usuarios');
        }

        return { success: true, users: data.data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Get user by ID
async function getUserById(id) {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener usuario');
        }

        return { success: true, user: data.data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Create user
async function createUser(userData) {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear usuario');
        }

        return { success: true, user: data.data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Update user
async function updateUser(id, userData) {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar usuario');
        }

        return { success: true, user: data.data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Delete user
async function deleteUser(id) {
    try {
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error al eliminar usuario');
        }

        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
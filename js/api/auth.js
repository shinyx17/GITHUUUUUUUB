// API calls for authentication

// Login
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en el login');
        }

        const user = data.data.user;
        const token = data.data.token;

        localStorage.setItem('token', token);
        localStorage.setItem('loggedInUser', JSON.stringify(user));

        return { success: true, user };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Register
async function register(name, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ full_name: name, email, password, role: 'user' })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en el registro');
        }

        return { success: true, message: data.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Get current user profile
async function getCurrentUser() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener perfil');
        }

        return { success: true, user: data.data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Update user profile
async function updateProfile(userData) {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar perfil');
        }

        return { success: true, user: data.data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Change password
async function changePassword(currentPassword, newPassword, confirmPassword) {
    try {
        const response = await fetch(`${API_URL}/auth/me/password`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al cambiar contraseña');
        }

        return { success: true, message: data.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
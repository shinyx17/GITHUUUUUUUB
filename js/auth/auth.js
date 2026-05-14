// Helper para obtener headers de autenticación
function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    };
}

function normalizeUser(user) {
    if (!user) return null;
    return {
        ...user,
        name: user.name || user.full_name || user.fullName || '',
        email: user.email || '',
        role: user.role || ''
    };
}

function setLoggedInUser(user) {
    localStorage.setItem('loggedInUser', JSON.stringify(normalizeUser(user)));
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Función para obtener el usuario logueado desde localStorage
function getLoggedInUser() {
    const user = localStorage.getItem('loggedInUser');
    try {
        return user ? normalizeUser(JSON.parse(user)) : null;
    } catch (error) {
        localStorage.removeItem('loggedInUser');
        return null;
    }
}

// Función para logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

// Función para verificar rol y redirigir si no tiene acceso
function requireRole(allowedRoles) {
    if (typeof allowedRoles === 'string') {
        allowedRoles = [allowedRoles];
    }

    if (!isAuthenticated()) {
        logout();
        return false;
    }

    const user = getLoggedInUser();
    if (!user || !allowedRoles.includes(user.role)) {
        logout();
        return false;
    }

    return true;
}

// Función para verificar rol y redirigir si no tiene acceso
function checkRoleAccess(requiredRole) {
    return requireRole(requiredRole);
}
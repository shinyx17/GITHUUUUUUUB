// Helper para obtener headers de autenticación
function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    };
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return !!localStorage.getItem("token");
}

// Función para obtener el usuario logueado desde localStorage
function getLoggedInUser() {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
}

// Función para logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

// Función para verificar rol y redirigir si no tiene acceso
function checkRoleAccess(requiredRole) {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }

    const user = getLoggedInUser();
    if (!user || user.role !== requiredRole) {
        window.location.href = 'login.html';
        return false;
    }

    return true;
}
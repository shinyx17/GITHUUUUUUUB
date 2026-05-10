// Lista de usuarios con roles
const users = [
    // Usuarios normales
    { email: "maxv3@sportclub.cl", password: "alumnsport", role: "user", name: "Max Verstappen" },
    { email: "falonso14@sportclub.cl", password: "alumnsport", role: "user", name: "Fernando Alonso" },
    { email: "landon4@sportclub.cl", password: "alumnsport", role: "user", name: "Lando Norris" },
    // Coaches
    { email: "lhamilton44@sportclub.cl", password: "coachsport", role: "coach", name: "Lewis Hamilton" },
    { email: "cleclerc16@sportclub.cl", password: "coachsport", role: "coach", name: "Charles Leclerc" },
    // Admins
    { email: "opiastri81@sportclub.cl", password: "adminsport", role: "admin", name: "Oscar Piastri" },
    { email: "grussell63@sportclub.cl", password: "adminsport", role: "admin", name: "George Russell" }
];

// Función para guardar usuarios en localStorage (para registros futuros)
function saveUsersToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Función para cargar usuarios desde localStorage
function loadUsersFromLocalStorage() {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : users;
}

// Función para validar login
function validateLogin(email, password) {
    const currentUsers = loadUsersFromLocalStorage();
    const user = currentUsers.find(u => u.email === email);

    if (!user) {
        // Correo no existe
        if (currentUsers.some(u => u.password === password)) {
            return { success: false, message: "El correo es inválido" };
        } else {
            return { success: false, message: "Los datos son incorrectos" };
        }
    }

    if (user.password !== password) {
        return { success: false, message: "La contraseña es incorrecta" };
    }

    // Login exitoso
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    return { success: true, user: user };
}

// Función para obtener usuario logueado
function getLoggedInUser() {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
}

// Función para logout
function logout() {
    localStorage.removeItem('loggedInUser');
}

// Función para cambiar el rol de un usuario
function updateUserRole(email, newRole) {
    const currentUsers = loadUsersFromLocalStorage();
    const userIndex = currentUsers.findIndex(u => u.email === email);
    
    if (userIndex !== -1) {
        currentUsers[userIndex].role = newRole;
        localStorage.setItem('users', JSON.stringify(currentUsers));
        return true;
    }
    return false;
}

// Inicializar localStorage con usuarios si no existen
if (!localStorage.getItem('users')) {
    saveUsersToLocalStorage();
}
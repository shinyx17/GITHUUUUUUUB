// Utility functions for validations and UI

// Show error message below input
function showInputError(inputElement, message) {
    // Remove existing error
    clearInputError(inputElement);

    // Add error class to input
    inputElement.classList.add('error');

    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '5px';

    // Insert after input
    inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
}

// Clear error from input
function clearInputError(inputElement) {
    inputElement.classList.remove('error');
    const errorDiv = inputElement.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Show Bootstrap alert
function showAlert(message, type = 'danger') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insert at top of main or container
    const container = document.querySelector('.container') || document.querySelector('main') || document.body;
    container.insertBefore(alertDiv, container.firstChild);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showConfirmation(message) {
    return new Promise((resolve) => {
        const existing = document.querySelector('.confirm-alert');
        if (existing) {
            existing.remove();
        }

        const confirmDiv = document.createElement('div');
        confirmDiv.className = 'alert alert-warning confirm-alert d-flex align-items-center justify-content-between';
        confirmDiv.style.marginBottom = '16px';
        confirmDiv.innerHTML = `
            <div>${message}</div>
        `;

        const actions = document.createElement('div');
        const confirmButton = document.createElement('button');
        confirmButton.type = 'button';
        confirmButton.className = 'btn btn-sm btn-danger me-2';
        confirmButton.textContent = 'Confirmar';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'btn btn-sm btn-secondary';
        cancelButton.textContent = 'Cancelar';

        actions.appendChild(confirmButton);
        actions.appendChild(cancelButton);
        confirmDiv.appendChild(actions);

        const container = document.querySelector('.container') || document.querySelector('main') || document.body;
        container.insertBefore(confirmDiv, container.firstChild);

        confirmButton.addEventListener('click', () => {
            confirmDiv.remove();
            resolve(true);
        });

        cancelButton.addEventListener('click', () => {
            confirmDiv.remove();
            resolve(false);
        });
    });
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password) {
    return password.length >= 8;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

// Get role badge HTML
function getRoleBadge(role) {
    const badges = {
        'admin': 'bg-danger',
        'coach': 'bg-warning',
        'user': 'bg-success'
    };
    return `<span class="badge ${badges[role] || 'bg-secondary'}">${role}</span>`;
}
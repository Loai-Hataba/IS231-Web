// Show validation error
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const container = field.parentElement;
    const existingError = container.querySelector('.error-message');
    
    // Remove existing error if present
    if (existingError) {
        existingError.remove();
    }

    // Create and add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    // Insert error after the input field
    container.appendChild(errorDiv);

    // Add visual feedback to the input
    field.classList.add('invalid');
}

// Clear specific field error
function clearError(container) {
    const existingError = container.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Clear all errors
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.invalid').forEach(field => {
        field.classList.remove('invalid');
    });
}

// Email validation helper
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Generate a random token for password reset
function generateResetToken() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const resetForm = document.getElementById('reset-form');
    const emailInput = document.getElementById('email');
    const resetMessage = document.getElementById('reset-message');
    const submitButton = document.getElementById('login-button');
    
    // Handle form submission
    resetForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearErrors();

        const email = emailInput.value.trim();

        // Validate email
        if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            return;
        }

        // Check if email exists in localStorage
        try {
            const users = JSON.parse(localStorage.getItem('conquista_users')) || [];
            const userExists = users.some(user => user.email === email);

            if (!userExists) {
                showError('email', 'No account found with this email address');
                return;
            }

            // Generate password reset token with expiration
            const resetToken = generateResetToken();
            const expiresAt = new Date().getTime() + (60 * 60 * 1000); // 1 hour expiration
            
            // Store token in localStorage
            const resetRequests = JSON.parse(localStorage.getItem('password_reset_requests')) || {};
            resetRequests[email] = {
                token: resetToken,
                expiresAt: expiresAt
            };
            localStorage.setItem('password_reset_requests', JSON.stringify(resetRequests));
            
            // Hide email input and submit button
            const inputGroup = emailInput.closest('.input-group');
            if (inputGroup) {
                inputGroup.style.display = 'none';
            }
            submitButton.style.display = 'none';
            
            // Show success message
            resetMessage.classList.remove('hidden');
            
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    });
});
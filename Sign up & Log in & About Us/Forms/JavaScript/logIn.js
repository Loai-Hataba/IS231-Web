// Toggle password visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const type = input.type === 'password' ? 'text' : 'password';
  input.type = type;
  
  const toggle = input.parentElement.querySelector('.password-toggle');
  toggle.style.opacity = type === 'text' ? '1' : '0.6';
}

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
    errorDiv.style.color = '#f44336';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';
    errorDiv.style.transition = 'opacity 0.3s ease';
    errorDiv.textContent = message;

    // Insert error after the input field
    container.appendChild(errorDiv);

    // Add visual feedback to the input
    field.classList.add('invalid');
    field.style.borderColor = '#f44336';
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

document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    // Handle form submission
    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validate inputs
        if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            return;
        }
        if (password.length < 8) {
            showError('password', 'Password must be at least 8 characters long');
            return;
        }

        // Get users from localStorage
        try {
            const users = JSON.parse(localStorage.getItem('conquista_users')) || [];
            const user = users.find(u => u.email === email);

            if (!user) {
                showError('email', 'No account found with this email');
                return;
            }

            if (user.password !== password) {
                showError('password', 'Incorrect password');
                return;
            }

            // Login successful
            if (rememberMeCheckbox?.checked) {
                localStorage.setItem('rememberedUser', email);
            }

            // Redirect to dashboard/home
            window.location.href = '../../Landing Page/Index.html';
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login. Please try again.');
        }
    });    
    // Check for remembered user
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        emailInput.value = rememberedUser;
    }
});
// Email validation helper
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
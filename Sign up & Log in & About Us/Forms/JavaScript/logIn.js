// The main logic of login page
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const submitButton = document.getElementById('login-button');

    
    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearErrors();
        setLoading(true);

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        try {
            // Validate inputs
            if (!validateEmail(email)) {
                showError(emailInput, 'Please enter a valid email address');
                setLoading(false);
                return;
            }

            if (password.length < 8) {
                showError(passwordInput, 'Password must be at least 8 characters long');
                setLoading(false);
                return;
            }

            const users = JSON.parse(localStorage.getItem('conquista_users')) || [];
            const user = users.find(u => u.email === email);

            if (!user) {
                showError(emailInput, 'No account found with this email');
                setLoading(false);
                return;
            }

            if (user.password !== password) {
                showError(passwordInput, 'Incorrect password');
                setLoading(false);
                return;
            }

            // Login successful
            if (rememberMeCheckbox?.checked) {
                localStorage.setItem('rememberedUser', email);
            }

            // Redirect with success message
            window.location.href = '../../Landing Page/Index.html';

        } catch (error) {
            showError(emailInput, 'An error occurred. Please try again.');
            setLoading(false);
        }
    });

    // Load remembered user
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        emailInput.value = rememberedUser;
        passwordInput.focus();
    }
});
// function to set loading state
function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.innerHTML = isLoading ? 
        '<span class="loading-spinner"></span> Logging in...' : 
        'Log In';
}

// function to validate email
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// function to toggle password visibility
function togglePassword(inputId, toggleElement) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    
    // Update toggle appearance
    toggleElement.style.opacity = type === 'text' ? '1' : '0.6';
    toggleElement.textContent = '👁️';
    toggleElement.setAttribute('aria-label', `${type === 'password' ? 'Show' : 'Hide'} password`);
}

// function to show error msgs
function showError(field, message) {
    if (!field) return;

    const container = field.closest('.input-group');
    clearError(container);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;

    if (field.id === 'password') {
        const passwordContainer = container.querySelector('.password-container');
        passwordContainer.after(errorDiv);
    } else {
        container.appendChild(errorDiv);
    }
    
    field.classList.add('invalid');
}

// function to clear an error 
function clearError(container) {
  const existingError = container.querySelector('.error-message');
  if (existingError) {
      existingError.remove();
  }
  
  const input = container.querySelector('input');
  if (input && input.classList.contains('invalid')) {
      input.classList.remove('invalid');
  }
}

// function to clear all errors
function clearErrors() {
  document.querySelectorAll('.error-message').forEach(error => error.remove());
  document.querySelectorAll('.invalid').forEach(field => {
      field.classList.remove('invalid');
  });
}
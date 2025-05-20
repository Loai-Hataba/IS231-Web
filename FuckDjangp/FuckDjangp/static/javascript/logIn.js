document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const submitButton = document.getElementById('login-button');

    // function to set loading state
    function setLoading(isLoading) {
        if (!submitButton) return;
        
        submitButton.disabled = isLoading;
        submitButton.innerHTML = isLoading ? 
            '<span class="loading-spinner"></span> Logging in...' : 
            'Log In';
    }

    loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearErrors();
        setLoading(true);

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            showError(emailInput, 'Both email and password are required');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Store user info if remember me is checked
                if (rememberMeCheckbox?.checked) {
                    localStorage.setItem('rememberedUser', email);
                    localStorage.setItem('isAdmin', data.is_admin);
                    localStorage.setItem('userName', data.user_name);
                }

                // Redirect to appropriate page
                window.location.href = data.redirect;
            } else {
                // Handle error responses
                if (data.field && data.error) {
                    showError(document.getElementById(data.field), data.error);
                } else {
                    alert(data.error || 'Login failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            showError(emailInput, 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    });

    // load remembered user if exists
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser && emailInput) {
        emailInput.value = rememberedUser;
        if (passwordInput) passwordInput.focus();
    }
});

// function to validate email
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// function to toggle password visibility
function togglePassword(inputId, toggleElement) {
    const input = document.getElementById(inputId);
    if (!input || !toggleElement) return;
    
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    
    // Update toggle appearance
    toggleElement.style.opacity = type === 'text' ? '1' : '0.6';
    toggleElement.textContent = '👁️';
    toggleElement.setAttribute('aria-label', `${type === 'password' ? 'Show' : 'Hide'} password`);
    toggleElement.setAttribute('aria-pressed', type === 'text' ? 'true' : 'false');
}

// function to show error msgs
function showError(field, message) {
    if (!field) return;

    // handle both string ID and element references
    const inputElement = typeof field === 'string' ? document.getElementById(field) : field;
    if (!inputElement) return;
    
    const container = inputElement.closest('.input-group');
    if (!container) return;

    clearError(container);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;

    if (inputElement.id === 'password') {
        const passwordContainer = container.querySelector('.password-container');
        if (passwordContainer) {
            passwordContainer.after(errorDiv);
        } else {
            container.appendChild(errorDiv);
        }
    } else {
        container.appendChild(errorDiv);
    }
    
    inputElement.classList.add('invalid');
    inputElement.setAttribute('aria-invalid', 'true');
}

// function to clear an error 
function clearError(container) {
    if (!container) return;
    
    const existingError = container.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const input = container.querySelector('input');
    if (input && input.classList.contains('invalid')) {
        input.classList.remove('invalid');
        input.removeAttribute('aria-invalid');
    }
}

// function to clear all errors
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.invalid').forEach(field => {
        field.classList.remove('invalid');
        field.removeAttribute('aria-invalid');
    });
}
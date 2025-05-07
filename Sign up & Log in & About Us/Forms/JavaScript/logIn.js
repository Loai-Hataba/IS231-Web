
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

        try {
            const userData = localStorage.getItem(`user_${email}`);
            
            if (!userData) {
                showError('email', 'No account found with this email');
                setLoading(false);
                return;
            }

            const user = JSON.parse(userData);

            if (user.password !== password) {
                showError('password', 'Incorrect password');
                setLoading(false);
                return;
            }

            // create session only when the login is successful
            const sessionData = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
                loginTime: new Date().toISOString()
            };

            // set session
            sessionStorage.setItem('currentUser', JSON.stringify(sessionData));

            // handle remember me
            if (rememberMeCheckbox?.checked) {
                localStorage.setItem('rememberedUser', email);
            } else {
                localStorage.removeItem('rememberedUser');
            }

            if(user.isAdmin ) {
                // redirect to landing page
            window.location.href = '../../AdminPanel/AdminPanel.html';
            }
            else {
                window.location.href = '../../Landing Page/Index.html';
            }

        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please try again.');
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
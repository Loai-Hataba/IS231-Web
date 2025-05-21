document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-admin-form');
    
    // Add password strength checker
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
    
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        clearErrors();
        
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        let isValid = true;

        if (firstName.length < 2 || !/^[A-Za-z]+$/.test(firstName)) {
            showError('firstName', 'First name must be at least 2 characters and contain only letters.');
            isValid = false;
        }

        if (lastName.length < 2 || !/^[A-Za-z]+$/.test(lastName)) {
            showError('lastName', 'Last name must be at least 2 characters and contain only letters.');
            isValid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Please enter a valid email address.');
            isValid = false;
        }

        if (!isPasswordStrong(password)) {
            showError('password', 'Password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.');
            isValid = false;
        }

        if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match.');
            isValid = false;
        }

        if (!isValid) return;

        try {
            setLoading(true);
            const response = await fetch('/add-admin/', {  // Update this URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({
                    firstname: firstName,
                    lastname: lastName,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Admin added successfully!');
                window.location.href = '/adminPanel/';  // Redirect to admin panel
            } else {
                throw new Error(data.error || 'Failed to create admin account');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    });
});

function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    let strength = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /[0-9]/.test(password),
        symbols: /[!@#$%^&*]/.test(password)
    };

    strength = Object.values(checks).filter(Boolean).length;

    // Update UI
    strengthBar.className = '';
    strengthText.className = '';
    
    if (strength === 0) {
        strengthBar.className = 'weak';
        strengthText.className = 'weak';
        strengthText.textContent = 'Weak';
    } else if (strength <= 2) {
        strengthBar.className = 'fair';
        strengthText.className = 'fair';
        strengthText.textContent = 'Fair';
    } else if (strength <= 4) {
        strengthBar.className = 'good';
        strengthText.className = 'good';
        strengthText.textContent = 'Good';
    } else {
        strengthBar.className = 'strong';
        strengthText.className = 'strong';
        strengthText.textContent = 'Strong';
    }
}

function isPasswordStrong(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password) && 
           /[!@#$%^&*]/.test(password);
}

function setLoading(isLoading) {
    const button = document.getElementById('signup-button');  // Updated ID
    if (!button) return;
    
    button.disabled = isLoading;
    button.innerHTML = isLoading ? 
        '<span class="loading-spinner"></span> Creating admin account...' : 
        'Add Admin';
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const container = field.closest('.input-group');
    clearError(container);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    container.appendChild(errorDiv);
    field.classList.add('invalid');
}

function clearError(container) {
    if (!container) return;
    
    const errorMessage = container.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    
    const input = container.querySelector('input');
    if (input && input.classList.contains('invalid')) {
        input.classList.remove('invalid');
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.invalid').forEach(field => field.classList.remove('invalid'));
}

function togglePassword(inputId, toggleElement) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    toggleElement.style.opacity = type === 'text' ? '1' : '0.6';
}
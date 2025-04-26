// the main logic of signup page : 
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    clearErrors();
    setLoading(true);

    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    const isAdmin = document.getElementById('isAdmin').checked;
    
    // Validate form fields
    let isValid = true;

    if (firstName.length < 2 || !/^[A-Za-z]+$/.test(firstName)) {
        showError(document.getElementById('firstName'), 'First name must be at least 2 characters and contain only letters.');
        isValid = false;
    }

    if (lastName.length < 2 || !/^[A-Za-z]+$/.test(lastName)) {
        showError(document.getElementById('lastName'), 'Last name must be at least 2 characters and contain only letters.');
        isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(document.getElementById('email'), 'Please enter a valid email address.');
        isValid = false;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || 
        !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
        showError(document.getElementById('password'), 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols.');
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError(document.getElementById('confirmPassword'), 'Passwords do not match.');
        isValid = false;
    }

    if (!acceptTerms) {
        showError(document.getElementById('acceptTerms'), 'You must accept the terms to continue.');
        isValid = false;
    }

    if (!isValid) {
        setLoading(false);
        return;
    }

    // Replace the localStorage save block with this improved version
    try {
        // Check if email exists
        const existingUser = localStorage.getItem(`user_${email}`);
        if (existingUser) {
            showError(document.getElementById('email'), 'This email is already registered');
            setLoading(false);
            return;
        }

        // Create and store user data
        const userData = {
            firstName,
            lastName,
            email,
            password,
            createdAt: new Date().toISOString(),
            isAdmin: isAdmin,
            id: Date.now()
        };

        // Store user data only
        localStorage.setItem(`user_${email}`, JSON.stringify(userData));
        
        // Show success message and redirect to login
        alert('Account created successfully! Please log in.');
        window.location.href = 'login.html';

    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration. Please try again.');
        setLoading(false);
    };
});
// function to toggle the password visiability
function togglePassword(inputId, toggleElement) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    
    toggleElement.style.opacity = type === 'text' ? '1' : '0.6';
    toggleElement.textContent = '👁️';
    toggleElement.setAttribute('aria-label', `${type === 'password' ? 'Show' : 'Hide'} password`);
}

// function to show error msgs 
function showError(field, message) {
    if (typeof field === 'string') {
        field = document.getElementById(field);
    }
    
    if (!field) return;
    const container = field.closest('.input-group');
    clearError(container);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;
    
    if (field.id === 'password' || field.id === 'confirmPassword') {
        const passwordContainer = container.querySelector('.password-container');
        if (passwordContainer) {
            // Insert error message after password container
            passwordContainer.after(errorDiv);
            
            // If it's the password field, move strength indicator below error
            if (field.id === 'password') {
                const strengthIndicator = container.querySelector('.password-strength');
                if (strengthIndicator) {
                    errorDiv.after(strengthIndicator);
                }
            }
        } else {
            container.appendChild(errorDiv);
        }
    } else {
        container.appendChild(errorDiv);
    }
    
    field.classList.add('invalid');
}

// function to clear an error msg
function clearError(container) {
    if (typeof container === 'string') {
        container = document.getElementById(container);
    }
    
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

// function to clear all error msgs 
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    
    document.querySelectorAll('.invalid').forEach(input => {
        input.classList.remove('invalid');
    });
}

// function for loading state 
function setLoading(isLoading) {
    const submitButton = document.getElementById('signup-button');
    submitButton.disabled = isLoading;
    submitButton.innerHTML = isLoading ? 
        '<span class="loading-spinner"></span> Creating account...' : 
        'Create an account';
}


// fuunctio to check the password strength
function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    // Remove all classes
    strengthBar.className = '';
    strengthText.className = '';
    
    if (password.length === 0) {
        strengthBar.className = '';
        strengthText.textContent = 'Weak';
        return;
    }

    // Calculate strength
    let strength = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /[0-9]/.test(password),
        symbols: /[!@#$%^&*]/.test(password)
    };

    strength = Object.values(checks).filter(Boolean).length;

    // Update UI based on strength
    let strengthClass, strengthLabel;
    switch(strength) {
        case 0:
        case 1:
            strengthClass = 'weak';
            strengthLabel = 'Weak';
            break;
        case 2:
        case 3:
            strengthClass = 'fair';
            strengthLabel = 'Fair';
            break;
        case 4:
            strengthClass = 'good';
            strengthLabel = 'Good';
            break;
        case 5:
            strengthClass = 'strong';
            strengthLabel = 'Strong';
            break;
    }

    strengthBar.className = strengthClass;
    strengthText.className = strengthClass;
    strengthText.textContent = strengthLabel;
}

// Add event listener to password input
document.getElementById('password').addEventListener('input', (e) => {
    checkPasswordStrength(e.target.value);
});
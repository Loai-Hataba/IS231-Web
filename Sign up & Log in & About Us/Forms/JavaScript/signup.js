function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    
    // Update the eye icon toggle state
    const toggle = input.parentElement.querySelector('.password-toggle');
    if (toggle) {
        toggle.innerHTML = type === 'password' ? '👁️' : '👁️';
        toggle.style.opacity = type === 'text' ? '1' : '0.6';
        toggle.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
    }
}

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

function clearErrors() {
    // Remove all existing error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    // Reset input styling
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        input.classList.remove('invalid');
        input.style.borderColor = '';
    });
}

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    clearErrors();

    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    const isAdmin = document.getElementById('isAdmin').checked; // Optional: Admin checkbox
    const isAdminValue = isAdmin ? true : false; // Convert to boolean
    // Validate form fields
    let isValid = true;

    if (firstName.length < 2 || !/^[A-Za-z]+$/.test(firstName)) {
        showError('firstName', 'First name must be at least 2 characters and contains only letters.');
        isValid = false;
    }

    if (lastName.length < 2 || !/^[A-Za-z]+$/.test(lastName)) {
        showError('lastName', 'Last name must be at least 2 characters and contains only letters.');
        isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'Please enter a valid email address.');
        isValid = false;
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || 
        !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
        showError('password', 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols.');
        isValid = false;
    }

    if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match.');
        isValid = false;
    }

    if (!acceptTerms) {
        showError('acceptTerms', 'You must accept the terms to continue.');
        isValid = false;
    }

    if (!isValid) return;

    // Create user data
    const userData = {
        firstName,
        lastName,
        email,
        password,
        createdAt: new Date().toISOString(),
        isAdmin: isAdminValue // Store admin status
    };

    // Save to localStorage
    try {
        const users = JSON.parse(localStorage.getItem('conquista_users')) || [];
        if (users.some(user => user.email === email)) {
            showError('email', 'This email is already registered');
            return;
        }
        users.push(userData);
        localStorage.setItem('conquista_users', JSON.stringify(users));
        
        alert('Sign up successful!');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error saving user:', error);
        alert('An error occurred during registration. Please try again.');
    }
});

// Add password strength checker
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

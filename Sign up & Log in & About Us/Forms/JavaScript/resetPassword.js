// the main logic to reset the password 
document.addEventListener("DOMContentLoaded", () => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const token = urlParams.get("token");

    const resetForm = document.getElementById("reset-password-form");
    const invalidLinkMessage = document.getElementById("invalid-link-message");
    const resetSuccessMessage = document.getElementById("reset-success-message");
    const submitButton = resetForm.querySelector('button[type="submit"]');

    

    if (!validateResetToken()) {
        resetForm.style.display = "none";
        invalidLinkMessage.classList.remove("hidden");
        return;
    }

    // Handle form submission with enhanced validation
    resetForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearErrors();
        setLoading(true);

        const passwordInput = document.getElementById("password");
        const confirmPasswordInput = document.getElementById("confirm-password");
        const password = passwordInput.value;
        
        // Enhanced password validation
        const { isValid, validExps } = validatePassword(password);
        if (!isValid) {
            let errorMessage = 'Password must:';
            if (!validExps.length) errorMessage += '\n- Be at least 8 characters long';
            if (!validExps.uppercase) errorMessage += '\n- Include an uppercase letter';
            if (!validExps.lowercase) errorMessage += '\n- Include a lowercase letter';
            if (!validExps.number) errorMessage += '\n- Include a number';
            if (!validExps.special) errorMessage += '\n- Include a special character';
            
            showError("password", errorMessage);
            setLoading(false);
            return;
        }

        if (password !== confirmPasswordInput.value) {
            showError("confirm-password", "Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            // Update password with error handling
            const users = JSON.parse(localStorage.getItem("conquista_users")) || [];
            const userIndex = users.findIndex(user => user.email === email);

            if (userIndex === -1) throw new Error("User not found");

            users[userIndex].password = password;
            localStorage.setItem("conquista_users", JSON.stringify(users));

            // Cleanup reset request
            const resetRequests = JSON.parse(localStorage.getItem("password_reset_requests")) || {};
            delete resetRequests[email];
            localStorage.setItem("password_reset_requests", JSON.stringify(resetRequests));

            // Show success and redirect
            resetForm.style.display = "none";
            resetSuccessMessage.classList.remove("hidden");
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);

        } catch (error) {
            console.error("Error resetting password:", error);
            showError("form", "An error occurred. Please try again or contact support.");
        } finally {
            setLoading(false);
        }
    });
});

// function to validate the reset token 
function validateResetToken() {
    if (!email || !token) return false;

    try {
        const resetRequests = JSON.parse(localStorage.getItem("password_reset_requests")) || {};
        const request = resetRequests[email];
        
        if (!request || request.token !== token) return false;
        
        const isExpired = new Date().getTime() > request.expiresAt;
        if (isExpired) {
            showError('form', 'This reset link has expired. Please request a new one.');
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error validating token:", error);
        return false;
    }
}


 // function for loading the state 
 function setLoading(isLoading) {
    submitButton.disabled = isLoading;
    submitButton.innerHTML = isLoading ? 
        '<span class="loading-spinner"></span> Resetting...' : 
        'Reset Password';
}
//function to validate the entered password
function validatePassword(password) {
    const validExps = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };
    
    return {
        isValid: Object.values(validExps).every(Boolean),
        validExps
    };
}

// function to toggle the password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === "password" ? "text" : "password";
    input.type = type;

    const toggle = input.parentElement.querySelector(".password-toggle");
    toggle.style.opacity = type === "text" ? "1" : "0.6"

}

// function to show error msgs 
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const container = field.parentElement;
    clearError(container);

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.setAttribute('role', 'alert');
    errorDiv.textContent = message;

    container.appendChild(errorDiv);
    field.classList.add("invalid");
    field.setAttribute('aria-invalid', 'true');
}


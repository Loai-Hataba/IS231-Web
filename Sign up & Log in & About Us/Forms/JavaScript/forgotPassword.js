
document.addEventListener("DOMContentLoaded", () => {
    // getting form elements
    const resetForm = document.getElementById("reset-form");
    const emailInput = document.getElementById("email");
    const resetMessage = document.getElementById("reset-message");
    const submitButton = document.getElementById("login-button");
    const subtextTop = document.getElementById("subtext-top");
    const subtextBottom = document.getElementById("subtext-bottom");
  
    // handleing the form submission
    resetForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      clearErrors();
  
      
      // validating the  email
      const email = emailInput.value.trim();
      if (!validateEmail(email)) {
        showError("email", "Please enter a valid email address");
        return;
      }
  
      // check if email exists in localStorage
      try {
        const users = JSON.parse(localStorage.getItem("conquista_users")) || [];
        const userExists = users.some((user) => user.email === email);
  
        if (!userExists) {
          showError("email", "No account found with this email address");
          return;
        }
  
        // generate password reset token
        const resetToken = generateResetToken();
        const expiresAt = new Date().getTime() + 60 * 60 * 1000; // 1 hour expiration
  
        // store token in localStorage
        const resetRequests =
          JSON.parse(localStorage.getItem("password_reset_requests")) || {};
        resetRequests[email] = {
          token: resetToken,
          expiresAt: expiresAt,
        };
        localStorage.setItem(
          "password_reset_requests",
          JSON.stringify(resetRequests)
        );
  
        // hide email input and submit button
        const inputGroup = emailInput.closest(".input-group");
        if (inputGroup) {
          inputGroup.style.display = "none";
        }
        submitButton.style.display = "none";
  
        // hide subtext elements
        if (subtextTop) subtextTop.style.display = "none";
        if (subtextBottom) subtextBottom.style.display = "none";
  
        // show success message
        resetMessage.classList.remove("hidden");
  
        console.log(
          `Password Reset Link: ${
            window.location.origin
          }/reset_password.html?email=${encodeURIComponent(
            email
          )}&token=${resetToken}`
        );
      } catch (error) {
        alert("An error occurred. Please try again.");
      }
    });
  });
  

// function to show error messages
function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  const container = field.parentElement;
  const existingError = container.querySelector(".error-message");

  // remove existing error 
  if (existingError) {
    existingError.remove();
  }

  // create and add new error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;

  // insert error after the input field
  container.appendChild(errorDiv);

  // add visual feedback to the input
  field.classList.add("invalid");
}

//function to clear specific field error
function clearError(container) {
  const existingError = container.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }
}

// function to clear all errors
function clearErrors() {
  document
    .querySelectorAll(".error-message")
    .forEach((error) => error.remove());
  document.querySelectorAll(".invalid").forEach((field) => {
    field.classList.remove("invalid");
  });
}

// function to validate email format 
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// function to generate a random password reset token
function generateResetToken() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}


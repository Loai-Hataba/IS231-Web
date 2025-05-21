document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements 
    const elements = {
        paymentDetails: document.querySelectorAll('.payment-details'),
        paymentMethods: document.querySelectorAll('.payment-method'),
        formInputs: document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]'),
        submitBtn: document.querySelector('.checkout'),
        orderSummaryContainer: document.querySelector('.book-items'),
        subtotalElement: document.querySelector('.price-sub span:last-child'),
        taxElement: document.querySelector('.price-tax span:last-child'),
        totalElement: document.querySelector('.price-total span:last-child')
    };
    
    // Initialize payment details (hide all by default)
    elements.paymentDetails.forEach(detail => {
        detail.style.display = 'none';
    });
    
    // Set up payment method selection
    elements.paymentMethods.forEach(method => {
        const radio = method.querySelector('input[type="radio"]');
        radio.addEventListener('change', function() {
            elements.paymentDetails.forEach(detail => {
                detail.style.display = 'none';
            });
            
            const paymentType = method.getAttribute('data-payment');
            if (paymentType === 'credit') {
                document.getElementById('credit-details').style.display = 'block';
            } else if (paymentType === 'fawry') {
                document.getElementById('fawry-details').style.display = 'block';
            }
            
            elements.paymentMethods.forEach(m => {
                m.classList.remove('active');
            });
            method.classList.add('active');
        });
    });

    // Set up form validation error messages
    elements.formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(input);
        });

        input.addEventListener('focus', function() {
            clearError(input);
        });
    });

    // Handle form submission
    elements.submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate general fields
        const requiredGeneralFields = ['fullname', 'email', 'phone', 'address', 'city'];
        requiredGeneralFields.forEach(id => {
            const input = document.getElementById(id);
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        // Validate payment method selection
        const paymentSelected = document.querySelector('input[name="payment"]:checked');
        if (!paymentSelected) {
            isValid = false;
            const methods = document.querySelector('.payment-methods');
            methods.classList.add('shake');
            setTimeout(() => methods.classList.remove('shake'), 500);
            
            let paymentError = document.getElementById('payment-method-error');
            if (!paymentError) {
                paymentError = document.createElement('div');
                paymentError.id = 'payment-method-error';
                paymentError.className = 'error-message';
                paymentError.style.display = 'block';
                paymentError.textContent = 'Please select a payment method';
                const methodsTitle = document.querySelector('h2.section-title:nth-of-type(2)');
                methodsTitle.insertAdjacentElement('afterend', paymentError);
            }
        } else {
            const paymentError = document.getElementById('payment-method-error');
            if (paymentError) paymentError.remove();
            
            const paymentType = paymentSelected.closest('.payment-method').getAttribute('data-payment');

            // Validate payment-specific fields
            if (paymentType === 'credit') {
                const cardFields = ['card-number', 'expiry', 'cvv'];
                cardFields.forEach(field => {
                    const input = document.getElementById(field);
                    if (!validateInput(input)) {
                        isValid = false;
                    }
                });
            } else if (paymentType === 'fawry') {
                const fawryNumber = document.getElementById('fawry-number');
                if (!validateInput(fawryNumber)) {
                    isValid = false;
                }
            }
        }
        
        // Process valid form submission
        if (isValid) {
            // Collect payment and shipping info
            const formData = {
                fullname: document.getElementById('fullname').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                payment_method: document.querySelector('input[name="payment"]:checked').id
            };
            
            // Add payment-specific info
            const paymentType = document.querySelector('input[name="payment"]:checked')
                .closest('.payment-method').getAttribute('data-payment');
                
            if (paymentType === 'credit') {
                formData.card_number = document.getElementById('card-number').value;
                formData.expiry = document.getElementById('expiry').value;
                formData.cvv = document.getElementById('cvv').value;
            } else if (paymentType === 'fawry') {
                formData.fawry_number = document.getElementById('fawry-number').value;
            }
            
            // Complete the order via AJAX
            fetch('/complete-order/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    showNotification('Order completed successfully!');
                    
                    // Redirect to order success page
                    setTimeout(() => {
                        window.location.href = data.redirect || '/orderSuccessful/';
                    }, 1000);
                } else {
                    // Show error
                    showNotification(data.error || 'Failed to complete order', 'error');
                }
            })
            .catch(error => {
                console.error('Error completing order:', error);
                showNotification('Error placing order. Please try again.', 'error');
            });
        } else {
            // Scroll to first error
            const firstError = document.querySelector('.error-message[style="display: block;"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Form validation
    function validateInput(input) {
        if (!input) return false;
        
        const errorElement = document.getElementById(input.id + '-error');
        const value = input.value.trim();
        
        switch(input.id) {
            case 'fullname':
                if (value === '') {
                    showError(input, errorElement, 'Please enter your full name');
                    return false;
                } else if (value.length < 3) {
                    showError(input, errorElement, 'Name must be at least 3 characters');
                    return false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value === '') {
                    showError(input, errorElement, 'Please enter your email address');
                    return false;
                } else if (!emailRegex.test(value)) {
                    showError(input, errorElement, 'Please enter a valid email address');
                    return false;
                }
                break;
                
            case 'phone':
                const phoneRegex = /^\d{10,15}$/;
                if (value === '') {
                    showError(input, errorElement, 'Please enter your phone number');
                    return false;
                } else if (!phoneRegex.test(value.replace(/[-\s]/g, ''))) {
                    showError(input, errorElement, 'Please enter a valid phone number');
                    return false;
                }
                break;
                
            case 'address':
                if (value === '') {
                    showError(input, errorElement, 'Please enter your address');
                    return false;
                } else if (value.length < 5) {
                    showError(input, errorElement, 'Please enter a complete address');
                    return false;
                }
                break;
                
            case 'city':
                if (value === '') {
                    showError(input, errorElement, 'Please enter your city');
                    return false;
                }
                break;
                
            case 'card-number':
                const cardRegex = /^\d{13,19}$/;
                if (value === '') {
                    showError(input, errorElement, 'Please enter your card number');
                    return false;
                } else if (!cardRegex.test(value.replace(/\s/g, ''))) {
                    showError(input, errorElement, 'Please enter a valid card number');
                    return false;
                }
                break;
                
            case 'expiry':
                const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
                if (value === '') {
                    showError(input, errorElement, 'Please enter card expiry date');
                    return false;
                } else if (!expiryRegex.test(value)) {
                    showError(input, errorElement, 'Use format MM/YY (e.g., 12/25)');
                    return false;
                }
                break;
                
            case 'cvv':
                const cvvRegex = /^\d{3,4}$/;
                if (value === '') {
                    showError(input, errorElement, 'Please enter CVV code');
                    return false;
                } else if (!cvvRegex.test(value)) {
                    showError(input, errorElement, 'CVV must be 3 or 4 digits');
                    return false;
                }
                break;
                
            case 'fawry-number':
                const fawryRegex = /^\d{6,15}$/;
                if (value === '') {
                    showError(input, errorElement, 'Please enter Fawry reference number');
                    return false;
                } else if (!fawryRegex.test(value)) {
                    showError(input, errorElement, 'Enter a valid Fawry reference number');
                    return false;
                }
                break;
        }
        
        clearError(input);
        return true;
    }

    // Show validation error
    function showError(input, errorElement, message) {
        if (!input || !errorElement) return;
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Clear validation error
    function clearError(input) {
        if (!input) return;
        input.classList.remove('error');
        const errorElement = document.getElementById(input.id + '-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    // Input formatting for credit card fields
    if (document.getElementById('card-number')) {
        document.getElementById('card-number').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 16) value = value.slice(0, 16);
            
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
    }

    if (document.getElementById('expiry')) {
        document.getElementById('expiry').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            
            if (value.length > 2) {
                e.target.value = value.slice(0, 2) + '/' + value.slice(2);
            } else {
                e.target.value = value;
            }
        });
    }

    if (document.getElementById('cvv')) {
        document.getElementById('cvv').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);
            e.target.value = value;
        });
    }

    if (document.getElementById('phone')) {
        document.getElementById('phone').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 15) value = value.slice(0, 15);
            e.target.value = value;
        });
    }
    
    // Helper function to show notifications
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Function to get CSRF token from cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
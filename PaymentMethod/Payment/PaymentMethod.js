document.addEventListener('DOMContentLoaded', function() {
    // Hide all payment details initially
    const paymentDetails = document.querySelectorAll('.payment-details');
    paymentDetails.forEach(detail => {
        detail.style.display = 'none';
    });
    
    // Load cart data for order summary
    loadOrderSummary();
    
    // Add event listeners to payment method radios
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        const radio = method.querySelector('input[type="radio"]');
        radio.addEventListener('change', function() {
            // Hide all payment details
            paymentDetails.forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Show specific payment details if applicable
            const paymentType = method.getAttribute('data-payment');
            if (paymentType === 'credit') {
                document.getElementById('credit-details').style.display = 'block';
            } else if (paymentType === 'fawry') {
                document.getElementById('fawry-details').style.display = 'block';
            }
            
            // Mark the selected payment method as active
            paymentMethods.forEach(m => {
                m.classList.remove('active');
            });
            method.classList.add('active');
        });
    });

    // Add validation styling
    const formStyles = document.createElement('style');
    formStyles.textContent = `
        .error-message {
            color: #ff3333;
            font-size: 0.85rem;
            margin-top: 4px;
            display: none;
        }
        
        input.error {
            border: 1px solid #ff3333;
            background-color: rgba(255, 51, 51, 0.03);
        }
        
        .shake {
            animation: shake 0.5s;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(formStyles);

    // Add error message elements under each input
    const formInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    formInputs.forEach(input => {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.id = input.id + '-error';
        input.parentNode.appendChild(errorMsg);

        // Add input validation on blur
        input.addEventListener('blur', function() {
            validateInput(input);
        });

        // Clear error on input focus
        input.addEventListener('focus', function() {
            clearError(input);
        });
    });

    // Submit form handler
    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate general billing inputs only (excluding credit/fawry-specific)
        const requiredGeneralFields = ['fullname', 'email', 'phone', 'address', 'city'];
        requiredGeneralFields.forEach(id => {
            const input = document.getElementById(id);
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        
        // Check if a payment method is selected
        const paymentSelected = document.querySelector('input[name="payment"]:checked');
        if (!paymentSelected) {
            isValid = false;
            const methods = document.querySelector('.payment-methods');
            methods.classList.add('shake');
            setTimeout(() => methods.classList.remove('shake'), 500);
            
            // Add a temporary error message above payment methods
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
            // Remove error if exists
            const paymentError = document.getElementById('payment-method-error');
            if (paymentError) paymentError.remove();
            
            // Validate payment specific fields ONLY based on selected type
            const paymentType = paymentSelected.closest('.payment-method').getAttribute('data-payment');

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
        
        // If form is valid, clear cart and redirect to success page
        if (isValid) {
            // Clear cart as order is complete
            localStorage.setItem('cart', '[]');
            window.location.href = '../Order/OrderSuccessful.html';
        } else {
            // Scroll to the first error
            const firstError = document.querySelector('.error-message[style="display: block;"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Function to load order summary from cart
    function loadOrderSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderSummaryContainer = document.querySelector('.order-summary');

        if (!orderSummaryContainer) return;

        // Clear existing book items
        const existingBookItems = orderSummaryContainer.querySelectorAll('.book-item');
        existingBookItems.forEach(item => item.remove());

        if (cart.length === 0) {
            // Handle empty cart in checkout
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-cart-message';
            emptyMessage.textContent = 'Your cart is empty!';
            orderSummaryContainer.appendChild(emptyMessage);
            return;
        }

        // Add each book item
        cart.forEach(item => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `
                <div class="book-cover">
                    <img src="${item.imagePath}" alt="${item.title}">
                </div>
                <div class="book-info">
                    <h3>${item.title}</h3>
                    <p class="author">by ${item.author}</p>
                    <p class="quantity">Quantity: ${item.quantity}</p>
                </div>
                <div class="book-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            orderSummaryContainer.appendChild(bookItem);
        });
    }
    
    function updateOrderSummaryTotals(subtotal, tax, total) {
        const subtotalElement = document.querySelector('.price-row:nth-child(1) span:last-child');
        const taxElement = document.querySelector('.price-row:nth-child(2) span:last-child');
        const totalElement = document.querySelector('.price-total span:last-child');
        
        if (subtotalElement) subtotalElement.textContent = '$' + subtotal.toFixed(2);
        if (taxElement) taxElement.textContent = '$' + tax.toFixed(2);
        if (totalElement) totalElement.textContent = '$' + total.toFixed(2);
    }

    // Input validation function
    function validateInput(input) {
        const errorElement = document.getElementById(input.id + '-error');
        const value = input.value.trim();
        
        // Input specific validations
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
        
        // Clear error if validation passes
        clearError(input);
        return true;
    }

    // Show error message
    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // Clear error styling and message
    function clearError(input) {
        input.classList.remove('error');
        const errorElement = document.getElementById(input.id + '-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    // Format input fields appropriately
    document.getElementById('card-number').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        
        // Format with spaces every 4 digits
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
    });

    document.getElementById('expiry').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        
        // Format as MM/YY
        if (value.length > 2) {
            e.target.value = value.slice(0, 2) + '/' + value.slice(2);
        } else {
            e.target.value = value;
        }
    });

    document.getElementById('cvv').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        e.target.value = value;
    });

    document.getElementById('phone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 15) value = value.slice(0, 15);
        e.target.value = value;
    });
});
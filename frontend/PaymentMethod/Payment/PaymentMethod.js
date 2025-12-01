document.addEventListener('DOMContentLoaded', function() {
    // cache DOM elements 
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
    
    // initialize payment details (hide all by default)
    elements.paymentDetails.forEach(detail => {
        detail.style.display = 'none';
    });
    
    loadOrderSummary();

    // set up payment method selection
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

    // set up form validation error messages
    elements.formInputs.forEach(input => {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.id = input.id + '-error';
        input.parentNode.appendChild(errorMsg);

        input.addEventListener('blur', function() {
            validateInput(input);
        });

        input.addEventListener('focus', function() {
            clearError(input);
        });
    });

    // handle form submission
    elements.submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // validate general fields
        const requiredGeneralFields = ['fullname', 'email', 'phone', 'address', 'city'];
        requiredGeneralFields.forEach(id => {
            const input = document.getElementById(id);
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        // validate payment method selection
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

            // validate payment-specific fields
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
        
        // process valid form submission
        if (isValid) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            localStorage.setItem('lastOrder', JSON.stringify(cart));
            localStorage.setItem('cart', '[]');
            window.location.href = '../Order/OrderSuccessful.html';
        } else {
            // scroll to first error
            const firstError = document.querySelector('.error-message[style="display: block;"]');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // load order summary from cart
    function loadOrderSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (!elements.orderSummaryContainer) return;
        elements.orderSummaryContainer.innerHTML = '';

        cart.forEach(item => {
            const adjustedImagePath = `${item.imagePath}`;
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `
                <div class="book-cover">
                    <img src="${adjustedImagePath}" alt="${item.title}" onerror="this.src='../assets/placeholder.jpg'">
                </div>
                <div class="book-info">
                    <h3>${item.title}</h3>
                    <p class="author">by ${item.author}</p>
                    <p class="quantity">Quantity: ${item.quantity}</p>
                </div>
                <div class="book-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            elements.orderSummaryContainer.appendChild(bookItem);
        });

        // calculate and update totals
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        updateOrderSummaryTotals(subtotal, tax, total);
    }
    
    // update order summary totals
    function updateOrderSummaryTotals(subtotal, tax, total) {
        if (elements.subtotalElement) elements.subtotalElement.textContent = '$' + subtotal.toFixed(2);
        if (elements.taxElement) elements.taxElement.textContent = '$' + tax.toFixed(2);
        if (elements.totalElement) elements.totalElement.textContent = '$' + total.toFixed(2);
    }

    // form validation
    function validateInput(input) {
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

    // show validation error
    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    // clear validation error
    function clearError(input) {
        input.classList.remove('error');
        const errorElement = document.getElementById(input.id + '-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    // input formatting for credit card fields
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

    document.getElementById('expiry').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        
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
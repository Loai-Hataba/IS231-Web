document.addEventListener('DOMContentLoaded', function() {
    // cache DOM elements 
    const elements = {
        checkoutBtn: document.querySelector('.checkout-btn'),
        cartItems: document.querySelector('.cart-items'),
        cartSummary: document.querySelector('.cart-summary'),
        emptyCartNotice: document.querySelector('.empty-cart-notice'),
        priceSummary: document.querySelector('.price-summary'),
        subtotalElement: document.querySelector('.price-row:nth-child(1) span:last-child'),
        taxElement: document.querySelector('.price-row:nth-child(2) span:last-child'),
        totalElement: document.querySelector('.price-total span:last-child')
    };

    loadCart();

    // add event listener to the checkout button
    elements.checkoutBtn.addEventListener('click', function() {
        const cart = getCartItems();
        const existingErrorContainer = document.querySelector('.cart-error-container');

        // remove any existing error message
        if (existingErrorContainer) {
            existingErrorContainer.remove();
        }

        if (cart.length === 0) {
            // create a container for the error message and arrow
            const errorContainer = document.createElement('div');
            errorContainer.className = 'cart-error-container';

            // create the error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'cart-error-msg';
            errorMsg.textContent = 'Your cart is empty. Please add items to proceed to checkout.';

            // create the arrow
            const arrow = document.createElement('div');
            arrow.className = 'arrow-down';
            arrow.innerHTML = '↓'; 

            // append the arrow and message to the container
            errorContainer.appendChild(errorMsg);
            errorContainer.appendChild(arrow);

            // insert the error container between the buttons
            elements.cartSummary.insertBefore(errorContainer, elements.checkoutBtn.nextSibling);
        } else {
            // redirect to PaymentMethod.html if the cart is not empty
            window.location.href = '../Payment/PaymentMethod.html';
        }
    });

    elements.cartItems.addEventListener('click', function(e) {
        const target = e.target;
        
        if (target.classList.contains('minus')) {
            const input = target.nextElementSibling;
            const value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateCartItemQuantity(target.closest('.cart-item'), value - 1);
            }
        }
        
        else if (target.classList.contains('plus')) {
            const input = target.previousElementSibling;
            const currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            updateCartItemQuantity(target.closest('.cart-item'), currentValue + 1);
        }
        
        else if (target.classList.contains('remove-btn')) {
            const cartItem = target.closest('.cart-item');
            const bookTitle = cartItem.querySelector('.book-info h3').textContent;
            removeFromCart(bookTitle);
            cartItem.remove();
            updateTotals();
            checkEmptyCart(); // check if cart is now empty after removal
        }
    });

    function loadCart() {
        const cart = getCartItems();
        
        if (cart.length === 0) {
            // display empty cart message and handle UI visibility
            elements.cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            toggleEmptyCartUI(true);
            return;
        }
        
        elements.cartItems.innerHTML = '';
        toggleEmptyCartUI(false);
        
        cart.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            elements.cartItems.appendChild(cartItemElement);
        });
        
        updateTotals();
    }
    
    function createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        const adjustedImagePath = `${item.imagePath}`;
        cartItem.innerHTML = `
            <div class="book-cover">
                <img src="${adjustedImagePath}" alt="${item.title}" onerror="this.src='../assets/placeholder.jpg'">
            </div>
            <div class="book-info">
                <h3>${item.title}</h3>
                <p class="author">by ${item.author}</p>
                <p class="rental-period">Rental Period: ${item.rentalPeriod}</p>
            </div>
            <div class="quantity-control">
                <button class="quantity-btn minus">-</button>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                <button class="quantity-btn plus">+</button>
            </div>
            <div class="book-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <button class="remove-btn">✕</button>
        `;
        return cartItem;
    }

    function updateTotals() {
        const cart = getCartItems();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;
        
        if (elements.subtotalElement) elements.subtotalElement.textContent = '$' + subtotal.toFixed(2);
        if (elements.taxElement) elements.taxElement.textContent = '$' + tax.toFixed(2);
        if (elements.totalElement) elements.totalElement.textContent = '$' + total.toFixed(2);
    }

    function updateCartItemQuantity(cartItemElement, newQuantity) {
        const bookTitle = cartItemElement.querySelector('.book-info h3').textContent;
        const cart = getCartItems();
        
        const updatedCart = cart.map(item => {
            if (item.title === bookTitle) {
                return {...item, quantity: newQuantity};
            }
            return item;
        });
        
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // update the price display for this item
        const priceElement = cartItemElement.querySelector('.book-price');
        const itemData = updatedCart.find(item => item.title === bookTitle);
        if (priceElement && itemData) {
            priceElement.textContent = '$' + (itemData.price * itemData.quantity).toFixed(2);
        }
        
        updateTotals();
    }

    function removeFromCart(bookTitle) {
        const cart = getCartItems();
        const updatedCart = cart.filter(item => item.title !== bookTitle);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    function getCartItems() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }
    
    function toggleEmptyCartUI(isEmpty) {
        if (isEmpty) {
            elements.priceSummary.style.opacity = '0.5';
            elements.checkoutBtn.disabled = true;
        } else {
            elements.priceSummary.style.opacity = '1';
            elements.checkoutBtn.disabled = false;
        }
    }
    
    function checkEmptyCart() {
        const cart = getCartItems();
        if (cart.length === 0) {
            elements.cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            toggleEmptyCartUI(true);
        }
    }
});
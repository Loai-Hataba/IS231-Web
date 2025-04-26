document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    const continueBtn = document.querySelector('.continue-btn');
    const cartItemsContainer = document.querySelector('.cart-items');

    // Load and display cart items
    loadCart();

    // Event delegation for quantity buttons and remove buttons
    cartItemsContainer.addEventListener('click', function(e) {
        const target = e.target;
        
        // Handle minus button
        if (target.classList.contains('minus')) {
            const input = target.nextElementSibling;
            const value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateCartItemQuantity(target.closest('.cart-item'), value - 1);
            }
        }
        
        // Handle plus button
        else if (target.classList.contains('plus')) {
            const input = target.previousElementSibling;
            const currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            updateCartItemQuantity(target.closest('.cart-item'), currentValue + 1);
        }
        
        // Handle remove button
        else if (target.classList.contains('remove-btn')) {
            const cartItem = target.closest('.cart-item');
            const bookTitle = cartItem.querySelector('.book-info h3').textContent;
            removeFromCart(bookTitle);
            cartItem.remove();
            updateTotals();
        }
    });

    // Handle input change for quantity
    cartItemsContainer.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const input = e.target;
            // Ensure minimum value is 1
            if (parseInt(input.value) < 1) input.value = 1;
            
            updateCartItemQuantity(input.closest('.cart-item'), parseInt(input.value));
        }
    });

    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const cart = getCartItems();

        if (cart.length === 0) {
            // Show error if cart is empty
            if (!document.getElementById('cart-error')) {
                const error = document.createElement('div');
                error.id = 'cart-error';
                error.className = 'cart-error-msg';
                error.innerHTML = `
                    <p>Your cart is empty. Please <strong>Continue Shopping</strong> to add items.</p>
                    <div class="arrow-down">⬇</div>
                `;
                checkoutBtn.insertAdjacentElement('afterend', error);
            }
            return;
        }

        // Proceed to checkout
        window.location.href = '../Payment/PaymentMethod.html';
    });

    function loadCart() {
        const cart = getCartItems();
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            return;
        }
        
        // Clear existing items
        cartItemsContainer.innerHTML = '';
        
        // Add each item from localStorage
        cart.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        updateTotals();
    }
    
    function createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="book-cover">
                <img src="${item.imagePath}" alt="${item.title}">
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
        let subtotal = 0;
        
        // Calculate subtotal from cart data
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        // Update display
        const subtotalElement = document.querySelector('.price-row:nth-child(1) span:last-child');
        const taxElement = document.querySelector('.price-row:nth-child(2) span:last-child');
        const totalElement = document.querySelector('.price-total span:last-child');
        
        if (subtotalElement) subtotalElement.textContent = '$' + subtotal.toFixed(2);
        if (taxElement) taxElement.textContent = '$' + tax.toFixed(2);
        if (totalElement) totalElement.textContent = '$' + total.toFixed(2);

        // Remove error if cart has items
        if (subtotal > 0) {
            const existingError = document.getElementById('cart-error');
            if (existingError) existingError.remove();
            
            // Remove empty cart message if exists
            const emptyMessage = document.querySelector('.empty-cart-message');
            if (emptyMessage) emptyMessage.remove();
        }
    }

    function updateCartItemQuantity(cartItemElement, newQuantity) {
        const bookTitle = cartItemElement.querySelector('.book-info h3').textContent;
        const cart = getCartItems();
        
        // Find and update the item in cart
        const updatedCart = cart.map(item => {
            if (item.title === bookTitle) {
                return {...item, quantity: newQuantity};
            }
            return item;
        });
        
        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        updateTotals();
    }

    function removeFromCart(bookTitle) {
        const cart = getCartItems();
        const updatedCart = cart.filter(item => item.title !== bookTitle);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Show empty cart message if cart is now empty
        if (updatedCart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        }
    }

    // Helper function to get cart items from localStorage
    function getCartItems() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }
});
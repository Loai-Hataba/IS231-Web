document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');

    loadCart();

    // Add event listener to the checkout button
    checkoutBtn.addEventListener('click', function() {
        const cart = getCartItems();
        const existingErrorMsg = document.querySelector('.cart-error-msg');

        // Remove any existing error message
        if (existingErrorMsg) {
            existingErrorMsg.remove();
        }

        if (cart.length === 0) {
            // Display error message if the cart is empty
            const errorMsg = document.createElement('div');
            errorMsg.className = 'cart-error-msg';
            errorMsg.textContent = 'Your cart is empty. Please add items to proceed to checkout.';
            cartSummaryContainer.appendChild(errorMsg);
        } else {
            // Redirect to PaymentMethod.html if the cart is not empty
            window.location.href = '../Payment/PaymentMethod.html';
        }
    });

    cartItemsContainer.addEventListener('click', function(e) {
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
        }
    });

    function loadCart() {
        const cart = getCartItems();
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const cartItemElement = createCartItemElement(item);
            cartItemsContainer.appendChild(cartItemElement);
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
        let subtotal = 0;
        
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        const subtotalElement = document.querySelector('.price-row:nth-child(1) span:last-child');
        const taxElement = document.querySelector('.price-row:nth-child(2) span:last-child');
        const totalElement = document.querySelector('.price-total span:last-child');
        
        if (subtotalElement) subtotalElement.textContent = '$' + subtotal.toFixed(2);
        if (taxElement) taxElement.textContent = '$' + tax.toFixed(2);
        if (totalElement) totalElement.textContent = '$' + total.toFixed(2);
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
        updateTotals();
    }

    function removeFromCart(bookTitle) {
        const cart = getCartItems();
        const updatedCart = cart.filter(item => item.title !== bookTitle);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        if (updatedCart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        }
    }

    function getCartItems() {
        return JSON.parse(localStorage.getItem('cart') || '[]');
    }
});
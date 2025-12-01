document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements 
    const elements = {
        checkoutBtn: document.querySelector('.checkout-btn'),
        cartItems: document.querySelector('.cart-items'),
        cartSummary: document.querySelector('.cart-summary'),
        priceSummary: document.querySelector('.price-summary'),
        subtotalElement: document.querySelector('.price-row:nth-child(1) span:last-child'),
        taxElement: document.querySelector('.price-row:nth-child(2) span:last-child'),
        totalElement: document.querySelector('.price-total span:last-child')
    };

    // Set up event listeners for cart items
    if (elements.cartItems) {
        elements.cartItems.addEventListener('click', function(e) {
            const target = e.target;
            
            if (target.classList.contains('minus') || target.classList.contains('plus')) {
                const cartItem = target.closest('.cart-item');
                const cartItemId = cartItem.dataset.id;
                const input = cartItem.querySelector('.quantity-input');
                let value = parseInt(input.value);
                
                if (target.classList.contains('minus') && value > 1) {
                    value--;
                } else if (target.classList.contains('plus')) {
                    value++;
                }
                
                // Update quantity via AJAX
                updateItemQuantity(cartItemId, value, cartItem);
            }
            
            else if (target.classList.contains('remove-btn')) {
                const cartItem = target.closest('.cart-item');
                const cartItemId = cartItem.dataset.id;
                
                // Remove item via AJAX
                removeCartItem(cartItemId, cartItem);
            }
        });
    }

    // Add event listener to the checkout button
    if (elements.checkoutBtn) {
        elements.checkoutBtn.addEventListener('click', function() {
            window.location.href = "/paymentMethod/";
        });
    }

    // Function to update item quantity
    function updateItemQuantity(cartItemId, quantity, cartItemElement) {
        fetch('/cart/update/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                cart_item_id: cartItemId,
                quantity: quantity
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update the quantity input
                const input = cartItemElement.querySelector('.quantity-input');
                if (input) input.value = quantity;
                
                // Update price display
                const priceElement = cartItemElement.querySelector('.book-price');
                if (priceElement && data.item_price) {
                    priceElement.textContent = '$' + (data.item_price * quantity).toFixed(2);
                }
                
                // Update totals
                updateTotals(data.subtotal, data.tax, data.total);
                
                // If item was removed (quantity set to 0)
                if (data.message === 'Item removed from cart') {
                    cartItemElement.remove();
                    checkEmptyCart();
                }
            } else {
                showNotification(data.error || 'Failed to update cart', 'error');
            }
        })
        .catch(error => {
            console.error('Error updating cart:', error);
            showNotification('Error updating cart. Please try again.', 'error');
        });
    }

    // Function to remove an item from cart
    function removeCartItem(cartItemId, cartItemElement) {
        fetch('/cart/remove/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                cart_item_id: cartItemId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove the item element from DOM
                cartItemElement.remove();
                
                // Update the totals
                updateTotals(data.subtotal, data.tax, data.total);
                
                // Check if cart is now empty
                checkEmptyCart();
                
                showNotification('Item removed from cart');
            } else {
                showNotification(data.error || 'Failed to remove item', 'error');
            }
        })
        .catch(error => {
            console.error('Error removing item:', error);
            showNotification('Error removing item. Please try again.', 'error');
        });
    }

    // Function to update totals
    function updateTotals(subtotal, tax, total) {
        if (elements.subtotalElement) elements.subtotalElement.textContent = '$' + subtotal.toFixed(2);
        if (elements.taxElement) elements.taxElement.textContent = '$' + tax.toFixed(2);
        if (elements.totalElement) elements.totalElement.textContent = '$' + total.toFixed(2);
    }
    
    // Check if cart is empty and update UI accordingly
    function checkEmptyCart() {
        if (!document.querySelector('.cart-item')) {
            elements.cartItems.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            
            if (elements.priceSummary) elements.priceSummary.style.opacity = '0.5';
            if (elements.checkoutBtn) elements.checkoutBtn.disabled = true;
        }
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
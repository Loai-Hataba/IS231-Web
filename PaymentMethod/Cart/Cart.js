document.addEventListener('DOMContentLoaded', function() {
    const minusBtns = document.querySelectorAll('.minus');
    const plusBtns = document.querySelectorAll('.plus');
    const removeBtns = document.querySelectorAll('.remove-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const continueBtn = document.querySelector('.continue-btn');

    const cartItemsContainer = document.querySelector('.cart-items');

    // Update total initially
    updateTotals();

    minusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.nextElementSibling;
            const value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateTotals();
            }
        });
    });

    plusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
            updateTotals();
        });
    });

    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.cart-item').remove();
            updateTotals();
        });
    });

    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();

        const remainingItems = document.querySelectorAll('.cart-item');
        const existingError = document.getElementById('cart-error');

        if (remainingItems.length === 0) {
            if (!existingError) {
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

        // No error, so go to checkout
        window.location.href = '../Payment/PaymentMethod.html';
    });

    function updateTotals() {
        let subtotal = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseFloat(item.querySelector('.book-price').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            subtotal += price * quantity;
        });

        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        document.querySelector('.price-row:nth-child(1) span:last-child').textContent = '$' + subtotal.toFixed(2);
        document.querySelector('.price-row:nth-child(2) span:last-child').textContent = '$' + tax.toFixed(2);
        document.querySelector('.price-total span:last-child').textContent = '$' + total.toFixed(2);

        // Remove error if cart has items
        if (subtotal > 0) {
            const existingError = document.getElementById('cart-error');
            if (existingError) existingError.remove();
        }
    }
});

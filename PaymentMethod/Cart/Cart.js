// Simple cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Quantity controls
    const minusBtns = document.querySelectorAll('.minus');
    const plusBtns = document.querySelectorAll('.plus');
    const removeBtns = document.querySelectorAll('.remove-btn');
    
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
    
    function updateTotals() {
        let subtotal = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseFloat(item.querySelector('.book-price').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            subtotal += price * quantity;
        });
        
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + tax;
        
        document.querySelector('.price-row:nth-child(1) span:last-child').textContent = '$' + subtotal.toFixed(2);
        document.querySelector('.price-row:nth-child(2) span:last-child').textContent = '$' + tax.toFixed(2);
        document.querySelector('.price-total span:last-child').textContent = '$' + total.toFixed(2);
    }
});
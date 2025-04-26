document.addEventListener('DOMContentLoaded', function () {
    loadOrderSummary();

    function loadOrderSummary() {
        const lastOrder = JSON.parse(localStorage.getItem('lastOrder')) || [];
        const orderItemsContainer = document.querySelector('.order-items');

        if (!orderItemsContainer) return;

        orderItemsContainer.innerHTML = ''; 

        if (lastOrder.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-cart-message';
            emptyMessage.textContent = 'No items found in your order.';
            orderItemsContainer.appendChild(emptyMessage);
            return;
        }

        lastOrder.forEach(item => {
            const adjustedImagePath = `${item.imagePath}`; 
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="book-cover">
                    <img src="${adjustedImagePath}" alt="${item.title}" onerror="this.src='../assets/placeholder.jpg'">
                </div>
                <div class="item-details">
                    <div class="item-title">${item.title}</div>
                    <div class="item-author">by ${item.author}</div>
                    <div>Rental Period: ${item.rentalPeriod}</div>
                </div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            orderItemsContainer.appendChild(orderItem);
        });

        // Update totals
        const subtotal = lastOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        updateOrderSummaryTotals(subtotal, tax, total);
    }

    function updateOrderSummaryTotals(subtotal, tax, total) {
        const subtotalElement = document.querySelector('.summary-row:nth-child(1) span:last-child');
        const taxElement = document.querySelector('.summary-row:nth-child(2) span:last-child');
        const totalElement = document.querySelector('.summary-row.total-row span:last-child');

        if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }
});
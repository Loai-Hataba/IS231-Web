document.addEventListener('DOMContentLoaded', function () {
    // Cache DOM elements for better performance
    const elements = {
        orderItemsContainer: document.querySelector('.order-items'),
        subtotalElement: document.querySelector('.order-sub span:last-child'),
        taxElement: document.querySelector('.order-tax span:last-child'),
        totalElement: document.querySelector('.order-total span:last-child')
    };

    loadOrderSummary();

    function loadOrderSummary() {
        const lastOrder = JSON.parse(localStorage.getItem('lastOrder')) || [];

        if (!elements.orderItemsContainer) return;

        elements.orderItemsContainer.innerHTML = ''; 

        if (lastOrder.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-cart-message';
            emptyMessage.textContent = 'No items found in your order.';
            elements.orderItemsContainer.appendChild(emptyMessage);
            return;
        }

        lastOrder.forEach(item => {
            const adjustedImagePath = `../../${item.imagePath}`; 
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
            elements.orderItemsContainer.appendChild(orderItem);
        });

        // Update totals
        const subtotal = lastOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        updateOrderSummaryTotals(subtotal, tax, total);
    }

    function updateOrderSummaryTotals(subtotal, tax, total) {
        if (elements.subtotalElement) elements.subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (elements.taxElement) elements.taxElement.textContent = `$${tax.toFixed(2)}`;
        if (elements.totalElement) elements.totalElement.textContent = `$${total.toFixed(2)}`;
    }
});
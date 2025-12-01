document.addEventListener('DOMContentLoaded', function () {
    // Add any interactive behaviors for the order success page here
    
    // For example, handling the "Continue Shopping" button
    const continueShoppingBtn = document.querySelector('.btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            // This is now handled by Django URL template tag
        });
    }
});
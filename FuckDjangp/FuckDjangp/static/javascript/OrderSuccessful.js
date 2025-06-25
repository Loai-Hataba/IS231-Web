document.addEventListener('DOMContentLoaded', function () {    
    const continueShoppingBtn = document.querySelector('.btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            // This is now handled by Django URL template tag
        });
    }
});
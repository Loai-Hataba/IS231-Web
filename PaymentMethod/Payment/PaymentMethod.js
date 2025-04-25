    
    document.addEventListener('DOMContentLoaded', function() {
        // Hide all payment details initially
        const paymentDetails = document.querySelectorAll('.payment-details');
        paymentDetails.forEach(detail => {
            detail.style.display = 'none';
        });
        
        // Add event listeners to payment method radios
        const paymentMethods = document.querySelectorAll('.payment-method');
        paymentMethods.forEach(method => {
            const radio = method.querySelector('input[type="radio"]');
            radio.addEventListener('change', function() {
                // Hide all payment details
                paymentDetails.forEach(detail => {
                    detail.style.display = 'none';
                });
                
                // Show specific payment details if applicable
                const paymentType = method.getAttribute('data-payment');
                if (paymentType === 'credit') {
                    document.getElementById('credit-details').style.display = 'block';
                } else if (paymentType === 'fawry') {
                    document.getElementById('fawry-details').style.display = 'block';
                }
                
                // Mark the selected payment method as active
                paymentMethods.forEach(m => {
                    m.classList.remove('active');
                });
                method.classList.add('active');
            });
        });
    });
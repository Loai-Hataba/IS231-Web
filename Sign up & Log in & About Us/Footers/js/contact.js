document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const formFields = form.querySelector('.form-fields');
    const successMessage = document.getElementById('success-message');
    const sendAnotherBtn = document.getElementById('send-another');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        // Store message in localStorage (for demonstration)
        const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
        messages.push({
            ...formData,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('contact_messages', JSON.stringify(messages));

        // Show success message
        formFields.style.display = 'none';
        successMessage.classList.remove('hidden');
    });

    sendAnotherBtn.addEventListener('click', () => {
        // Reset form
        form.reset();
        
        // Hide success, show form
        successMessage.classList.add('hidden');
        formFields.style.display = 'block';
    });
});
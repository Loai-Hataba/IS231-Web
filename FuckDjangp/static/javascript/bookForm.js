document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('book-form');
    const bookId = form.dataset.bookId;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();
        
        try {
            const formData = {
                title: document.getElementById('title').value,
                author: document.getElementById('author').value,
                isbn: document.getElementById('isbn').value,
                pages: parseInt(document.getElementById('pages').value),
                language: document.getElementById('language').value,
                cover_image: document.getElementById('cover_image').value,
                publisher: document.getElementById('publisher').value,
                published_date: document.getElementById('published_date').value,
                description: document.getElementById('description').value,
                rating: parseFloat(document.getElementById('rating').value) || 0,
                tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
                in_stock: document.getElementById('in_stock').value === 'true',
                quote: document.getElementById('quote').value
            };

            const url = bookId ? `/book/edit/${bookId}/` : '/book/add/';
            const method = 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save book');
            }

            alert(bookId ? 'Book updated successfully!' : 'Book added successfully!');
            window.location.href = '/adminPanel/';

        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to save book');
        }
    });
});

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    field.classList.add('invalid');
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(error => error.remove());
    document.querySelectorAll('.invalid').forEach(field => field.classList.remove('invalid'));
}
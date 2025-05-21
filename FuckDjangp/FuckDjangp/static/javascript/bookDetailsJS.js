document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const bookContainer = document.getElementById('book-container');
    const reviewsContainer = document.getElementById('reviews');
    const quotesContainer = document.getElementById('quotes');

    // Loading book from database
    const selectedBook = window.selectedBook;
    console.log('Selected book from server:', selectedBook, "price: ", selectedBook.price);
    
    if (selectedBook) {
        console.log(`Loading book "${selectedBook.title}" with published date: ${selectedBook.publishDate}`);
        // Use the image path from the book data or fallback to default
        let imageUrl = selectedBook.imagePath;
        imageUrl = '/static/images/bookList/' + imageUrl;
        console.log()
        
        bookContainer.innerHTML = `
            <div class="book-cover">
                <img src="${imageUrl}" alt="${selectedBook.title}">
            </div>
            <div class="book-info">
                <h1 class="book-title">${selectedBook.title}</h1>
                <p class="book-author">by ${selectedBook.author}</p>
                <div class="rating">
                    <div class="stars">${generateStars(selectedBook.rating)}</div>
                </div>
                <div class="book-meta">
                    <div class="meta-item">
                        <span class="meta-label">Publisher</span>
                        <span class="meta-value">${selectedBook.publisher || ''}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Published</span>
                        <span class="meta-value">${selectedBook.publishDate}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Pages</span>
                        <span class="meta-value">${selectedBook.pages}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Language</span>
                        <span class="meta-value">${selectedBook.language}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">ISBN</span>
                        <span class="meta-value">${selectedBook.isbn}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Genre</span>
                        <span class="meta-value">${selectedBook.genre}</span>
                    </div>
                </div>
                ${
                    selectedBook.inStock
                    ? `
        <div class="price-container">
            <span class="book-price">$${selectedBook.price || '4.99'}</span>
        </div>
        <button class="btn add-to-cart-btn">Add to shopping cart</button>
    `
    : `<p class="unavailable-message">This book is currently unavailable.</p>`
}
                
                <div class="description">
                    <h2 class="section-title">Description</h2>
                    <p>${selectedBook.description}</p>
                </div>
            </div>
        `;        // Reviews are now static in the HTML
        // Removing dynamic review population

        // Populate quotes dynamically
        quotesContainer.innerHTML = `
            <h2 class="section-title">Notable Quotes</h2>
            ${selectedBook.quotes.map(quote => `
                <div class="quote">
                    <blockquote>"${quote}"</blockquote>
                </div>
            `).join('')}
        `;


        // Add to cart functionality
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                addToCart(selectedBook);
                window.location.href = '{% url "cart" %}';
            });
        }

        // Similar books section
        const bookGrid = document.querySelector('.similar-books .book-grid');
        if (bookGrid) {
            bookGrid.innerHTML = ''; // Clear existing books

            // Use the tags from the current book to find similar books
            if (selectedBook.tags && selectedBook.tags.length > 0) {
                fetch(`/books/?tags=${selectedBook.tags.join(',')}`)
                    .then(response => response.json())
                    .then(books => {
                        // Filter out the current book and limit to 5 similar books
                        const similarBooks = books
                            .filter(book => book.id !== selectedBook.id)
                            .slice(0, 5);

                        similarBooks.forEach(book => {
                            const bookCard = document.createElement('div');
                            bookCard.className = 'book-card';
                            bookCard.innerHTML = `
                                <img src="${book.cover_image || '/static/images/bookList/booklist_image_1.jpg'}" alt="${book.title}">
                                <h3 class="book-card-title">${book.title}</h3>
                                <p class="book-card-author">${book.author}</p>
                            `;

                            bookCard.addEventListener('click', () => {
                                window.location.href = `/bookDetail/${book.id}/`;
                            });

                            bookGrid.appendChild(bookCard);
                        });
                    })
                    .catch(error => {
                        console.error('Error loading similar books:', error);
                        bookGrid.innerHTML = '<p>Unable to load similar books at this time.</p>';
                    });
            }
        }
    } else {
        // If no book is selected, show an error message
        bookContainer.innerHTML = '<p>No book selected. Please go back and select a book.</p>';
    }

    // Function to generate star ratings
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return '★'.repeat(fullStars) + (halfStar ? '⯨' : '') + '☆'.repeat(emptyStars);
    }

    // Updated addToCart function
    function addToCart(book) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = cart.findIndex(item => item.id === book.id);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                id: book.id,
                title: book.title,
                author: book.author,
                price: book.price || 4.99,
                quantity: 1,
                imagePath: book.cover_image,
                rentalPeriod: '30 days'
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Tab switching functionality
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            tabContents[index].classList.add('active');
        });
    });
});


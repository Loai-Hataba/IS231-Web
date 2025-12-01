document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const bookContainer = document.getElementById('book-container');
    const reviewsContainer = document.getElementById('reviews');
    const quotesContainer = document.getElementById('quotes');
    const detailsContainer = document.getElementById('details');

    // Retrieving the selected book data from localStorage
    const selectedBook = JSON.parse(localStorage.getItem('selectedBook'));


    if (selectedBook) {
        console.log(`the book "${selectedBook.title}" has inStock set to : ${selectedBook.inStock}`);


        const adjustedImagePath = `../BookList/${selectedBook.imagePath}`;

        // Populate the book details dynamically
        bookContainer.innerHTML = `
            <div class="book-cover">
                <img src="${adjustedImagePath}" alt="${selectedBook.title}">
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
                        <span class="meta-value">${selectedBook.publisher}</span>
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
                        <span class="meta-value">${selectedBook.tags.join(', ')}</span>
                    </div>
                </div>
                ${
                    selectedBook.inStock
                    ? `<button class="btn add-to-cart-btn">Add to shopping cart</button>`
                    : `<p class="unavailable-message">This book is currently unavailable.</p>`
                }
                
                <div class="description">
                    <h2 class="section-title">Description</h2>
                    <p>${selectedBook.description}</p>
                </div>
            </div>
        `;

        // Populate reviews dynamically
        reviewsContainer.innerHTML = selectedBook.reviews.map(review => `
            <div class="review">
                <div class="review-header">
                    <div class="reviewer">
                        <h4>${review.reviewer}</h4>
                        <div class="stars">${generateStars(review.rating)}</div>
                    </div>
                    <div class="review-date">${review.date}</div>
                </div>
                <p>${review.text}</p>
            </div>
        `).join('');

        // Populate quotes dynamically
        quotesContainer.innerHTML = `
            <h2 class="section-title">Notable Quotes</h2>
            ${selectedBook.quotes.map(quote => `
                <div class="quote">
                    <blockquote>"${quote}"</blockquote>
                </div>
            `).join('')}
        `;

        // Populate details dynamically
        detailsContainer.innerHTML = `
            <h2 class="section-title">Book Details</h2>
            <div class="details-grid">
                ${selectedBook.details.map(detail => `
                    <div class="details-card">
                        <h3>${detail.title}</h3>
                        <p>${detail.text}</p>
                    </div>
                `).join('')}
            </div>
        `;


        // Add to cart functionality
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn){
            addToCartBtn.addEventListener('click', function() {
                addToCart(selectedBook);
                // Redirect to cart page
                window.location.href = '../PaymentMethod/Cart/Cart.html';
            });
        } else {
            console.log("hidden add cart button 👍");
        }
    } else {
        // If no book is selected, show an error message
        bookContainer.innerHTML = '<p>No book selected. Please go back and select a book.</p>';
    }


    // Load all books from localStorage
    const books = JSON.parse(localStorage.getItem('books')) || [];

    
    if (selectedBook && books.length > 0) {
    // Find similar books (sharing at least one tag, and not the selected book itself)
    const similarBooks = books.filter(book => {
        if (book.ID === selectedBook.ID) return false; // Skip the selected book
        return book.tags.some(tag => selectedBook.tags.includes(tag));
    }).slice(0, 5);

    // Target the container where similar books should go
    const bookGrid = document.querySelector('.similar-books .book-grid');
    bookGrid.innerHTML = ''; // Clear existing static books if any


    // Populate similar books
    similarBooks.forEach(book => {

        const adjustedImagePath = `../BookList/${book.imagePath}`;

        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <img src="${adjustedImagePath}" alt="${book.title}">
            <h3 class="book-card-title">${book.title}</h3>
            <p class="book-card-author">${book.author}</p>
        `;

        bookCard.addEventListener('click', () => {
            localStorage.setItem('selectedBook', JSON.stringify(book));
            window.location.href = 'bookDetails.html';
        });

        bookGrid.appendChild(bookCard);

    });
}






    // Function to generate star ratings
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return '★'.repeat(fullStars) + (halfStar ? '⯨' : '') + '☆'.repeat(emptyStars);
    }

    // Function to add a book to cart
    function addToCart(book) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItemIndex = cart.findIndex(item => item.title === book.title);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            // Use a consistent relative path for the image
            const relativeImagePath = `../../BookList/${book.imagePath}`;
            cart.push({
                title: book.title,
                author: book.author,
                price: parseFloat ('4.99'),
                quantity: 1,
                imagePath: relativeImagePath, // Store relative path
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
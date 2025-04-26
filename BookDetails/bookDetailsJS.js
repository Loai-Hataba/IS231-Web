document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const seeLessBtn = document.getElementById('see-less-btn');
    const hiddenReviews = document.querySelectorAll('.review.hidden');
    const bookContainer = document.getElementById('book-container');
    const reviewsContainer = document.getElementById('reviews');
    const quotesContainer = document.getElementById('quotes');
    const detailsContainer = document.getElementById('details');


    // Retrieving the selected book data from localStorage
    const selectedBook = JSON.parse(localStorage.getItem('selectedBook'));

    
    if (selectedBook) {
        const adjustedImagePath = `../BookList/${selectedBook.imagePath}`;
        console.log(adjustedImagePath);
        console.log("yessszzz\n");

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
                <button class="btn" onclick="window.location.href='../PaymentMethod/Cart/Cart.html'">Add to shopping cart</button>
                <div class="description">
                    <h2 class="section-title">Description</h2>
                    <p>${selectedBook.description}</p>
                </div>
            </div>        `;

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

    // Tab switching functionality
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            toggleActiveClass(tabs, tabContents, index);
        });
    });

    // Load more and see less functionality
    if (loadMoreBtn && seeLessBtn) {
        loadMoreBtn.addEventListener('click', () => toggleReviews(true));
        seeLessBtn.addEventListener('click', () => toggleReviews(false));
    }

    // Function to toggle active class for tabs
    function toggleActiveClass(tabs, contents, activeIndex) {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        tabs[activeIndex].classList.add('active');
        contents[activeIndex].classList.add('active');
    }

    // Function to toggle reviews visibility
    function toggleReviews(showMore) {
        hiddenReviews.forEach(review => review.classList.toggle('hidden', !showMore));
        loadMoreBtn.classList.toggle('hidden', showMore);
        seeLessBtn.classList.toggle('hidden', !showMore);
    }
});
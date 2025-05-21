// Wait for the DOM to fully load before running any JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    initProgressBars();
    initWishlist();
    initUserProfile();
    initSignOut();
    initSampleBooks();
    addStyles();

    // progress Bars Functionality
    function initProgressBars() {
        // get all progress cards
        const readCard = document.querySelector('.analytics .card:nth-child(1)');
        const rentedCard = document.querySelector('.analytics .card:nth-child(2)');
        const rentalsViewCard = document.querySelector('.analytics .card:nth-child(3)');

        // initialize counters for each category
        if (readCard) {
            initCounter(readCard, 15, 20);
        }

        if (rentedCard) {
            // get current user's rental data
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (currentUser && currentUser.email) {
                const userOrders = JSON.parse(localStorage.getItem(`user_orders_${currentUser.email}`)) || [];
                const totalRented = userOrders.reduce((count, order) => count + order.items.length, 0);
                const goalRented = 10;
                initCounter(rentedCard, Math.min(totalRented, goalRented), goalRented);
            } else {
                initCounter(rentedCard, 9, 10);
            }
        }

        // function to initialize counters with +/- buttons
        function initCounter(cardElement, current, total) {
            // update the UI to reflect current state
            updateCounter(cardElement, current, total);

            // create increment/decrement buttons
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'counter-controls';

            const decrementBtn = document.createElement('button');
            decrementBtn.textContent = '-';
            decrementBtn.className = 'counter-btn decrement';

            const incrementBtn = document.createElement('button');
            incrementBtn.textContent = '+';
            incrementBtn.className = 'counter-btn increment';

            // add event listeners
            decrementBtn.addEventListener('click', function() {
                if (current > 0) {
                    current--;
                }
                updateCounter(cardElement, current, total);
            });

            incrementBtn.addEventListener('click', function() {
                if (current < total) {
                    current++;
                }
                updateCounter(cardElement, current, total);
            });

            // append buttons to container
            buttonContainer.appendChild(decrementBtn);
            buttonContainer.appendChild(incrementBtn);

            // append container to card
            cardElement.appendChild(buttonContainer);
        }

        // function to update counter display and progress bar
        function updateCounter(cardElement, current, total) {
            const countEl = cardElement.querySelector('p');
            const barEl = cardElement.querySelector('.bar');

            if (countEl && barEl) {
                countEl.textContent = `${current} of ${total} goal`;

                // update progress bar width
                const percentage = (current / total) * 100;
                barEl.style.width = `${percentage}%`;

                // visual feedback based on completion
                if (percentage === 100) {
                    barEl.classList.add('completed');
                } else {
                    barEl.classList.remove('completed');
                }
            }
        }
    }

    function addBookToWishlist(title, author, imageUrl) {
        console.log('Adding book to wishlist:', title, author, imageUrl);

        // find the book grid container
        const bookGrid = document.querySelector('.book-grid');
        if (!bookGrid) {
            console.error('Book grid element not found!');
            showNotification('Error adding book to wishlist', 'error');
            return;
        }

        // 2. Create the new book element
        const newBook = document.createElement('div');
        newBook.className = 'book';

        // Generate unique ID for the book
        const newId = Date.now().toString();
        newBook.setAttribute('data-book-id', newId);

        // 3. Set the book content
        newBook.innerHTML = `
            <img src="${imageUrl}" alt="${title} by ${author}">
            <p>${title}</p>
        `;

        // 4. Add the remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Remove from wishlist';

        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the parent click event
            removeFromWishlist(newBook);
        });

        newBook.appendChild(removeBtn);

        // 5. Add click event for showing book details
        newBook.addEventListener('click', function() {
            showBookDetails(newId, title, author);
        });

        // 6. Add to the wishlist grid with fade-in animation
        newBook.classList.add('fade-in');
        bookGrid.appendChild(newBook);

        // 7. Save to local storage (optional but recommended)
        saveWishlistToLocalStorage();

        // 8. Show success notification
        showNotification(`Added "${title}" to your wishlist`);

        console.log(`Added new book: ${title} by ${author} with ID: ${newId}`);
        return newId; // Return the ID in case it's needed elsewhere
    }

    // Helper function to save wishlist to local storage
    function saveWishlistToLocalStorage() {
        // Get all books currently in the wishlist
        const books = document.querySelectorAll('.book-grid .book');
        const wishlist = [];

        books.forEach(book => {
            const bookId = book.getAttribute('data-book-id');
            const title = book.querySelector('p').textContent;
            const imgSrc = book.querySelector('img').src;
            const imgAlt = book.querySelector('img').alt;

            // Extract author from alt text if available
            let author = '';
            if (imgAlt && imgAlt.includes('by')) {
                author = imgAlt.split('by')[1].trim();
            }

            wishlist.push({
                id: bookId,
                title: title,
                author: author,
                image: imgSrc
            });
        });

        // Get current user
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser && currentUser.email) {
            // Save wishlist associated with user email
            localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(wishlist));
        } else {
            // Save to general storage if no user is logged in
            localStorage.setItem('userWishlist', JSON.stringify(wishlist));
        }
    }

    // Enhanced book details function to show more information
    function showBookDetails(bookId, title, author = '') {
        const modal = document.createElement('div');
        modal.className = 'modal';

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>${title}</h3>
                ${author ? `<p class="book-author">by ${author}</p>` : ''}
                <div class="book-actions">
                    <button class="action-btn read-btn">Mark as Read</button>
                    <button class="action-btn rent-btn">Rent</button>
                </div>
            </div>
        `;

        // Add close functionality
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });

        // Close if clicking outside the modal content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Add action button functionality
        const actionBtns = modal.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.classList.contains('read-btn') ? 'read' : 'rented';

                // Here you could update your progress bars
                updateBookAction(action);

                showNotification(`Book marked as ${action}`);
                modal.remove();
            });
        });
    }

    // Helper function to update progress bars when a book action is taken
    function updateBookAction(action) {
        let cardElement, current, total;

        switch(action) {
            case 'read':
                cardElement = document.querySelector('.analytics .card:nth-child(1)');
                break;
            case 'rented':
                cardElement = document.querySelector('.analytics .card:nth-child(2)');
                break;
        }

        if (cardElement) {
            // Get current values from the UI
            const countText = cardElement.querySelector('p').textContent;
            const matches = countText.match(/(\d+)\s+of\s+(\d+)/);

            if (matches && matches.length === 3) {
                current = parseInt(matches[1], 10);
                total = parseInt(matches[2], 10);

                // Increment the counter if not at max
                if (current < total) {
                    current++;
                    updateCounter(cardElement, current, total);
                }
            }
        }
    }

    // Enhanced remove function to update local storage
    function removeFromWishlist(bookElement) {
        // Add fade-out animation
        bookElement.classList.add('fade-out');

        // Remove element after animation completes
        setTimeout(() => {
            const bookId = bookElement.getAttribute('data-book-id');
            bookElement.remove();

            // Update local storage after removal
            saveWishlistToLocalStorage();

            console.log(`Removed book with ID: ${bookId}`);
            showNotification('Book removed from wishlist');
        }, 300);
    }

    // 2. Wishlist Functionality
    function initWishlist() {
        // Get all books in the wishlist
        const books = document.querySelectorAll('.book-grid .book');

        // Load wishlist from local storage for current user
        loadWishlistFromStorage();

        // Add data attributes to each book for identification
        books.forEach((book, index) => {
            book.setAttribute('data-book-id', index + 1);

            // Add click event to show book details
            book.addEventListener('click', function() {
                const bookId = this.getAttribute('data-book-id');
                const bookTitle = this.querySelector('p').textContent;
                showBookDetails(bookId, bookTitle);
            });

            // Create remove button for each book
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '&times;'; // × symbol
            removeBtn.title = 'Remove from wishlist';

            // Add event listener to remove button
            removeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const bookElement = this.parentElement;
                removeFromWishlist(bookElement);
            });

            // Append remove button to book element
            book.appendChild(removeBtn);
        });

        // Create "Add to Wishlist" button
        const wishlistSection = document.querySelector('.wishlist');
        const addBookBtn = document.createElement('button');
        addBookBtn.className = 'add-book-btn';
        addBookBtn.textContent = 'Add Book';

        // Add event listener to show add book form
        addBookBtn.addEventListener('click', showAddBookForm);

        // Insert button after the heading
        const wishlistHeading = wishlistSection.querySelector('h2');
        wishlistHeading.parentNode.insertBefore(addBookBtn, wishlistHeading.nextSibling);

        // Function to load wishlist from storage
        function loadWishlistFromStorage() {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            let wishlistData = [];
            
            if (currentUser && currentUser.email) {
                wishlistData = JSON.parse(localStorage.getItem(`wishlist_${currentUser.email}`)) || [];
            } else {
                wishlistData = JSON.parse(localStorage.getItem('userWishlist')) || [];
            }
            
            const bookGrid = document.querySelector('.book-grid');
            if (bookGrid && wishlistData.length > 0) {
                // Clear existing books
                bookGrid.innerHTML = '';
                
                // Add books from storage
                wishlistData.forEach(book => {
                    const bookElement = document.createElement('div');
                    bookElement.className = 'book';
                    bookElement.setAttribute('data-book-id', book.id);
                    
                    bookElement.innerHTML = `
                        <img src="${book.image}" alt="${book.title} by ${book.author}">
                        <p>${book.title}</p>
                    `;
                    
                    bookGrid.appendChild(bookElement);
                });
            }
        }

        // Function to show book details
        function showBookDetails(bookId, bookTitle) {
            // Create a modal for book details
            const modal = document.createElement('div');
            modal.className = 'modal';

            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>${bookTitle}</h3>
                    <p>Book ID: ${bookId}</p>
                    <p>Here you would display additional book details.</p>
                </div>
            `;

            // Add close functionality
            document.body.appendChild(modal);

            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', function() {
                modal.remove();
            });

            // Close if clicking outside the modal content
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }

        // Function to remove book from wishlist
        function removeFromWishlist(bookElement) {
            // Add fade-out animation
            bookElement.classList.add('fade-out');

            // Remove element after animation completes
            setTimeout(() => {
                bookElement.remove();
                // Update local storage
                saveWishlistToLocalStorage();
                console.log(`Removed book with ID: ${bookElement.getAttribute('data-book-id')}`);
            }, 300);
        }

        // Function to show add book form
        function showAddBookForm() {
            // Get available books from local storage
            const availableBooks = JSON.parse(localStorage.getItem('availableBooks') || '[]');

            const modal = document.createElement('div');
            modal.className = 'modal';

            // Create HTML for book selection interface
            let booksHTML = '';
            availableBooks.forEach(book => {
                booksHTML += `
                    <div class="book-selection-item" data-book-id="${book.id}">
                        <img src="${book.image}" alt="${book.title}">
                        <div class="book-info">
                            <h4>${book.title}</h4>
                            <p class="author">by ${book.author}</p>
                            <p class="description">${book.description}</p>
                        </div>
                    </div>
                `;
            });

            modal.innerHTML = `
                <div class="modal-content book-selection-modal">
                    <span class="close-modal">&times;</span>
                    <h3>Select a Book to Add</h3>
                    <div class="book-selection-container">
                        ${booksHTML}
                    </div>
                    <div class="book-selection-actions">
                        <button id="add-new-book-btn">Add Custom Book Instead</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Add close functionality
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', function() {
                modal.remove();
            });

            // Close if clicking outside the modal content
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // Add click event to all book selection items
            const bookItems = modal.querySelectorAll('.book-selection-item');
            bookItems.forEach(item => {
                item.addEventListener('click', function() {
                    // Toggle selection
                    bookItems.forEach(i => i.classList.remove('selected'));
                    this.classList.add('selected');
                });

                // Add double-click to immediately add the book
                item.addEventListener('dblclick', function() {
                    const bookId = this.dataset.bookId;
                    const book = availableBooks.find(b => b.id === bookId);
                    if (book) {
                        addBookToWishlist(book.title, book.author, book.image);
                        modal.remove();
                    }
                });
            });

            // Add button to add the selected book
            const selectionActions = modal.querySelector('.book-selection-actions');
            const addSelectedBtn = document.createElement('button');
            addSelectedBtn.textContent = 'Add Selected Book';
            addSelectedBtn.className = 'primary-btn';
            addSelectedBtn.addEventListener('click', function() {
                const selectedItem = modal.querySelector('.book-selection-item.selected');

                if (selectedItem) {
                    const bookId = selectedItem.dataset.bookId;
                    const book = availableBooks.find(b => b.id === bookId);
                    if (book) {
                        addBookToWishlist(book.title, book.author, book.image);
                        modal.remove();
                    }
                } else {
                    alert('Please select a book first');
                }
            });
            selectionActions.prepend(addSelectedBtn);

            // Add custom book option
            const addNewBookBtn = modal.querySelector('#add-new-book-btn');
            addNewBookBtn.addEventListener('click', function() {
                modal.remove();
                showCustomBookForm();
            });
        }

        // Add this function for the custom book form
        function showCustomBookForm() {
            const modal = document.createElement('div');
            modal.className = 'modal';

            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Add Custom Book to Wishlist</h3>
                    <form id="add-book-form">
                        <div class="form-group">
                            <label for="book-title">Title:</label>
                            <input type="text" id="book-title" required>
                        </div>
                        <div class="form-group">
                            <label for="book-author">Author:</label>
                            <input type="text" id="book-author" required>
                        </div>
                        <div class="form-group">
                            <label for="book-image">Image URL:</label>
                            <input type="text" id="book-image" value="https://via.placeholder.com/150x200">
                        </div>
                        <button type="submit">Add to Wishlist</button>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Add close functionality
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', function() {
                modal.remove();
            });

            // Close if clicking outside the modal content
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // Handle form submission
            const form = modal.querySelector('#add-book-form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const title = document.getElementById('book-title').value;
                const author = document.getElementById('book-author').value;
                const imageUrl = document.getElementById('book-image').value;

                addBookToWishlist(title, author, imageUrl);
                modal.remove();
            });
        }
    }

    // 3. User Profile Functionality
    function initUserProfile() {
        const userSection = document.querySelector('.user-profile');
        
        // Load user data from session storage
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
        const userName = currentUser.firstName || 'User';
        
        // Update welcome message if needed
        const welcomeHeading = userSection.querySelector('h1');
        if (welcomeHeading) {
            welcomeHeading.textContent = `Welcome back, ${userName}`;
        }

        // Create edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-profile-btn';
        editBtn.textContent = 'Edit Profile';
        userSection.appendChild(editBtn);

        // Add event listener to show edit form
        editBtn.addEventListener('click', showEditProfileForm);
        
        // Set up rentals button
        const viewRentalsBtn = document.getElementById('view-rentals-btn');
        if (viewRentalsBtn) {
            viewRentalsBtn.addEventListener('click', showUserRentals);
        }

        function showEditProfileForm() {
            const modal = document.createElement('div');
            modal.className = 'modal';

            // Get current quote
            const currentQuote = userSection.querySelector('p').textContent.replace(/"/g, '');

            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h3>Edit Profile</h3>
                    <form id="edit-profile-form">
                        <div class="form-group">
                            <label for="user-name">Name:</label>
                            <input type="text" id="user-name" value="${userName}" required>
                        </div>
                        <div class="form-group">
                            <label for="user-quote">Personal Quote:</label>
                            <textarea id="user-quote" rows="3" required>${currentQuote}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="user-image">Profile Image URL:</label>
                            <input type="text" id="user-image" value="${userSection.querySelector('img').src}">
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Add close functionality
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', function() {
                modal.remove();
            });

            // Close if clicking outside the modal content
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // Handle form submission
            const form = modal.querySelector('#edit-profile-form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                const newName = document.getElementById('user-name').value;
                const newQuote = document.getElementById('user-quote').value;
                const newImageUrl = document.getElementById('user-image').value;

                updateUserProfile(newName, newQuote, newImageUrl);
                modal.remove();
            });
        }

        function updateUserProfile(name, quote, imageUrl) {
            // Update DOM elements
            userSection.querySelector('h1').textContent = `Welcome back, ${name}`;
            userSection.querySelector('p').textContent = `"${quote}"`;
            userSection.querySelector('img').src = imageUrl;

            // Update user in session storage
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};
            currentUser.firstName = name;
            currentUser.quote = quote;
            currentUser.imageUrl = imageUrl;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Show confirmation message
            showNotification('Profile updated successfully!');

            // Here you would typically send this data to your backend
            console.log('Profile updated:', { name, quote, imageUrl });
        }
        
        function showUserRentals() {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (!currentUser || !currentUser.email) {
                showNotification('Please log in to view your rentals', 'error');
                return;
            }
            
            const userOrders = JSON.parse(localStorage.getItem(`user_orders_${currentUser.email}`)) || [];
            
            const modal = document.createElement('div');
            modal.className = 'modal rentals-modal';
            
            let rentalsHTML = '';
            let hasRentals = false;
            
            // Process all orders to get rental information
            userOrders.forEach((order, index) => {
                if (order.items && order.items.length > 0) {
                    hasRentals = true;
                    const orderDate = new Date(order.date).toLocaleDateString();
                    
                    rentalsHTML += `
                        <div class="order">
                            <h3>Order #${order.orderId}</h3>
                            <p class="order-date">Ordered on: ${orderDate}</p>
                            <div class="rented-books">
                    `;
                    
                    order.items.forEach(item => {
                        rentalsHTML += `
                            <div class="rented-book">
                                <img src="../${item.imagePath}" alt="${item.title}" onerror="this.src='../PaymentMethod/assets/placeholder.jpg'">
                                <div class="book-details">
                                    <h4>${item.title}</h4>
                                    <p>by ${item.author}</p>
                                    <p class="rental-period">Rental period: ${item.rentalPeriod}</p>
                                </div>
                            </div>
                        `;
                    });
                    
                    rentalsHTML += `
                            </div>
                        </div>
                    `;
                }
            });
            
            if (!hasRentals) {
                rentalsHTML = '<div class="no-rentals">You haven\'t rented any books yet.</div>';
            }
            
            modal.innerHTML = `
                <div class="modal-content rentals-content">
                    <span class="close-modal">&times;</span>
                    <h2>My Rented Books</h2>
                    <div class="rentals-container">
                        ${rentalsHTML}
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add close functionality
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', function() {
                modal.remove();
            });
            
            // Close if clicking outside the modal content
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.remove();
                }
            });
        }
    }

    // 4. Sign Out Functionality
    function initSignOut() {
        const signOutBtn = document.querySelector('.signout-btn');

        if (signOutBtn) {
            signOutBtn.addEventListener('click', function(e) {
                // Mark the event as handled by profile.js
                e._profileJsHandled = true;
                
                // Clear session storage immediately without confirmation
                sessionStorage.removeItem('currentUser');
                
                // Show notification
                showNotification('You have been signed out successfully.');
                
                // Redirect to login page immediately
                window.location.href = '../Sign up & Log in & About Us/Forms/login.html';
            });
        }
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to document
        document.body.appendChild(notification);

        // Apply entrance animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');

            // Remove from DOM after exit animation completes
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    function initSampleBooks() {
        // Check if books exist in local storage
        if (!localStorage.getItem('availableBooks')) {
            // Create sample book data
            const sampleBooks = [
                {
                    id: '1',
                    title: 'Outsider',
                    author: 'Albert Camus',
                    image: 'assets/Outsider.png',
                    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit'
                },
                {
                    id: '2',
                    title: 'Odyssey',
                    author: 'Homer',
                    image: 'assets/odyssey.png',
                    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit'
                },
                {
                    id: '3',
                    title: 'The Great Gatsby',
                    author: 'F.Scott Fitzgerald',
                    image: 'https://skyhorse-us.imgix.net/covers/9781949846386.jpg?auto=format&w=298',
                    description: 'The Great Gatsby: Jay Gatsby pursues his lost love, Daisy, in 1920s New York, exposing the hollow American Dream and materialism.'
                },
                {
                    id: '4',
                    title: 'Pride and Prejudice',
                    author: 'Jane Austen',
                    image: 'https://readaloudrevival.com/wp-content/uploads/2016/05/Pride-and-Prejudice.png.webp',
                    description: 'A romantic novel of manners set in early 19th century England.'
                },
                {
                    id: '5',
                    title: 'The Gambler',
                    author: 'Fyodor Dostoevsky',
                    image: 'assets/The%20Gambler.jpg',
                    description: 'Fantasy novel about the adventures of hobbit Bilbo Baggins.'
                }
            ];

            // Save to local storage
            localStorage.setItem('availableBooks', JSON.stringify(sampleBooks));
        }
    }
});

// Define addStyles function outside the event listener
function addStyles() {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        /* Counter Controls */
        .counter-controls {
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }
        
        .counter-btn {
            background-color: #333;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            font-size: 18px;
            margin: 0 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .counter-btn:hover {
            background-color: #555;
        }
        
        /* Bar animation and completed state */
        .bar {
            transition: width 0.5s ease-in-out;
        }
        
        .bar.completed {
            background-color: #4CAF50 !important;
        }
        
        /* Wishlist book controls */
        .book {
            position: relative;
            transition: transform 0.3s, opacity 0.3s;
        }
        
        .book:hover {
            transform: translateY(-5px);
        }
        
        .remove-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: rgba(255, 0, 0, 0.7);
            color: white;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            font-size: 16px;
            cursor: pointer;
            display: none;
            transition: background-color 0.3s;
        }
        
        .book:hover .remove-btn {
            display: block;
        }
        
        .remove-btn:hover {
            background-color: rgba(255, 0, 0, 1);
        }
        
        /* Add Book Button */
        .add-book-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 10px;
            vertical-align: middle;
            transition: background-color 0.3s;
        }
        
        .add-book-btn:hover {
            background-color: #45a049;
        }
        
        /* Edit Profile Button */
        .edit-profile-btn {
            background-color: #2196F3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 20px;
            transition: background-color 0.3s;
        }
        
        .edit-profile-btn:hover {
            background-color: #0b7dda;
        }
        
        /* Modal */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 500px;
            position: relative;
        }
        
        .close-modal {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            cursor: pointer;
        }
        
        /* Form Styles */
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        form button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
            margin-top: 10px;
        }
        
        form button:hover {
            background-color: #45a049;
        }
        
        /* Animations */
        .fade-out {
            opacity: 0;
            transform: scale(0.8);
        }
        
        .fade-in {
            animation: fadeIn 0.5s;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.8);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        
        /* Notification */
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 4px;
            color: white;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s, opacity 0.3s;
            z-index: 2000;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification.success {
            background-color: #4CAF50;
        }
        
        .notification.error {
            background-color: #f44336;
        }

        /* Book Selection Modal */
        .book-selection-modal {
            max-width: 700px;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .book-selection-container {
            max-height: 60vh;
            overflow-y: auto;
            margin-bottom: 20px;
        }
        
        .book-selection-item {
            display: flex;
            padding: 10px;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .book-selection-item:hover {
            background-color: #f5f5f5;
        }
        
        .book-selection-item.selected {
            background-color: #e3f2fd;
            border-color: #2196F3;
        }
        
        .book-selection-item img {
            width: 60px;
            height: 90px;
            object-fit: cover;
            margin-right: 15px;
        }
        
        .book-info {
            flex: 1;
        }
        
        .book-info h4 {
            margin: 0 0 5px 0;
        }
        
        .book-info .author {
            font-style: italic;
            margin: 0 0 5px 0;
            color: #666;
        }
        
        .book-info .description {
            font-size: 0.9em;
            margin: 5px 0 0 0;
            color: #333;
        }
        
        .book-selection-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
        }
        
        .primary-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
        }
        
        #add-new-book-btn {
            background-color: #f0f0f0;
            color: #333;
            border: 1px solid #ddd;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
        }
        
        #add-new-book-btn:hover {
            background-color: #e0e0e0;
        }
        
        /* Rentals styles */
        .view-rentals-btn {
            background-color: #a17d4d;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 10px;
            font-weight: 500;
        }
        
        .view-rentals-btn:hover {
            background-color: #86683d;
        }
        
        .rentals-modal .modal-content {
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .rentals-container {
            margin-top: 15px;
        }
        
        .order {
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
        }
        
        .order-date {
            color: #666;
            font-style: italic;
            margin-bottom: 10px;
        }
        
        .rented-books {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 15px;
        }
        
        .rented-book {
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 10px;
            text-align: center;
            transition: transform 0.3s;
        }
        
        .rented-book:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .rented-book img {
            max-width: 100px;
            height: 150px;
            object-fit: cover;
            border-radius: 4px;
            margin-bottom: 10px;
        }
        
        .book-details h4 {
            margin: 0 0 5px;
        }
        
        .rental-period {
            color: #a17d4d;
            font-weight: 500;
            margin-top: 5px;
        }
        
        .no-rentals {
            text-align: center;
            padding: 30px;
            color: #666;
            font-size: 18px;
        }
    `;

    document.head.appendChild(styleEl);
}
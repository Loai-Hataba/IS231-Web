

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    
    initializeAdminPanel();
});

function checkAdminAccess() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const isAdmin = currentUser?.isAdmin;
    
    if (!isAdmin) {
        alert('Access denied. This page is only accessible to administrators.');
        window.location.href = '../index.html'; // Redirect to homepage or login
        return;
    }
}

function initializeAdminPanel() {
    loadBooks();
    setupEventListeners();
}

function loadBooks() {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const tableBody = document.querySelector('.books-table tbody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add book rows
    books.forEach(book => {
        const row = createBookRow(book);
        tableBody.appendChild(row);
    });
}

function createBookRow(book) {
    const row = document.createElement('tr');
    
    // Create table data cells
    row.innerHTML = `
        <td>${book.ID}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.tags.join(', ')}</td>
        <td class="action-buttons">
            <div class="blue-button view-btn" data-id="${book.ID}">View</div>
            <div class="green-button edit-btn" data-id="${book.ID}">Edit</div>
            <div class="red-button delete-btn" data-id="${book.ID}">Delete</div>
        </td>
    `;
    
    // Add event listeners to buttons
    row.querySelector('.view-btn').addEventListener('click', () => viewBook(book.ID));
    row.querySelector('.edit-btn').addEventListener('click', () => editBook(book.ID));
    row.querySelector('.delete-btn').addEventListener('click', () => deleteBook(book.ID));
    
    return row;
}

function setupEventListeners() {
    // Search functionality
    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', handleSearch);
    
    // Add new book button
    const addBookBtn = document.querySelector('.header .blue-button');
    addBookBtn.addEventListener('click', showAddBookForm);
    
    // Add listeners for nav menu
    setupNavigation();
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const tableBody = document.querySelector('.books-table tbody');
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Filter books based on ID or title
    const filteredBooks = books.filter(book => 
        book.ID.toString().includes(searchTerm) || 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );
    
    // Add filtered books to table
    filteredBooks.forEach(book => {
        const row = createBookRow(book);
        tableBody.appendChild(row);
    });
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.options div');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Handle navigation (you can expand this to show different sections)
            const section = this.textContent.trim().toLowerCase();
            handleNavigation(section);
        });
    });
}

function handleNavigation(section) {
    // You can implement navigation to different sections here
    console.log(`Navigating to ${section}`);
    // For now, we're only implementing the books dashboard
}

// Book actions
function viewBook(bookId) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.ID.toString() === bookId.toString());
    
    if (book) {
        navigateToBookDetails(book);
    } else {
        alert('Book not found');
    }
}

function navigateToBookDetails(book) {
    localStorage.setItem('selectedBook', JSON.stringify(book));
    window.location.href = `../BookDetails/bookDetails.html?ID=${book.ID}`;
}

function editBook(bookId) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const book = books.find(b => b.ID.toString() === bookId.toString());
    
    if (!book) {
        alert('Book not found');
        return;
    }
    
    // Create modal for editing
    const modal = creat_or_edit_modal(book);
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
}

function creat_or_edit_modal(book) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.opacity = '0';
    modal.style.zIndex = '2';
    
    modal.innerHTML = `
        <div class="modal-content" style="background-color: white; padding: 20px; width: 80%; max-width: 600px; max-height: 80vh; overflow-y: auto; transform: translateY(-20px); transition: transform 0.3s ease;">
            <h2>Edit Book</h2>
            <form id="edit-book-form">
                <div style="margin-bottom: 15px;">
                    <label for="title">Title:</label>
                    <input type="text" id="title" value="${book.title}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label for="author">Author:</label>
                    <input type="text" id="author" value="${book.author}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label for="description">Description:</label>
                    <input type="text" id="description" value = "${book.description}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px; min-height: 100px;"></input>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label for="tags">Tags (comma separated):</label>
                    <input type="text" id="tags" value="${book.tags.join(', ')}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label for="publisher">Publisher:</label>
                    <input type="text" id="publisher" value="${book.publisher}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label for="publishDate">Publish Date:</label>
                    <input type="text" id="publishDate" value="${book.publishDate}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label for="pages">Pages:</label>
                    <input type="number" id="pages" value="${book.pages}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label for="language">Language:</label>
                    <input type="text" id="language" value="${book.language}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label for="isbn">ISBN:</label>
                    <input type="text" id="isbn" value="${book.isbn}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label for="rating">Rating (0-5):</label>
                    <input type="number" id="rating" min="0" max="5" step="0.1" value="${book.rating}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label for="imagePath">Image Path:</label>
                    <input type="text" id="imagePath" value="${book.imagePath}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label>In Stock:</label>
                    <select id="inStock" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="true" ${book.inStock ? 'selected' : ''}>Yes</option>
                        <option value="false" ${!book.inStock ? 'selected' : ''}>No</option>
                    </select>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
                    <button type="button" class="cancel-btn" style="padding: 8px 16px; background-color: #ccc; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button type="submit" style="padding: 8px 16px; background-color: var(--green); color: white; border: none; border-radius: 4px; cursor: pointer;">Save Changes</button>
                </div>
            </form>
        </div>
    `;
    
    // Add event listeners
    modal.querySelector('.cancel-btn').addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.querySelector('#edit-book-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateBook(book.ID, modal);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    return modal;
}

function closeModal(modal) {
    modal.style.opacity = '0';
    modal.querySelector('.modal-content').style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

function updateBook(bookId, modal) {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const bookIndex = books.findIndex(b => b.ID.toString() === bookId.toString());
    
    if (bookIndex === -1) {
        return;
    }
    
    const title = modal.querySelector('#title').value;
    const author = modal.querySelector('#author').value;
    const description = modal.querySelector('#description').value;
    const tags = modal.querySelector('#tags').value.split(',').map(tag => tag.trim());
    const publisher = modal.querySelector('#publisher').value;
    const publishDate = modal.querySelector('#publishDate').value;
    const pages = parseInt(modal.querySelector('#pages').value);
    const language = modal.querySelector('#language').value;
    const isbn = modal.querySelector('#isbn').value;
    const rating = parseFloat(modal.querySelector('#rating').value);
    const imagePath = modal.querySelector('#imagePath').value;
    const inStock = modal.querySelector('#inStock').value === 'true';
    
    books[bookIndex] = {
        ...books[bookIndex],
        title,
        author,
        description,
        tags,
        publisher,
        publishDate,
        pages,
        language,
        isbn,
        rating,
        imagePath,
        inStock
    };
    
    localStorage.setItem('books', JSON.stringify(books));
    
    closeModal(modal);
    
    loadBooks();
    
}

function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    
    //if the admin delet we going to get all the list of books then remove the unneded one and the resave it to the local storage
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const updatedBooks = books.filter(book => book.ID.toString() !== bookId.toString());
    
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    loadBooks();
    
}

function showAddBookForm() {
    // Generate a new unique ID
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const newId = generateNewId(books);
    
    // Create empty book object
    const newBook = {
        ID: newId,
        title: '',
        description: '',
        imagePath: 'images/placeholder_book.jpg',
        tags: [],
        author: '',
        publisher: '',
        publishDate: '',
        pages: 0,
        language: 'English',
        isbn: '',
        rating: 0,
        inStock: true,
        reviews: [],
        quotes: [],
        details: []
    };
    
    const modal = creat_or_edit_modal(newBook);
    document.body.appendChild(modal);
    
    const form = modal.querySelector('#edit-book-form');
    form.removeEventListener('submit', form.onsubmit);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewBook(modal);
    });
    
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
}

function generateNewId(books) {
    if (books.length === 0) return '1001';
    
    const highestId = Math.max(...books.map(book => parseInt(book.ID)));
    return (highestId + 1).toString();
}

function addNewBook(modal) {
    const title = modal.querySelector('#title').value;
    const author = modal.querySelector('#author').value;
    const description = modal.querySelector('#description').value;
    const tags = modal.querySelector('#tags').value.split(',').map(tag => tag.trim());
    const publisher = modal.querySelector('#publisher').value;
    const publishDate = modal.querySelector('#publishDate').value;
    const pages = parseInt(modal.querySelector('#pages').value);
    const language = modal.querySelector('#language').value;
    const isbn = modal.querySelector('#isbn').value;
    const rating = parseFloat(modal.querySelector('#rating').value);
    const imagePath = modal.querySelector('#imagePath').value;
    const inStock = modal.querySelector('#inStock').value === 'true';
    
    if (!title || !author|| !description) {
        alert('Title and author and descritpion are required');
        return;
    }
    
    const books = JSON.parse(localStorage.getItem('books')) || [];
    const newId = generateNewId(books);
    
    const newBook = new Book(
        newId,
        title,
        description,
        imagePath,
        tags,
        author,
        publisher,
        publishDate,
        pages,
        language,
        isbn,
        rating
    );
    
    books.push(newBook);
    
    localStorage.setItem('books', JSON.stringify(books));
    
    closeModal(modal);
    
    loadBooks();
    
}

class Book {
    constructor(ID, title, description, imagePath, tags, author, publisher, publishDate, pages, language, isbn, rating, reviews = [], quotes = [], details = []) {
        this.ID = ID;
        this.title = title;
        this.description = description;
        this.imagePath = imagePath;
        this.tags = tags;
        this.author = author;
        this.publisher = publisher;
        this.publishDate = publishDate;
        this.pages = pages;
        this.language = language;
        this.isbn = isbn;
        this.rating = rating;
        this.inStock = true;
        this.reviews = reviews;
        this.quotes = quotes;
        this.details = details;
    }
}
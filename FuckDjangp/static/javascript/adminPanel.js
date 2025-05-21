document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    setupEventListeners();
});

function setupEventListeners() {
    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', handleSearch);
    
    const addBookBtn = document.getElementById('add-book-btn');
    addBookBtn.addEventListener('click', () => showEditModal());
    
    // Add event listeners for new buttons
    const addAdminBtn = document.getElementById('add-admin-btn');
    addAdminBtn.addEventListener('click', showAddAdminModal);
    
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', handleLogout);
    
    // Add event listener for admin form submission
    const addAdminForm = document.getElementById('add-admin-form');
    if (addAdminForm) {
        addAdminForm.addEventListener('submit', handleAddAdmin);
    }
}

// Function to show the add admin modal
function showAddAdminModal() {
    window.location.href = '/add-admin/';  // Update the URL here
}

// Function to close the add admin modal
function closeAdminModal() {
    const modal = document.getElementById('add-admin-modal');
    modal.style.display = 'none';
}

// Function to handle admin form submission
async function handleAddAdmin(e) {
    e.preventDefault();
    
    const form = document.getElementById('add-admin-form');
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirm_password.value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const formData = {
        username: username,
        email: email,
        password: password,
    };
    
    try {
        const response = await fetch('/admin/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add admin');
        }
        
        closeAdminModal();
        alert('Admin added successfully');
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Failed to add admin');
    }
}

// Function to handle logout
async function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            const response = await fetch('/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            });

            if (response.ok) {
                // Clear any stored session data
                localStorage.removeItem('adminData');
                sessionStorage.clear();
                
                // Redirect to index page
                window.location.href = '/';
            } else {
                // If logout fails, still redirect to index page
                console.error('Logout failed, redirecting anyway');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error during logout:', error);
            // If there's an error, still redirect to index page
            window.location.href = '/';
        }
    }
}

async function loadBooks() {
    try {
        const response = await fetch('/books/');
        if (!response.ok) throw new Error('Failed to fetch books');
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
        alert('Failed to load books. Please try again.');
    }
}

function displayBooks(books) {
    const tableBody = document.querySelector('.books-table tbody');
    tableBody.innerHTML = '';
    
    books.forEach(book => {
        const row = createBookRow(book);
        tableBody.appendChild(row);
    });
}

function createBookRow(book) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>
            <button class="blue-button" onclick="window.location.href='/book/edit/${book.id}/'">Edit</button>
            <button class="red-button" onclick="deleteBook(${book.id})">Delete</button>
        </td>
    `;
    return row;
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
        const response = await fetch(`/books/${bookId}/delete/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        });

        if (!response.ok) throw new Error('Failed to delete book');
        
        document.querySelector(`tr[data-book-id="${bookId}"]`).remove();
        alert('Book deleted successfully');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete book');
    }
}

async function showEditModal(bookId = null) {
    const modal = document.getElementById('edit-modal');
    const form = document.getElementById('edit-book-form');
    
    if (bookId) {
        // Edit existing book
        try {
            const response = await fetch(`/books/${bookId}/`);
            if (!response.ok) throw new Error('Failed to fetch book');
            const book = await response.json();
            
            // Populate form
            Object.keys(book).forEach(key => {
                const input = form.querySelector(`#${key}`);
                if (input) {
                    if (key === 'tags') {
                        input.value = book[key].join(', ');
                    } else {
                        input.value = book[key];
                    }
                }
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to load book details');
            return;
        }
    } else {
        // New book - reset form
        form.reset();
    }

    modal.style.display = 'block';
    
    form.onsubmit = async (e) => {
        e.preventDefault();
        await saveBook(bookId);
    };
}

async function saveBook(bookId) {
    const form = document.getElementById('edit-book-form');
    const formData = {
        title: form.title.value,
        author: form.author.value,
        isbn: form.isbn.value,
        pages: parseInt(form.pages.value),
        language: form.language.value,
        cover_image: form.cover_image.value,
        publisher: form.publisher.value,
        published_date: form.published_date.value,
        description: form.description.value,
        rating: parseFloat(form.rating.value),
        tags: form.tags.value.split(',').map(tag => tag.trim()),
        in_stock: form.in_stock.value === 'true',
        quote: form.quote.value
        // Removed genre from formData
    };

    try {
        const url = bookId ? `/books/${bookId}/` : '/books/';
        const method = bookId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to save book');
        
        closeModal();
        loadBooks();
        alert(bookId ? 'Book updated successfully' : 'Book added successfully');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save book');
    }
}

function closeModal() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'none';
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('.books-table tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}
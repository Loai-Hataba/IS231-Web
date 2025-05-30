document.addEventListener('DOMContentLoaded', () => {
    // getting the current user info
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // if no user is logged in, redirect to login page
    if (!currentUser) {
        window.location.href = '../Sign up & Log in & About Us/Forms/login.html';
        return;
    }
    
    // update profile with user's name if available
    if (currentUser.firstName) {
        const welcomeHeading = document.querySelector('.user-profile h1');
        if (welcomeHeading) {
            welcomeHeading.textContent = `Welcome back, ${currentUser.firstName}`;
        }
    }
    
    // direct signout implementation (as a backup in case profile.js doesn't handle it)
   
    const signoutBtn = document.querySelector('.signout-btn');
    if (signoutBtn && !signoutBtn._hasDirectListener) {
        signoutBtn._hasDirectListener = true;
        signoutBtn.addEventListener('click', (e) => {
           
            if (!e._profileJsHandled) {
               
                sessionStorage.removeItem('currentUser');
                console.log('User signed out successfully via direct handler');
                window.location.href = '../Sign up & Log in & About Us/Forms/login.html';
            }
        }, false);
    }

   
    loadRentalHistory();
});

// function to load rental history from localStorage
function loadRentalHistory() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.email) return;
    
    const userOrders = JSON.parse(localStorage.getItem(`user_orders_${currentUser.email}`)) || [];
    
    // setup view rentals button functionality
    const viewRentalsBtn = document.getElementById('view-rentals-btn');
    const closeRentalsBtn = document.getElementById('close-rentals-btn');
    const rentedBooksSection = document.querySelector('.rented-books-section');
    const rentedBooksGrid = document.querySelector('.rented-books-grid');
    
    if (viewRentalsBtn) {
        viewRentalsBtn.addEventListener('click', () => {
            if (rentedBooksSection) {
                rentedBooksSection.style.display = 'block';
                
                // clear and populate the rentals grid
                if (rentedBooksGrid) {
                    rentedBooksGrid.innerHTML = '';
                    
                    if (userOrders.length === 0) {
                        rentedBooksGrid.innerHTML = '<p class="empty-message">You have no rental history yet.</p>';
                    } else {
                        userOrders.forEach(order => {
                            order.items.forEach(item => {
                                const bookElement = createRentalBookElement(item);
                                rentedBooksGrid.appendChild(bookElement);
                            });
                        });
                    }
                }
            }
        });
    }
    
    if (closeRentalsBtn) {
        closeRentalsBtn.addEventListener('click', () => {
            if (rentedBooksSection) {
                rentedBooksSection.style.display = 'none';
            }
        });
    }
}

// helper function to create rental book element
function createRentalBookElement(item) {
    const bookElement = document.createElement('div');
    bookElement.className = 'rented-book';
    
    bookElement.innerHTML = `
        <img src="${item.imagePath}" alt="${item.title}" onerror="this.src='../PaymentMethod/assets/placeholder.jpg'">
        <div class="book-info">
            <h3>${item.title}</h3>
            <p>by ${item.author}</p>
            <p>Rental Period: ${item.rentalPeriod || '30 days'}</p>
        </div>
    `;
    
    return bookElement;
}
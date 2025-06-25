document.addEventListener('DOMContentLoaded', async function() {
    //  UI
    const searchBar = document.querySelector('.search-bar');
    const filterButtons = document.querySelectorAll('.filter-button');
    const booksContainer = document.querySelector('.books-container');
    const showMoreButton = document.querySelector('.show-more-button');
    
    let currentFilter = 'All';
    let searchQuery = '';
    let displayedBooks = [];
    let showingAdditional = false;
    let books = []; // Initialize books as an empty array
    
    //initialize the page
    async function load_InitialBooks() {
        try {
            const response = await fetch('/getSomeBooks/');  
            const data = await response.json();
            return data.books;
        } catch (error) {
            console.error('Error fetching initial books:', error);
            return [];
        }
    }

    async function load_AllBooks() {
        try {
            const response = await fetch('/getBooks/');  
            const data = await response.json();
            return data.books;
        } catch (error) {
            console.error('Error fetching all books:', error);
            return [];
        }
    }
    
    books = await load_InitialBooks();
    displayedBooks = books;
    renderBooks(displayedBooks);
  
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {

        //update active button styling
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        currentFilter = this.textContent;
        filterAndRenderBooks(displayedBooks);
      });
    });
  
    searchBar.addEventListener('input', function() {
      searchQuery = this.value.toLowerCase();
      filterAndRenderBooks(displayedBooks);
    });
  
    showMoreButton.addEventListener('click', async function() {
      if (!showingAdditional) {
        // Load all books when showing more
        const allBooks = await load_AllBooks();
        showingAdditional = true;
        books = allBooks;
        displayedBooks = books;
        this.textContent = 'Show Less Books';
      } else {
        showingAdditional = false;
        // Reset to initial books
        books = await load_InitialBooks();
        displayedBooks = books;
        this.textContent = 'Show More Books';
      }
      filterAndRenderBooks(displayedBooks);
    });
  
    function filterAndRenderBooks(filteredBooks) {
  
      if (currentFilter !== 'All') {
        filteredBooks = filteredBooks.filter(book => {
          if (!book.genre) return false;
          return book.genre.split(',').map(g => g.trim()).includes(currentFilter);
        });
      }
      
      if (searchQuery) {
        filteredBooks = filteredBooks.filter(book => {
          // Search in title, author, description, and genre (as tags)
          const genres = book.genre ? book.genre.split(',').map(g => g.trim().toLowerCase()) : [];
          return (
            book.title.toLowerCase().includes(searchQuery) ||
            book.author.toLowerCase().includes(searchQuery) ||
            book.description.toLowerCase().includes(searchQuery) ||
            genres.some(g => g.includes(searchQuery))
          );
        });
      }

      renderBooks(filteredBooks);
    }
  
    function renderBooks(booksToRender) {
      const bookRows = booksContainer.querySelectorAll('.book-row');
      bookRows.forEach(row => row.remove());
      
      if (booksToRender.length === 0) {
        const noResultsRow = document.createElement('div');
        noResultsRow.className = 'book-row';
        noResultsRow.innerHTML = '<div class="no-results">No books match your search or filter criteria.</div>';
        
        booksContainer.insertBefore(noResultsRow, document.querySelector('.show-more-container'));
        return;
      }
  
      // Group books into rows of 3
      for (let i = 0; i < booksToRender.length; i += 3) {
        const rowBooks = booksToRender.slice(i, i + 3);
        const bookRow = document.createElement('div');
        bookRow.className = 'book-row';
        
        // Create book cards for this row
        rowBooks.forEach(book => {
          const bookCard = createBookCard(book);
          bookRow.appendChild(bookCard);
        });
        
        // insert the row
        booksContainer.insertBefore(bookRow, document.querySelector('.show-more-container'));
      }
    }
  
    // Create a book card element
    function createBookCard(book) {
      const bookCard = document.createElement('div');
      bookCard.className = 'book-card';
      bookCard.dataset.id = book.id;
      
      // Create star rating HTML
      const fullStars = Math.floor(book.rating);
      const halfStar = book.rating % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
      
      let starsHTML = '';//container for the stars
      for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star full">★</span>';
      }
      if (halfStar) {
        starsHTML += '<span class="star half">★</span>';
      }
      for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star empty">☆</span>';
      }
      
      bookCard.innerHTML = `
        <img src="/static/images/bookList/${book.cover_image}" alt="${book.title}" class="book-image">
        <div class="book-info">
          <h3 class="book-title">${book.title}</h3>
          <p class="book-author">by ${book.author}</p>
          <div class="book-rating">${starsHTML} (${book.rating})</div>
          <p class="book-description">${book.description}</p>
          <div class="book-tags">
            ${book.tags.map(tag => `<span class="book-tag">${tag}</span>`).join('')}
          </div>
        </div>
      `;
      
      bookCard.addEventListener('click', function() {
        navigateToBookDetails(book);
      });
      
      return bookCard;
    }


  // Add CSS styles for the new elements

  const style = document.createElement('style');
  style.textContent = `
    .book-author {
      font-style: italic;
      margin-top: -10px;
      margin-bottom: 5px;
      color: #555;
    }
    
    .book-rating {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .star {
      color: #ddd;
      font-size: 18px;
    }
    
    .star.full, .star.half {
      color: #f8ce0b;
    }
    
    .book-tags {
      display: flex;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    
    .book-tag {
      background-color: #f1f1f1;
      border-radius: 15px;
      padding: 3px 10px;
      font-size: 12px;
      margin-right: 5px;
      margin-bottom: 5px;
    }
    
    .filter-button.active {
      background-color: #007bff;
      color: white;
    }
    
    .no-results {
      width: 100%;
      text-align: center;
      padding: 30px;
      font-size: 18px;
      color: #666;
    }
    
    .book-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .book-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
  `;
  document.head.appendChild(style);

    // Navigate to book details page with book data
    function navigateToBookDetails(book) {
      localStorage.setItem('selectedBook', JSON.stringify(book));
      // Change to use Django URL pattern
      window.location.href = `/bookDetail/${book.id}/`;
    }
  
    //Set the first filter button (All) as active by default
    filterButtons[0].classList.add('active');
  });




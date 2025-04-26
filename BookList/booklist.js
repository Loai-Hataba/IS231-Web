// Define the book class with all required properties
class Book {
    constructor(title, description, imagePath, tags, author, publisher, publishDate, pages, language, isbn, rating) {
      this.title = title;
      this.description = description;
      this.imagePath = imagePath;
      this.tags = tags; // Array of genres/tags
      this.author = author;
      this.publisher = publisher;
      this.publishDate = publishDate;
      this.pages = pages;
      this.language = language;
      this.isbn = isbn;
      this.rating = rating; // Float between 0-5
      this.inStock = true;
    }
  }
  
  // Sample book data
  const books = [
    new Book(
      "Princess Freedom",
      "A tale of courage and liberation in a dystopian world where freedom is a distant memory.",
      "images/booklist_image_1.jpg",
      ["Fiction", "Fantasy", "Dystopian"],
      "Elena Rodriguez",
      "Horizon Publishing",
      "March 15, 2023",
      342,
      "English",
      "978-3-16-148410-0",
      4.5
    ),
    new Book(
      "ART & STYLE",
      "A comprehensive exploration of contemporary art movements and their influence on modern design.",
      "images/booklist_image_2.jpg",
      ["Non-Fiction", "Art", "Design"],
      "Marcus Chen",
      "Vision Press",
      "September 8, 2022",
      256,
      "English",
      "978-1-54-782301-5",
      4.2
    ),
    new Book(
      "A MILLION TO ONE",
      "Against impossible odds, four thieves attempt to steal a priceless artifact from the most secure vault in the world.",
      "images/booklist_image_3.jpg",
      ["Fiction", "Thriller", "Heist"],
      "Sophia Washington",
      "Enigma Books",
      "January 22, 2023",
      398,
      "English",
      "978-0-57-129087-3",
      4.7
    ),
    new Book(
      "Harry Potter & the cursed child",
      "The eighth story in the Harry Potter series, based on the award-winning stage play.",
      "images/booklist_image_4.jpg",
      ["Fiction", "Fantasy", "Magic"],
      "J.K. Rowling, John Tiffany, Jack Thorne",
      "Scholastic",
      "July 31, 2016",
      320,
      "English",
      "978-1-33-821666-0",
      4.3
    ),
    new Book(
      "Lone Wolf Adventure",
      "A thrilling survival story set in the wilderness of Alaska, where one man must overcome nature's challenges.",
      "images/booklist_image_5.jpg",
      ["Fiction", "Adventure", "Survival"],
      "Jack Forrester",
      "Wilderness Press",
      "May 12, 2023",
      276,
      "English",
      "978-0-99-876543-2",
      4.1
    ),
    new Book(
      "Tess of the Road",
      "A young woman's journey of self-discovery as she breaks free from societal constraints in a fantasy world.",
      "images/booklist_image_6.jpg",
      ["Fiction", "Fantasy", "Coming of Age"],
      "Rachel Hartman",
      "Random House",
      "February 27, 2018",
      512,
      "English",
      "978-1-10-193136-0",
      4.4
    ),
    new Book(
      "Aetherbound",
      "A sci-fi adventure about a girl with magical abilities who escapes life on a generation ship.",
      "images/booklist_image_7.jpg",
      ["Fiction", "Science Fiction", "Space"],
      "E.K. Johnston",
      "Dutton Books",
      "May 25, 2021",
      304,
      "English",
      "978-0-73-522983-1",
      4.0
    ),
    new Book(
      "Ashford List",
      "A historical mystery set in Victorian London, where a detective uncovers a conspiracy tied to a mysterious list.",
      "images/booklist_image_8.jpg",
      ["Fiction", "Mystery", "Historical"],
      "Victoria Pemberton",
      "Quill & Ink",
      "October 3, 2022",
      412,
      "English",
      "978-2-44-556677-8",
      4.6
    ),
    new Book(
      "The Old You",
      "A psychological thriller about identity and memory loss that keeps readers guessing until the final page.",
      "images/booklist_image_9.jpg",
      ["Fiction", "Thriller", "Psychological"],
      "Louise Voss",
      "Orenda Books",
      "May 15, 2020",
      300,
      "English",
      "978-1-91-221321-5",
      4.2
    ),
    new Book(
      "Hide And Seek",
      "A chilling horror story about an abandoned orphanage and the secrets hidden within its walls.",
      "images/booklist_image_10.jpg",
      ["Fiction", "Horror", "Supernatural"],
      "Richard Parker",
      "Midnight Press",
      "June 6, 2022",
      284,
      "English",
      "978-3-22-987654-1",
      3.9
    ),
    new Book(
      "SOUL",
      "A philosophical exploration of consciousness and what makes us human in the age of artificial intelligence.",
      "images/booklist_image_11.jpg",
      ["Non-Fiction", "Philosophy", "Science"],
      "Dr. Anita Sharma",
      "Cerebral Publications",
      "April 11, 2023",
      230,
      "English",
      "978-5-11-223344-5",
      4.8
    ),
    new Book(
      "the WAY of the NAMELESS",
      "An epic fantasy adventure following a hero without a name who must restore balance to a world in chaos.",
      "images/booklist_image_12.jpg",
      ["Fiction", "Fantasy", "Epic"],
      "Kai Zhang",
      "Mythic Books",
      "November 17, 2022",
      534,
      "English",
      "978-8-77-665544-3",
      4.5
    )
  ];
  
  //Additional books for "Show More" functionality
  const additionalBooks = [
    new Book(
      "Quantum Horizons",
      "A fascinating journey through the bizarre realities of quantum physics and its implications for our universe.",
      "images/placeholder_book.jpg",
      ["Non-Fiction", "Science", "Physics"],
      "Dr. Richard Feynmann",
      "Cosmos Press",
      "January 5, 2023",
      288,
      "English",
      "978-0-12-345678-9",
      4.7
    ),

    new Book(
      "The Last Frontier",
      "A historical account of the final days of the American frontier and the closing of the Wild West.",
      "images/placeholder_book.jpg",
      ["Non-Fiction", "History", "American"],
      "Thomas Westwood",
      "Heritage Publications",
      "August 22, 2022",
      412,
      "English",
      "978-1-23-456789-0",
      4.3
    ),
    new Book(
      "Whispers in the Dark",
      "A collection of chilling short stories that explore the darkest corners of the human psyche.",
      "images/placeholder_book.jpg",
      ["Fiction", "Horror", "Short Stories"],
      "Miranda Black",
      "Shadowfall Press",
      "October 31, 2022",
      276,
      "English",
      "978-2-34-567890-1",
      4.1
    )
  ];
  
  
  document.addEventListener('DOMContentLoaded', function() {
    //  UI
    const searchBar = document.querySelector('.search-bar');
    const filterButtons = document.querySelectorAll('.filter-button');
    const booksContainer = document.querySelector('.books-container');
    const showMoreButton = document.querySelector('.show-more-button');
    
    let currentFilter = 'All';
    let searchQuery = '';
    let displayedBooks = [...books]; 
    let showingAdditional = false;
  
    //initialize the page
    renderBooks(displayedBooks);
  
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {

        //update active button styling
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        currentFilter = this.textContent;
        filterAndRenderBooks();
      });
    });
  
    searchBar.addEventListener('input', function() {
      searchQuery = this.value.toLowerCase();
      filterAndRenderBooks();
    });
  
    showMoreButton.addEventListener('click', function() {
      if (!showingAdditional) {
        showingAdditional = true;
        displayedBooks = [...books, ...additionalBooks];
        this.textContent = 'Show Fewer Books';
      } else {
        showingAdditional = false;
        displayedBooks = [...books];
        this.textContent = 'Show More Books';
      }
      filterAndRenderBooks();
    });
  
    function filterAndRenderBooks() {
      let filteredBooks = [...books, ...additionalBooks];
      

      
      if (currentFilter !== 'All') {
        filteredBooks = filteredBooks.filter(book => 
          book.tags.includes(currentFilter)
        );
      }
      
      if (searchQuery) {
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(searchQuery) || 
          book.author.toLowerCase().includes(searchQuery) ||
          book.description.toLowerCase().includes(searchQuery) ||
          book.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
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
        <img src="${book.imagePath}" alt="${book.title}" class="book-image">
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
  document.addEventListener('DOMContentLoaded', function() {
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
  });



  
    // Navigate to book details page with book data
    function navigateToBookDetails(book) {
      localStorage.setItem('selectedBook', JSON.stringify(book));
      
      window.location.href = `../BookDetails/bookDetails.html?isbn=${book.isbn}`;
    }
  
    //Set the first filter button (All) as active by default
    filterButtons[0].classList.add('active');
  });
  



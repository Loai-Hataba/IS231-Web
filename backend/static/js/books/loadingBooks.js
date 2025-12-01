// Define the book class with all required properties
class Book {
    constructor(ID, title, description, imagePath, tags, author, publisher, publishDate, pages, language, isbn, rating,inStock, reviews = [], quotes=[], genre, price) {
      console.log(`Creating book: ${title}, inStock: ${inStock}`);
      this.ID = ID;
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
      this.inStock = inStock;
      this.reviews = reviews;
      this.quotes = quotes; 
      this.genre = genre;
      this.price = price
      // this.details = details;
    }
  }

  // Refresh booklist in local storage 
  // in the landing page open the developers tools and in the console use the command "localStorage.removeItem('initialized');" then refresh the page
  if (!localStorage.getItem('initialized')) {
    localStorage.removeItem('books');
    localStorage.removeItem('selectedBook');
    localStorage.setItem('initialized', 'true');
    console.log("LocalStorage cleared and reset.");
  }
  
  if (!localStorage.getItem('books') || localStorage.getItem('books') === '[]') {
    
    const books = [
      new Book(
        1,
        "Princess Freedom",
        "In a dystopian world where freedom is a distant memory, one girl dares to defy the system. 'Princess Freedom' is a powerful tale of resilience, rebellion, and the enduring spirit of hope. Journey with Elena as she uncovers secrets, fights oppression, and inspires a revolution in a land where dreams are forbidden.",
        "booklist_image_1.jpg",
        ["Fiction", "Fantasy", "Dystopian"],
        "Elena Rodriguez",
        "Horizon Publishing",
        "March 15, 2023",
        342,
        "English",
        "978-3-16-148410-0",
        4.5,
        false,
        [
            { reviewer: "Emily Chen", rating: 5, date: "April 2, 2025", text: "An inspiring story of courage and hope." },
            { reviewer: "Marcus Johnson", rating: 4, date: "March 15, 2025", text: "A well-written tale, though a bit predictable." }
        ],
        [
            "Freedom is not given; it is taken.",
            "Courage is the first step toward liberation."
        ],
        [
            { title: "Publication History", text: "Published in 2023 by Horizon Publishing." },
            { title: "Author's Note", text: "Elena Rodriguez shares her inspiration for writing this book." }
        ]
      ),
      new Book(
        2,
        "ART & STYLE",
        "Dive deep into the world of modern creativity with 'ART & STYLE,' a vivid exploration of contemporary art movements and their profound influence on today's design landscape. From bold abstraction to minimalistic elegance, Marcus Chen breaks down complex ideas into beautiful, accessible narratives.",
        "booklist_image_2.jpg",
        ["Non-Fiction", "Art", "Design"],
        "Marcus Chen",
        "Vision Press",
        "September 8, 2022",
        256,
        "English",
        "978-1-54-782301-5",
        4.2,
        true,
        [
            { reviewer: "Lila Thompson", rating: 5, date: "October 5, 2023", text: "A colorful and inspiring read for creatives." },
            { reviewer: "Aaron Patel", rating: 4, date: "September 20, 2023", text: "In-depth, though could use more examples." }
        ],
        [
            "Art is not a luxury; it is a necessity.",
            "Design breathes life into ideas."
        ],
        [
            { title: "Influence in Media", text: "How contemporary art shapes modern advertisements." },
            { title: "Author Background", text: "Marcus Chen is a celebrated designer and critic." }
        ]
      ),
      new Book(
        3,
        "A MILLION TO ONE",
        "High stakes and daring dreams collide in 'A Million to One,' where four skilled thieves orchestrate a breathtaking heist to steal a priceless artifact from the world's most secure vault. Every second counts, and betrayal lurks around every corner in this adrenaline-fueled thriller.",
        "booklist_image_3.jpg",
        ["Fiction", "Thriller", "Heist"],
        "Sophia Washington",
        "Enigma Books",
        "January 22, 2023",
        398,
        "English",
        "978-0-57-129087-3",
        4.7,
        true,
        [
            { reviewer: "Ben Crawford", rating: 5, date: "February 2, 2023", text: "Heart-pounding till the very last page." },
            { reviewer: "Nina Park", rating: 4, date: "February 10, 2023", text: "Loved the characters, wished it was longer." }
        ],
        [
            "When the odds are a million to one, you make your own luck.",
            "Trust is the most dangerous currency."
        ],
        [
            { title: "Movie Adaptation", text: "Rumored film production announced for 2026." },
            { title: "Author Interview", text: "Sophia Washington discusses the heist genre." }
        ]
      ),
      new Book(
        4,
        "Harry Potter & the Cursed Child",
        "The magic lives on. 'Harry Potter & the Cursed Child' captures the struggles of adulthood, legacy, and the heavy burden of expectations. Join Harry, now a Ministry employee, and his son Albus as they navigate time, destiny, and the shadows of their past.",
        "booklist_image_4.jpg",
        ["Fiction", "Fantasy", "Magic"],
        "J.K. Rowling, John Tiffany, Jack Thorne",
        "Scholastic",
        "July 31, 2016",
        320,
        "English",
        "978-1-33-821666-0",
        4.3,
        false,
        [
            { reviewer: "Rachel Moore", rating: 4, date: "August 10, 2016", text: "Nostalgic yet refreshing for Potter fans." },
            { reviewer: "Tom Evans", rating: 3.5, date: "August 15, 2016", text: "Different format but still magical." }
        ],
        [
            "The past is never where you think you left it.",
            "Sometimes, darkness comes from unexpected places."
        ],
        [
            { title: "Stage Production", text: "Award-winning performances across London and Broadway." },
            { title: "Script Format", text: "Written as a two-part play script." }
        ]
      ),
      new Book(
        5,
        "Lone Wolf Adventure",
        "When nature is both your adversary and only companion, survival is a daily battle. 'Lone Wolf Adventure' thrusts readers into the unforgiving wilderness of Alaska, where one man's endurance, wit, and resilience are pushed to the limits.",
        "booklist_image_5.jpg",
        ["Fiction", "Adventure", "Survival"],
        "Jack Forrester",
        "Wilderness Press",
        "May 12, 2023",
        276,
        "English",
        "978-0-99-876543-2",
        4.1,
        true,
        [
            { reviewer: "Chris Nolan", rating: 4, date: "June 5, 2023", text: "Gripping and vividly descriptive." },
            { reviewer: "Olivia Brooks", rating: 4.5, date: "June 8, 2023", text: "You can almost feel the cold winds!" }
        ],
        [
            "The wild only respects the prepared.",
            "Sometimes, solitude is the greatest challenge."
        ],
        [
            { title: "Research Trip", text: "Inspired by the author's own Alaskan expedition." },
            { title: "Survival Tips", text: "Appendix includes real survival techniques." }
        ]
      ),
      new Book(
        6,
        "Tess of the Road",
        "A young woman's journey of self-discovery as she breaks free from societal constraints in a fantasy world.",
        "booklist_image_6.jpg",
        ["Fiction", "Fantasy", "Coming of Age"],
        "Rachel Hartman",
        "Random House",
        "February 27, 2018",
        512,
        "English",
        "978-1-10-193136-0",
        4.4,
        true,
        [
          { reviewer: "Samantha Lee", rating: 5, date: "March 12, 2025", text: "A heartfelt, empowering adventure." },
          { reviewer: "Daniel Cruz", rating: 4, date: "February 27, 2025", text: "Beautifully written and deeply moving." }
        ],
        [
          "The road is long, but it belongs to you.",
          "Bravery often looks like stubbornness."
        ],
        [
          { title: "Publication History", text: "First published in 2018 by Random House." },
          { title: "Critical Reception", text: "Praised for its depth and powerful heroine." }
        ]
      ),
      new Book(
        7,
        "Aetherbound",
        "A sci-fi adventure about a girl with magical abilities who escapes life on a generation ship.",
        "booklist_image_7.jpg",
        ["Fiction", "Science Fiction", "Space"],
        "E.K. Johnston",
        "Dutton Books",
        "May 25, 2021",
        304,
        "English",
        "978-0-73-522983-1",
        4.0,
        true,
        [
          { reviewer: "Olivia Adams", rating: 4, date: "June 10, 2025", text: "A refreshing blend of magic and sci-fi." },
          { reviewer: "Leo Smith", rating: 4, date: "May 30, 2025", text: "Engaging and imaginative space adventure." }
        ],
        [
          "Freedom is not a luxury; it's a necessity.",
          "The stars remember every dream you've ever had."
        ],
        [
          { title: "Story Background", text: "Set aboard a generation ship where society is tightly controlled." },
          { title: "Author's Inspiration", text: "Inspired by classic space operas and coming-of-age tales." }
        ]
      ),
      new Book(
        8,
        "Ashford List",
        "A historical mystery set in Victorian London, where a detective uncovers a conspiracy tied to a mysterious list.",
        "booklist_image_8.jpg",
        ["Fiction", "Mystery", "Historical"],
        "Victoria Pemberton",
        "Quill & Ink",
        "October 3, 2022",
        412,
        "English",
        "978-2-44-556677-8",
        4.6,
        true,
        [
          { reviewer: "Charlotte Mills", rating: 5, date: "November 5, 2025", text: "Gripping and atmospheric!" },
          { reviewer: "Henry Dalton", rating: 4, date: "October 20, 2025", text: "A compelling mystery with rich details." }
        ],
        [
          "Secrets never stay buried forever.",
          "Every clue tells a story — if you know how to listen."
        ],
        [
          { title: "Setting Details", text: "Takes place in Victorian-era London, filled with intrigue." },
          { title: "Detective's Methods", text: "Relies heavily on deduction and intuition." }
        ]
      ),
      new Book(
        9,
        "The Old You",
        "A psychological thriller about identity and memory loss that keeps readers guessing until the final page.",
        "booklist_image_9.jpg",
        ["Fiction", "Thriller", "Psychological"],
        "Louise Voss",
        "Orenda Books",
        "May 15, 2020",
        300,
        "English",
        "978-1-91-221321-5",
        4.2,
        true,
        [
          { reviewer: "Megan Cross", rating: 4, date: "June 15, 2025", text: "Twists you won't see coming." },
          { reviewer: "Jonas Field", rating: 5, date: "May 25, 2025", text: "A chilling, thought-provoking thriller." }
        ],
        [
          "Memories can be the cruelest liars.",
          "Trust is the most fragile thing of all."
        ],
        [
          { title: "Psychological Themes", text: "Explores the tension between identity and memory." },
          { title: "Reader's Guide", text: "Prepare for a rollercoaster of twists and reveals." }
        ]
      ),
      new Book(
        10,
        "Hide And Seek",
        "A chilling horror story about an abandoned orphanage and the secrets hidden within its walls.",
        "booklist_image_10.jpg",
        ["Fiction", "Horror", "Supernatural"],
        "Richard Parker",
        "Midnight Press",
        "June 6, 2022",
        284,
        "English",
        "978-3-22-987654-1",
        3.9,
        true,
        [
          { reviewer: "Ava Monroe", rating: 4, date: "July 2, 2025", text: "Spine-tingling and atmospheric horror." },
          { reviewer: "Ethan Carter", rating: 3, date: "June 15, 2025", text: "Creepy but a bit slow at times." }
        ],
        [
          "Some games should never be played.",
          "Walls remember the screams they once heard."
        ],
        [
          { title: "Setting", text: "An abandoned orphanage serves as the terrifying backdrop." },
          { title: "Horror Elements", text: "Blends supernatural horror with psychological dread." }
        ]
      ),
      new Book(
        11,
        "SOUL",
        "A philosophical exploration of consciousness and what makes us human in the age of artificial intelligence.",
        "booklist_image_11.jpg",
        ["Non-Fiction", "Philosophy", "Science"],
        "Dr. Anita Sharma",
        "Cerebral Publications",
        "April 11, 2023",
        230,
        "English",
        "978-5-11-223344-5",
        4.8,
        true,
        [
          { reviewer: "Lucas Wright", rating: 5, date: "May 1, 2025", text: "Profound and deeply moving examination of humanity." },
          { reviewer: "Sophia Ray", rating: 5, date: "April 20, 2025", text: "Challenges your perception of self and consciousness." }
        ],
        [
          "To know yourself is the greatest journey.",
          "Consciousness is both the mirror and the reflection."
        ],
        [
          { title: "Philosophical Focus", text: "Discusses the essence of consciousness in the modern world." },
          { title: "Scientific Insights", text: "Incorporates the latest AI and neuroscience research." }
        ]
      ),
      new Book(
        12,
        "The way of the Nameless",
        "An epic fantasy adventure following a hero without a name who must restore balance to a world in chaos.",
        "booklist_image_12.jpg",
        ["Fiction", "Fantasy", "Epic"],
        "Kai Zhang",
        "Mythic Books",
        "November 17, 2022",
        534,
        "English",
        "978-8-77-665544-3",
        4.5,
        true,
        [
          { reviewer: "Isabella Grey", rating: 5, date: "December 5, 2025", text: "Epic in every sense. Truly unforgettable." },
          { reviewer: "Mason Hill", rating: 4, date: "November 25, 2025", text: "Rich world-building and complex hero." }
        ],
        [
          "A name does not define your destiny.",
          "In chaos, only purpose can guide the way."
        ],
        [
          { title: "World-Building", text: "Features a sprawling world filled with ancient magic and political intrigue." },
          { title: "Hero's Journey", text: "Follows the classic hero's arc with a fresh twist." }
        ]
      ),
      new Book(
        13,
        "Quantum Horizons",
        "A fascinating journey through the bizarre realities of quantum physics and its implications for our universe.",
        "placeholder_book.jpg",
        ["Non-Fiction", "Science", "Physics"],
        "Dr. Richard Feynmann",
        "Cosmos Press",
        "January 5, 2023",
        288,
        "English",
        "978-0-12-345678-9",
        4.7,
        true,
        [
          { reviewer: "Natalie Foster", rating: 5, date: "February 1, 2025", text: "Made complex ideas surprisingly understandable." },
          { reviewer: "Victor Han", rating: 5, date: "January 20, 2025", text: "An exhilarating dive into quantum wonders." }
        ],
        [
          "Reality is stranger than imagination.",
          "Every particle holds a universe within."
        ],
        [
          { title: "Quantum Concepts", text: "Explores entanglement, uncertainty, and quantum worlds." },
          { title: "Educational Approach", text: "Written to make quantum physics accessible to all readers." }
        ]
      ),
      new Book(
        14,
        "The Last Frontier",
        "A historical account of the final days of the American frontier and the closing of the Wild West.",
        "placeholder_book.jpg",
        ["Non-Fiction", "History", "American"],
        "Thomas Westwood",
        "Heritage Publications",
        "August 22, 2022",
        412,
        "English",
        "978-1-23-456789-0",
        4.3,
        true,
        [
          { reviewer: "James Porter", rating: 4, date: "September 15, 2025", text: "Rich with fascinating historical detail." },
          { reviewer: "Caroline Swift", rating: 4, date: "August 30, 2025", text: "A vivid portrayal of the end of an era." }
        ],
        [
          "Frontiers end, but stories endure.",
          "The spirit of the West can never be tamed."
        ],
        [
          { title: "Historical Accuracy", text: "Draws from letters, diaries, and firsthand accounts." },
          { title: "American Expansion", text: "Covers the cultural and political impacts of the frontier's end." }
        ]
      ),
      new Book(
        15,
        "Whispers in the Dark",
        "A collection of chilling short stories that explore the darkest corners of the human psyche.",
        "placeholder_book.jpg",
        ["Fiction", "Horror", "Short Stories"],
        "Miranda Black",
        "Shadowfall Press",
        "October 31, 2022",
        276,
        "English",
        "978-2-34-567890-1",
        4.1,
        true,
        [
          { reviewer: "Liam Drake", rating: 4, date: "November 2, 2025", text: "Creepy and thought-provoking tales." },
          { reviewer: "Ella Monroe", rating: 4, date: "October 31, 2025", text: "Perfect for a dark and stormy night." }
        ],
        [
          "Fear is the oldest story of all.",
          "Not every whisper should be heard."
        ],
        [
          { title: "Story Collection", text: "Features 15 unsettling tales ranging from gothic to psychological horror." },
          { title: "Themes", text: "Explores fear, loss, and the unknown." }
        ]
      )    
    ];
  
    // Store the books in local storage
    localStorage.setItem('books', JSON.stringify(books));
  }
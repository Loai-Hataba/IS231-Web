# Conquista Beblio

A comprehensive web application developed as part of the IS231 course, focusing on full-stack development using Django for the backend and modern frontend technologies.

## Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [Technologies Used](#technologies-used)
* [Project Structure](#project-structure)
* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

## Project Overview

The Conquista Beblio project is designed to manage a library system, allowing users to browse, borrow, and manage books. It integrates a Django backend with a responsive frontend to provide a seamless user experience.

## Features

* **User Authentication**: Secure login and registration system.
* **Book Management**: Add, update, delete, and view books.
* **Responsive Design**: Ensures usability across various devices.
* **Admin Interface**: Django's built-in admin panel for managing data.

## Technologies Used

* **Backend**: Django (Python)
* **Frontend**: HTML, CSS, JavaScript
* **Database**: SQLite
* **Version Control**: Git

## Project Structure

```
Conquista-Beblio/
├── backend/                 # Backend Django project
│   ├── core/                # Core Django settings and configurations
│   ├── static/              # Static files for the backend
│   ├── templates/           # Templates for the backend
│   ├── manage.py            # Django management script
│   └── db.sqlite3           # SQLite database
├── frontend/                # Frontend assets
│   ├── AdminPanel/          # Admin panel-related files
│   ├── BookDetails/         # Book details page assets
│   ├── BookList/            # Book list page assets
│   ├── PaymentMethod/       # Payment-related assets
│   ├── Sign up & Log in & About Us/ # Authentication and informational pages
│   ├── js/                  # Shared JavaScript files
│   ├── utils/               # Utility scripts and styles
│   └── assets/              # Shared assets like images
├── README.md                # Project documentation
└── .gitignore               # Git ignore rules
```

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Abdallah229/Conquista-Beblio.git
   cd Conquista-Beblio
   ```

2. **Create a virtual environment**:

   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Apply migrations**:

   ```bash
   python manage.py migrate
   ```

5. **Run the development server**:

   ```bash
   python manage.py runserver
   ```

6. **Access the application**:
   Open your browser and navigate to `http://127.0.0.1:8000/`

## Usage

* **Admin Panel**: Access via `http://127.0.0.1:8000/admin/` to manage users and books.
* **User Interface**: Browse and search for books, manage your profile, and borrow books.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

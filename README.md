# Book Review API

A RESTful API for managing books, user reviews, and authentication built with Node.js, Express, and MongoDB.

## 📚 Overview

This API provides endpoints for managing a book collection and user reviews. It includes functionality for:

- User authentication (signup/login)
- Book management (create, update, retrieve, search)
- Review system (create, update, delete reviews)
- Filtering and pagination

## 🛠️ Technologies

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB/Mongoose** - Database and ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm run start
   ```

## 🔑 Authentication

The API uses JWT for authentication. To access protected endpoints:

1. Register a new user or login
2. Include the JWT token in the Authorization header:
   ```
   Authorization: Bearer your_token_here
   ```

## 📋 API Endpoints

### Authentication

- **POST /signup** - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST /login** - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Books

- **POST /books** - Create a new book (protected)
  ```json
  {
    "title": "Book Title",
    "author": "Author Name",
    "genre": "Fiction",
    "description": "Book description",
    "coverImage": "image_url",
    "publishedDate": "2020-08-13T00:00:00.000Z"
  }
  ```

- **PUT /books/:id** - Update a book (protected)
  ```json
  {
    "title": "Updated Title",
    "author": "Author Name",
    "genre": "Fiction",
    "description": "Updated description",
    "coverImage": "image_url",
    "publishedDate": "2020-08-13T00:00:00.000Z"
  }
  ```

- **GET /books** - Get all books with pagination and filtering
  - Query parameters:
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 5)
    - `author`: Filter by author (supports comma-separated list, exact match required)
    - `genre`: Filter by genre (supports comma-separated list, exact match required)

- **GET /books/:id** - Get a specific book with its reviews
  - Query parameters:
    - `page`: Page number for reviews (default: 1)
    - `limit`: Reviews per page (default: 5)

- **GET /search** - Search books by title or author
  - Query parameters:
    - `query`: Search query (required)
    - `page`: Page number (default: 1)
    - `limit`: Items per page (default: 5)

### Reviews

- **POST /books/:id/reviews** - Add a review to a book (protected)
  ```json
  {
    "rating": 4,
    "comment": "Great book!"
  }
  ```

- **PUT /books/:id/reviews** - Update a review (protected)
  ```json
  {
    "rating": 5,
    "comment": "Updated comment"
  }
  ```

- **DELETE /books/:id/reviews** - Delete a review (protected)

## 📝 Response Format

Most endpoints return data in the following format:

```json
{
  "message": "Success message",
  "data": {
    // Response data
  }
}
```

For paginated results:

```json
{
  "books": [...],
  "totalBooks": 20,
  "totalPages": 4,
  "currentPage": 1,
  "nextPageAvailable": true,
  "previousPageAvailable": false
}
```

For book details with reviews:

```json
{
  "book": {
    "id": "book_id",
    "title": "Book Title",
    "author": "Author Name",
    "genre": "Fiction",
    "description": "Description",
    "coverImage": "image_url",
    "publishedDate": "2023-01-01"
  },
  "averageRating": 4.5,
  "metaReviews": {
    "reviews": [...],
    "totalReviews": 10,
    "totalPages": 2,
    "currentPage": 1,
    "nextPageAvailable": true,
    "previousPageAvailable": false
  }
}
```

## ⚠️ Error Handling

Errors are returned in a consistent format:

```json
{
  "message": "Error message",
  "error": "Error details (development only)" 
}
```

## 📁 Project Structure

```
├── index.js          # Entry point
├── secrets.js        # Secrets config file
├── db.js             # Database connection
├── package.json      # Project dependencies
├── src/
│   ├── controllers/  # Request handlers
│   ├── models/       # Database models
│   ├── middlewares/  # Custom middlewares
│   └── routes/       # API routes
```

## </> Postman API

To access this API via Postman, [Visit Here](https://www.postman.com/rebel-epoch/workspace/book-review-api/collection/31834944-811e4aae-8bd6-430f-a6b4-da4929b7249f)


## </> Github repository

To access the source code, [Visit Here](https://www.postman.com/rebel-epoch/workspace/book-review-api/collection/31834944-811e4aae-8bd6-430f-a6b4-da4929b7249f)

## 👨‍💻 Author

[Aditya Singh](https://www.adidecodes.com)
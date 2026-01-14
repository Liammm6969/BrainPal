# StudyBuddy Backend

This is the **backend server** for the StudyBuddy application, built with **Node.js, Express, MongoDB Atlas**, and **JWT authentication**.  
It handles **user authentication, data storage, and API endpoints** for the StudyBuddy frontend.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available API Routes](#available-api-routes)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [License](#license)

---

## Features
- User **Sign-Up** and **Sign-In** with JWT authentication
- Password security (hashed)  
- Integration with **MongoDB Atlas**
- Ready for future features:
  - Study notes management  
  - Quiz tracking  
  - Topic focus analytics  

---

## Tech Stack
- **Backend:** Node.js, Express  
- **Database:** MongoDB Atlas  
- **Authentication:** JWT (JSON Web Token)  
- **Other Packages:** Mongoose, dotenv, bcrypt, passport (optional)  

---

## Getting Started

### Prerequisites
- Node.js v18+  
- npm v9+  
- MongoDB Atlas account  
- Postman (for API testing)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/your-username/studybuddy-backend.git
cd studybuddy-backend

    Install dependencies:

npm install

    Create a .env file in the root directory (see next section)

    Run the server (development mode):

npm run dev

    The server runs by default on http://localhost:5000.

Environment Variables

Create a .env file with the following variables:

PORT=5000
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

    MONGO_URI: MongoDB connection string from Atlas

    JWT_SECRET: Secret key to sign JWT tokens

    JWT_EXPIRES_IN: Token expiration (e.g., 1d for 1 day)

Available API Routes
Auth Routes
Method	Endpoint	Description	Body Example
POST	/api/auth/signup	Register new user	{ "name": "John Doe", "email": "john@example.com", "password": "123456" }
POST	/api/auth/login	Login user	{ "email": "john@example.com", "password": "123456" }

✅ Responses include a JWT token for authenticated routes.
Protected Routes (Future)

    /api/notes → Create, Read, Update, Delete study notes

    /api/quizzes → Track quizzes and results

    /api/topics → User focus analytics

Testing

    Use Postman or Insomnia to test API endpoints

    Example Postman workflow:

        Sign up a new user

        Sign in to receive JWT token

        Use token in Authorization header (Bearer <token>) for protected routes

Project Structure

studybuddy-backend/
├── controllers/      # Route handlers
│   └── authController.js
├── models/           # Mongoose models
│   └── User.model.js
├── routes/           # Express routes
│   └── authRoutes.js
├── utils/            # Helper functions (e.g., token generator)
├── .env
├── .gitignore
├── package.json
└── server.js

License

This project is licensed under the MIT License.

Notes

    Passwords should ideally be hashed (bcrypt) before saving to the database.

    Add more routes and controllers as your StudyBuddy features grow.

    MongoDB Atlas makes it easy to scale your database without running it locally.
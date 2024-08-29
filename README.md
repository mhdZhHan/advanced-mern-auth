# 🚀 Advanced MERN Authentication

Welcome to the **Advanced MERN Authentication!** This project provides a robust authentication system built with the MERN (**MongoDB**, **Express**, **React**, **Node.js**) stack. It includes essential features like user registration, `login`, `logout`, `email` `verification`, and `password management`.

## 🌟 Features

-   **🔒 Check Authentication** (`/check-auth`): Verify if the user is authenticated.
-   **📝 Sign up** (`/signup`): Register a new user account.
-   **🔐 Login** (`/login`): Authenticate and log in a user.
-   **🚪 Logout** (`/logout`): Log out the user by invalidating the session/token.
-   **📧 Email Verification** (`/verify-email`): Verify a user's email address.
-   **🔑 Forgot Password** (`/forgot-password`): Initiate the password reset process.
-   **🔄 Reset Password** (`/reset-password/:token`): Reset the user's password using a secure token.
-   **🍪 Generate Token and Set Cookie**: Creates a JWT token and securely sets it in a cookie.
-   **🚀 Frontend Pages**: Includes frontend pages such as `Sign Up`, `Login`, `Dashboard`, `Forgot Password`, `Reset Password`, and `Email Verification`.
-   **📦 State Management**: The project uses `Zustand` for state management to handle user authentication state.
-   **⚡ API Integration**: `Axios` is used for seamless integration with the authentication API.
-   **🎨 UI Enhancements**: `Tailwind CSS` is used for modern and responsive styling, while `Framer Motion` adds smooth animations and transitions for a dynamic user experience.

## 🛠️ Installation

Clone the repository:

```bash
git clone https://github.com/mhdZhHan/advanced-mern-auth.git
cd advanced-mern-auth
```

## Install dependencies and build the app:

```bash
npm run build
```

## Set up environment variables:

Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URL="" # MongoDB connection string
JWT_SECRET="" # Secret key for JWT signing
NODE_ENV="development" # Set to "production" in a live environment
MAILTRAP_TOKEN="" # Mailtrap API token for sending emails
MAILTRAP_ENDPOINT="" # Mailtrap API endpoint for email services
CLIENT_URL="http://localhost:5173" # URL of the React frontend application
```

## Run the application:

```bash
npm run start
```

Your server should now be running on `http://localhost:5000`.

## 🔗 API Endpoints

The authentication-related API endpoints are available under the `/api/auth` base URL. Here are the available routes:

-   **GET** `/api/auth/check-auth`: Verifies if the user is authenticated by checking the token.
-   **POST** `/api/auth/signup`: Registers a new user and sends an email verification link.
-   **POST** `/api/auth/login`: Logs in the user and returns a JWT token.
-   **POST** `/api/auth/logout`: Logs out the user by clearing the session.
-   **POST** `/api/auth/verify-email`: Verifies the user's email address with a token.
-   **POST** `/api/auth/forgot-password`: Sends a password reset link to the user's email.
-   **POST** `/api/auth/reset-password/:token`: Resets the user's password using the provided token.

## 🚀 Technologies Used

-   **MongoDB**: Database for storing user information.
-   **Express**: Web framework for handling routes and middleware.
-   **React**: Frontend framework for creating the client-side application (not included in this repo).
-   **Node.js**: Backend runtime environment.
-   **JSON Web Tokens (JWT)**: For secure user authentication.
-   **Mailtrap**: Service for sending emails (used for email verification and password reset).
-   **Zustand**: State management library for handling user authentication state.
-   **Axios**: HTTP client for making API requests.
-   **Tailwind CSS**: Utility-first CSS framework for modern and responsive styling.
-   **Framer Motion**: Library for adding smooth animations and transitions for enhanced UI interactions.

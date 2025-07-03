# LMS Frontend Documentation

This document provides an overview of the LMS frontend application, its structure, and a guide for new developers.

## Project Structure

The project is a [Remix](https://remix.run/) application, and the structure follows its conventions.

```
lmsfrontend/
├── app/
│   ├── api/
│   │   ├── auth.tsx       # Authentication related functions (login, register).
│   │   └── http.tsx       # HTTP client setup (e.g., Axios or Fetch wrapper).
│   ├── routes/
│   │   ├── _index.tsx     # Landing page route.
│   │   ├── dashboard.tsx  # Main dashboard for logged-in users.
│   │   ├── login.tsx      # Login page and form handling.
│   │   ├── logout.tsx     # Handles user logout.
│   │   └── register.tsx   # Registration page and form handling.
│   ├── entry.client.tsx   # Client-side entry point.
│   ├── entry.server.tsx   # Server-side entry point.
│   ├── root.tsx           # The root component of the application, defines global layout.
│   ├── session.server.ts  # Server-side session management.
│   └── tailwind.css       # Main CSS file for Tailwind.
├── public/
│   ├── favicon.ico
│   └── ...              # Static assets like images, fonts.
├── .eslintrc.cjs          # ESLint configuration.
├── package.json           # Project dependencies and scripts.
├── tailwind.config.ts     # Tailwind CSS configuration.
├── tsconfig.json          # TypeScript configuration.
└── vite.config.ts         # Vite configuration.
```

## Developer's Guide

This guide will help you understand the key parts of the application.

### 1. Authentication Flow

1.  **Registration (`/register`):** A new user signs up through the form in `app/routes/register.tsx`. The form data is sent to a Remix `action` function, which calls the authentication logic in `app/api/auth.tsx`.
2.  **Login (`/login`):** The user logs in via the form in `app/routes/login.tsx`. This also triggers an `action` that uses `app/api/auth.tsx` to verify credentials.
3.  **Session Management:** Upon successful login, a user session is created using the functions in `app/session.server.ts`. This session is used to protect routes and store user data.
4.  **Protected Routes:** The `dashboard.tsx` route is an example of a protected route. It will use a Remix `loader` function to check for an active session. If no session exists, the user is redirected to `/login`.
5.  **Logout (`/logout`):** This route clears the user session and redirects to the login page.

### 2. Adding a New Page (Route)

To add a new page, follow the Remix convention:

1.  Create a new `.tsx` file inside the `app/routes/` directory. For example, to create a `/profile` page, create `app/routes/profile.tsx`.
2.  Export a default function for the component you want to render.
3.  If the page needs to load data from the server, export a `loader` function.
4.  If the page needs to handle form submissions, export an `action` function.

### 3. Making API Calls

-   The `app/api/http.tsx` file should contain a pre-configured instance of an HTTP client (like `axios` or a wrapper around `fetch`).
-   Use this client in your `loader` and `action` functions to communicate with your backend API.
-   Authentication tokens, if needed, should be retrieved from the user's session and added to the HTTP requests.
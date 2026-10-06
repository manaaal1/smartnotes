# SmartNotes

SmartNotes is a full-stack note-taking application that allows authenticated users to create, search, edit, and delete their personal notes.

The project was built with a React/TypeScript frontend and a Node.js/Express/TypeScript backend, using PostgreSQL for persistent data storage.

## Features

* User registration and login
* JWT-based authentication
* Password hashing with bcrypt
* Protected note routes
* Create notes
* View notes
* Edit notes
* Delete notes
* Search notes by title or content
* User-specific note access
* Logout
* Responsive user interface
* PostgreSQL database with Prisma ORM

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router
* Axios
* React Toastify

### Backend

* Node.js
* Express
* TypeScript
* Prisma ORM
* JSON Web Tokens (JWT)
* bcrypt

### Database

* PostgreSQL

## Project Structure

```text
smartnotes/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── app.ts
│       └── prisma.ts
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── pages/
│       ├── App.tsx
│       ├── App.css
│       └── main.tsx
│
└── README.md
```

## Architecture

SmartNotes follows a client-server architecture.

The React frontend communicates with the Express REST API through Axios. The backend handles authentication, authorization, validation, and database operations through Prisma.

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
Express Backend
      │
      │ Prisma ORM
      ▼
PostgreSQL Database
```

Authentication is handled using JSON Web Tokens. After registration or login, the frontend stores the token and automatically includes it in authenticated API requests.

## Authentication

Users can register with a name, email, and password.

Passwords are never stored as plain text. They are hashed using bcrypt before being stored in PostgreSQL.

After successful registration or login, the backend generates a JWT containing the authenticated user's ID.

Protected note endpoints require the token in the request's `Authorization` header:

```text
Authorization: Bearer <token>
```

The authentication middleware verifies the token before allowing access to note operations.

## API Endpoints

### Authentication

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register a new user     |
| POST   | `/api/auth/login`    | Log in an existing user |

### Notes

All note endpoints require authentication.

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/api/notes`     | Get the user's notes |
| GET    | `/api/notes/:id` | Get a specific note  |
| POST   | `/api/notes`     | Create a note        |
| PUT    | `/api/notes/:id` | Update a note        |
| DELETE | `/api/notes/:id` | Delete a note        |

### Search

Notes can be searched using the `search` query parameter:

```text
GET /api/notes?search=example
```

The search checks both the note title and content.

## Database Design

The application uses two main models.

### User

* `id`
* `name`
* `email`
* `password`
* `createdAt`

### Note

* `id`
* `title`
* `content`
* `userId`
* `createdAt`
* `updatedAt`

Each note belongs to one user, while a user can have multiple notes.

The relationship ensures that users can only access and modify their own notes.

## Technical Decisions

### Prisma

Prisma was used as the ORM to provide type-safe database access and make the database schema easier to manage.

### JWT Authentication

JWT was chosen for authentication because it provides a simple stateless mechanism for protecting REST API endpoints.

### Centralized Axios Configuration

The frontend uses a shared Axios instance. An interceptor automatically attaches the stored JWT to authenticated requests, avoiding repeated authentication-header logic throughout the application.

### User-Specific Data Access

Database queries include the authenticated user's ID when retrieving, updating, or deleting notes. This prevents users from accessing another user's notes even if they know a note ID.

### Component-Based Frontend

The React application separates reusable functionality into components such as the note form, note card, and search bar, while pages handle higher-level application views.

## Running the Project Locally

### Prerequisites

* Node.js
* npm
* PostgreSQL

### Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on your local PostgreSQL configuration:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/smartnotes_db"
PORT=5000
JWT_SECRET="your-secret-key"
```

Generate the Prisma client:

```bash
npx prisma generate
```

Apply the database schema:

```bash
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5000
```

### Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will be available at the local Vite URL shown in the terminal.

## Environment Variables

The backend requires the following environment variables:

| Variable       | Description                                          |
| -------------- | ---------------------------------------------------- |
| `DATABASE_URL` | PostgreSQL database connection string                |
| `PORT`         | Port used by the Express server                      |
| `JWT_SECRET`   | Secret used to sign and verify authentication tokens |

Environment files containing secrets are excluded from version control.

## Validation

The project has been tested for:

* User registration
* User login
* Authentication and protected routes
* Note creation
* Note retrieval
* Note search
* Note editing
* Note deletion
* Logout
* Frontend production build
* Backend TypeScript compilation

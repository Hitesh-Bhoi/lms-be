# Leads Management System (LMS) - Backend API

Backend RESTful API service for the Leads Management System (LMS), built with Node.js, Express, TypeScript, and MongoDB (Mongoose). It provides secure administrator authentication, full lead lifecycle management with filtering/pagination, and contextual note tracking.

---

## Features

- **Authentication & Authorization**: JWT-based administrator authentication via HTTP-only cookies or `Bearer` tokens.
- **Lead Management**: Full CRUD operations for leads with input validation and sanitization.
- **Filtering & Pagination**: Server-side search (name, email, phone), status filtering, and paginated results.
- **Notes System**: Add and paginate chronological notes attached to specific leads.
- **Atomic Operations**: Atomic deletion of leads and their associated notes using MongoDB sessions/transactions.
- **Centralized Error Handling**: Standardized JSON error responses for Mongoose validation/cast errors, JWT authentication failures, and bad requests.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Dev Tooling**: `tsx` & `nodemon`

---

## Project Structure

```
lms-be/
├── src/
│   ├── common/             # Enums, validation helpers, shared types
│   ├── config/             # Database and Express server bootstrap
│   ├── controllers/        # Route controllers (auth, leads, notes)
│   ├── middleware/         # Auth, validation, and centralized error handling
│   ├── models/             # Mongoose schemas & models (User, Lead, Note)
│   ├── routes/             # Express API routes
│   ├── services/           # Query filtering and pagination builders
│   └── index.ts            # Application entrypoint
├── .env.example            # Environment variables template
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)
- `npm` or `yarn`

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Hitesh-Bhoi/lms-be.git
cd lms-be
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your values:

```bash
cp .env.example .env
```

Example configuration (`.env`):

```env
PORT=5000
MONGO_URI="mongodb://localhost:27017/lms"
JWT_SECRET="supersecretjwtkey_lms_admin_2026"
JWT_EXPIRES_IN="24h"
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Server listening port | `5000` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://localhost:27017/lms` |
| `JWT_SECRET` | Secret key for signing JWT tokens | — |
| `JWT_EXPIRES_IN` | Token expiration period | `24h` |
| `CORS_ORIGINS` | Comma-separated list of allowed frontend origins | `http://localhost:3000` |

### 3. Run the Server

#### Development Mode (with hot-reload):
```bash
npm run dev
```

The server starts by default at `http://localhost:5000`.

#### Production Build:
```bash
# Compile TypeScript to JavaScript in /dist
npm run build

# Start production server
npm start
```

---

## API Documentation & Examples (cURL)

Base URL: `http://localhost:5000/api`

### 1. Authentication Endpoints

#### Admin Login
Authenticates admin credentials, sets an HTTP-only cookie `token`, and returns the JWT in the response body.

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "your_password"
  }'
```

**Response (200 OK):**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "admin": {
      "id": "6ac868bbe7e40ce253a9e33e",
      "email": "admin@gmail.com",
      "role": "admin"
    }
  },
  "message": "Login successful"
}
```

#### Get Current Profile
Fetches authenticated administrator details. Supports `Authorization: Bearer <TOKEN>` header or session cookie.

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

**Response (200 OK):**
```json
{
  "data": {
    "id": "6ac868bbe7e40ce253a9e33e",
    "email": "admin@gmail.com",
    "role": "admin"
  },
  "message": "Admin profile fetched successfully"
}
```

#### Admin Logout
Clears the authentication cookie.

```bash
curl -X POST http://localhost:5000/api/auth/logout
```

---

### 2. Leads Endpoints

> **Note:** All `/api/leads` routes require admin authentication (`Authorization: Bearer <TOKEN>` or auth cookie).

#### Create a Lead
Status options: `New` (default), `Contacted`, `Qualified`, `Lost`.

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1 (555) 234-5678",
    "status": "New"
  }'
```

**Response (201 Created):**
```json
{
  "data": {
    "_id": "6ac8d86b9be9895c366fee26",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "phone": "+1 (555) 234-5678",
    "status": "New",
    "created_at": "2026-10-09T12:00:00.000Z",
    "updated_at": "2026-10-09T12:00:00.000Z"
  },
  "message": "Lead saved successfully"
}
```

#### Get All Leads (with Search, Status Filter & Pagination)

Query Parameters:
- `search`: Filter by name, email, or phone.
- `status`: Filter by lead status (`New`, `Contacted`, `Qualified`, `Lost`).
- `page`: Page number (default: `1`).
- `limit`: Records per page (default: `10`, max: `100`).

```bash
curl -X GET "http://localhost:5000/api/leads?search=jane&status=New&page=1&limit=10" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "_id": "6ac8d86b9be9895c366fee26",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "+1 (555) 234-5678",
      "status": "New",
      "created_at": "2026-10-09T12:00:00.000Z",
      "updated_at": "2026-10-09T12:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "message": "All lead records fetched successfully"
}
```

#### Get Lead by ID
```bash
curl -X GET http://localhost:5000/api/leads/6ac8d86b9be9895c366fee26 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

#### Update Lead
Supports both `PUT` and `PATCH`.

```bash
curl -X PUT http://localhost:5000/api/leads/6ac8d86b9be9895c366fee26 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Contacted"
  }'
```

#### Delete Lead
Deletes the lead and all associated notes atomically.

```bash
curl -X DELETE http://localhost:5000/api/leads/6ac8d86b9be9895c366fee26 \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

**Response (200 OK):**
```json
{
  "message": "Lead record deleted successfully"
}
```

---

### 3. Notes Endpoints

#### Add Note to a Lead
```bash
curl -X POST http://localhost:5000/api/leads/6ac8d86b9be9895c366fee26/notes \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Discussed product requirements during demo call."
  }'
```

**Response (201 Created):**
```json
{
  "data": {
    "_id": "6ac8e12b9be9895c366fee30",
    "lead_id": "6ac8d86b9be9895c366fee26",
    "content": "Discussed product requirements during demo call.",
    "created_at": "2026-10-09T12:10:00.000Z",
    "updated_at": "2026-10-09T12:10:00.000Z"
  },
  "message": "Note added successfully"
}
```

#### Get Notes for a Lead (Paginated)
```bash
curl -X GET "http://localhost:5000/api/leads/6ac8d86b9be9895c366fee26/notes?page=1&limit=5" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "_id": "6ac8e12b9be9895c366fee30",
      "lead_id": "6ac8d86b9be9895c366fee26",
      "content": "Discussed product requirements during demo call.",
      "created_at": "2026-10-09T12:10:00.000Z",
      "updated_at": "2026-10-09T12:10:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 5,
    "totalPages": 1
  },
  "message": "Notes fetched successfully"
}
```

---

## Error Handling Standards

All errors are returned in a consistent JSON format:

```json
{
  "message": "Descriptive error message"
}
```

### Common HTTP Status Codes

| Code | Meaning | Common Causes |
| :---: | :--- | :--- |
| `400` | Bad Request | Validation failure, malformed JSON body, invalid MongoDB ObjectId format |
| `401` | Unauthorized | Missing or expired token, invalid credentials |
| `403` | Forbidden | Insufficient permissions (non-admin role) |
| `404` | Not Found | Lead or user record not found |
| `500` | Internal Server Error | Unexpected database or server exception |

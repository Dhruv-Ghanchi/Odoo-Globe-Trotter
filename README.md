# Travel Planner Backend API

Backend API for Travel Planning Application - Built for Odoo Hiring Hackathon

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL (using `pg` driver)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## Project Structure

```
.
├── config/              # Configuration files
│   ├── config.js       # App configuration (env vars)
│   └── database.js       # PostgreSQL connection pool
├── controllers/         # Request handlers (HTTP logic)
├── middleware/          # Express middleware
│   ├── auth.js         # JWT authentication
│   ├── errorHandler.js # Centralized error handling
│   └── validation.js   # Input validation wrapper
├── routes/             # API route definitions
│   └── index.js        # Main router
├── services/           # Business logic & database operations
├── utils/              # Utility functions
│   ├── jwt.js         # JWT token helpers
│   └── password.js    # Password hashing helpers
├── app.js              # Express app setup
├── server.js           # Server entry point
├── schema.sql          # Database schema
├── package.json        # Dependencies
└── .env.example        # Environment variables template
```

## Architecture Overview

### Request Flow
```
Client Request
    ↓
Routes (routes/)
    ↓
Middleware (auth, validation)
    ↓
Controllers (controllers/)
    ↓
Services (services/)
    ↓
Database (config/database.js)
    ↓
Response
```

### Layer Responsibilities

- **Routes**: Define API endpoints and HTTP methods
- **Controllers**: Handle request/response, call services
- **Services**: Business logic, database queries
- **Middleware**: Authentication, validation, error handling
- **Utils**: Reusable helper functions

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb travel_planner

# Run schema
psql -d travel_planner -f schema.sql

# Seed test user (optional - for testing)
npm run seed:test-user
```

**Test User Credentials** (after running seed):
- Email: `test@example.com`
- Password: `password123`

### 3. Environment Configuration
```bash
# Copy example file
cp .env.example .env

# Edit .env with your database credentials
```

### 4. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## Environment Variables

See `.env.example` for all required variables:
- `PORT`: Server port (default: 3000)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database config
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: Token expiration (default: 7d)
- `CORS_ORIGIN`: Allowed CORS origins

## API Endpoints

### Health Check
- `GET /api/health` - Server status

*More endpoints will be added as features are implemented*

## Error Handling

All errors are handled centrally through `middleware/errorHandler.js`:
- Consistent error response format
- PostgreSQL error code mapping
- JWT error handling
- Development vs production error details

## Authentication

JWT-based authentication:
- Use `middleware/auth.js` to protect routes
- Token in `Authorization: Bearer <token>` header
- User info attached to `req.user` after authentication

## Database Connection

Connection pool managed in `config/database.js`:
- Automatic connection pooling
- Query logging in development
- Graceful error handling

## Next Steps

1. Implement user registration/login endpoints
2. Implement trip CRUD operations
3. Implement activity CRUD operations
4. Add input validation rules
5. Add unit tests



# Project Structure Documentation

## Folder Organization

```
travel-planner-backend/
│
├── config/                    # Configuration modules
│   ├── config.js             # Centralized config (env vars)
│   └── database.js           # PostgreSQL connection pool
│
├── controllers/              # HTTP request handlers
│   └── index.js             # Controller exports (placeholder)
│
├── middleware/               # Express middleware
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Centralized error handling
│   └── validation.js        # Input validation wrapper
│
├── routes/                   # API route definitions
│   └── index.js             # Main router (combines all routes)
│
├── services/                 # Business logic layer
│   └── index.js             # Service exports (placeholder)
│
├── utils/                    # Utility functions
│   ├── jwt.js               # JWT token generation/verification
│   └── password.js          # Password hashing/verification
│
├── scripts/                  # Utility scripts
│   └── init-db.js           # Database initialization script
│
├── app.js                    # Express app configuration
├── server.js                 # Server entry point
├── schema.sql                # PostgreSQL database schema
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

## File Responsibilities

### Core Application Files

**server.js**
- Server entry point
- Starts HTTP server
- Initializes database connection
- Handles graceful shutdown

**app.js**
- Express app setup
- Middleware configuration (CORS, body parsing)
- Route mounting
- Error handling setup

### Configuration

**config/config.js**
- Loads and validates environment variables
- Provides default values
- Exports centralized config object

**config/database.js**
- PostgreSQL connection pool setup
- Query helper functions
- Connection testing utilities

### Middleware

**middleware/auth.js**
- `authenticate`: Required JWT authentication
- `optionalAuth`: Optional JWT authentication
- Attaches user info to `req.user`

**middleware/errorHandler.js**
- `AppError`: Custom error class
- `errorHandler`: Centralized error handling
- `notFoundHandler`: 404 handler
- Maps database errors to HTTP status codes

**middleware/validation.js**
- `validate`: Wrapper for express-validator
- Formats validation errors consistently

### Utilities

**utils/jwt.js**
- `generateToken`: Create JWT tokens
- `verifyToken`: Verify and decode tokens

**utils/password.js**
- `hashPassword`: Hash passwords with bcrypt
- `verifyPassword`: Compare password with hash

### Routes

**routes/index.js**
- Main API router
- Combines all route modules
- Health check endpoint

## Architecture Principles

1. **Separation of Concerns**
   - Routes: HTTP routing
   - Controllers: Request/response handling
   - Services: Business logic
   - Database: Data access

2. **Middleware Chain**
   - Authentication → Validation → Controller → Service → Database

3. **Error Handling**
   - All errors flow through centralized handler
   - Consistent error response format
   - Development vs production error details

4. **Database Access**
   - Connection pooling for efficiency
   - Parameterized queries (SQL injection prevention)
   - Query logging in development

## Adding New Features

### Example: Adding a User Feature

1. **Service** (`services/userService.js`)
   ```javascript
   // Business logic and database queries
   export const createUser = async (email, passwordHash) => { ... }
   ```

2. **Controller** (`controllers/userController.js`)
   ```javascript
   // HTTP request/response handling
   export const register = async (req, res, next) => { ... }
   ```

3. **Routes** (`routes/userRoutes.js`)
   ```javascript
   // Define endpoints
   router.post('/register', validationRules, validate, userController.register);
   ```

4. **Mount in** `routes/index.js`
   ```javascript
   router.use('/users', userRoutes);
   ```

## Environment Variables

Required variables (see `.env.example`):
- `PORT`: Server port
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`: Secret for JWT signing
- `JWT_EXPIRES_IN`: Token expiration
- `CORS_ORIGIN`: Allowed origins

## Database Schema

See `schema.sql` for:
- `users`: Authentication data
- `trips`: Travel plans
- `activities`: Scheduled activities

Relationships:
- users (1) → (many) trips
- trips (1) → (many) activities



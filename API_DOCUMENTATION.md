# Authentication API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. POST /auth/signup

Register a new user account.

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTcwNTMyNDgwMCwiZXhwIjoxNzA1OTI5NjAwfQ..."
  }
}
```

**Error Responses:**

**400 Bad Request** - Validation error:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address"
      },
      {
        "field": "password",
        "message": "Password must be at least 6 characters long"
      }
    ]
  }
}
```

**409 Conflict** - Email already exists:
```json
{
  "success": false,
  "error": {
    "message": "Email already exists"
  }
}
```

**Validation Rules:**
- `email`: Required, must be valid email format
- `password`: Required, minimum 6 characters

---

### 2. POST /auth/login

Authenticate user and receive JWT token.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTcwNTMyNDgwMCwiZXhwIjoxNzA1OTI5NjAwfQ..."
  }
}
```

**Error Responses:**

**400 Bad Request** - Validation error:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

**401 Unauthorized** - Invalid credentials:
```json
{
  "success": false,
  "error": {
    "message": "Invalid email or password"
  }
}
```

**Validation Rules:**
- `email`: Required, must be valid email format
- `password`: Required, minimum 6 characters

---

### 3. GET /auth/me

Get current authenticated user's information.

**Request:**
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**

**401 Unauthorized** - Missing or invalid token:
```json
{
  "success": false,
  "error": {
    "message": "Authentication token required"
  }
}
```

**401 Unauthorized** - Expired token:
```json
{
  "success": false,
  "error": {
    "message": "Authentication token has expired"
  }
}
```

**404 Not Found** - User not found:
```json
{
  "success": false,
  "error": {
    "message": "User not found"
  }
}
```

---

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with JavaScript (Fetch API)

### Signup
```javascript
const response = await fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  }),
});

const data = await response.json();
console.log(data);
```

### Login
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  }),
});

const data = await response.json();
// Store token: localStorage.setItem('token', data.data.token);
```

### Get Current User
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:3000/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const data = await response.json();
console.log(data);
```

---

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt (10 salt rounds)
2. **JWT Tokens**: Secure token-based authentication
3. **Email Uniqueness**: Enforced at database level
4. **Input Validation**: All inputs validated before processing
5. **SQL Injection Prevention**: Parameterized queries
6. **Error Messages**: Generic error messages to prevent information leakage

---

## Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "error": {
    "message": "Error message here"
  }
}
```

Validation errors include detailed field information:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address"
      }
    ]
  }
}
```



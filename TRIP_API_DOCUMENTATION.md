# Trip Management API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All trip endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

**Important**: All trips are user-scoped. Users can only access and modify their own trips.

---

## Endpoints

### 1. POST /trips

Create a new trip.

**Request:**
```http
POST /api/trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Summer Vacation",
  "destination": "Paris, France",
  "start_date": "2024-06-01",
  "end_date": "2024-06-15"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Trip created successfully",
  "data": {
    "trip": {
      "id": 1,
      "user_id": 1,
      "title": "Summer Vacation",
      "destination": "Paris, France",
      "start_date": "2024-06-01",
      "end_date": "2024-06-15",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
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
        "field": "end_date",
        "message": "End date must be greater than or equal to start date"
      }
    ]
  }
}
```

**401 Unauthorized** - Missing or invalid token:
```json
{
  "success": false,
  "error": {
    "message": "Authentication token required"
  }
}
```

**Validation Rules:**
- `title`: Required, 1-255 characters
- `destination`: Required, 1-255 characters
- `start_date`: Required, valid ISO8601 date (YYYY-MM-DD)
- `end_date`: Required, valid ISO8601 date (YYYY-MM-DD), must be >= start_date

---

### 2. GET /trips

Get all trips for the authenticated user.

**Request:**
```http
GET /api/trips
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trips": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Summer Vacation",
        "destination": "Paris, France",
        "start_date": "2024-06-01",
        "end_date": "2024-06-15",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": 2,
        "user_id": 1,
        "title": "Winter Break",
        "destination": "Tokyo, Japan",
        "start_date": "2024-12-20",
        "end_date": "2024-12-30",
        "created_at": "2024-01-16T10:30:00.000Z",
        "updated_at": "2024-01-16T10:30:00.000Z"
      }
    ],
    "count": 2
  }
}
```

**Note**: Only returns trips owned by the authenticated user.

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

---

### 3. GET /trips/:id

Get a specific trip by ID.

**Request:**
```http
GET /api/trips/1
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trip": {
      "id": 1,
      "user_id": 1,
      "title": "Summer Vacation",
      "destination": "Paris, France",
      "start_date": "2024-06-01",
      "end_date": "2024-06-15",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**

**400 Bad Request** - Invalid trip ID:
```json
{
  "success": false,
  "error": {
    "message": "Invalid trip ID"
  }
}
```

**401 Unauthorized** - Missing or invalid token:
```json
{
  "success": false,
  "error": {
    "message": "Authentication token required"
  }
}
```

**403 Forbidden** - Trip belongs to another user:
```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to access this trip"
  }
}
```

**404 Not Found** - Trip not found:
```json
{
  "success": false,
  "error": {
    "message": "Trip not found"
  }
}
```

---

### 4. PUT /trips/:id

Update a trip. All fields are optional - only provided fields will be updated.

**Request:**
```http
PUT /api/trips/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Summer Vacation",
  "destination": "London, UK"
}
```

**Partial Update Example:**
```http
PUT /api/trips/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "end_date": "2024-06-20"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Trip updated successfully",
  "data": {
    "trip": {
      "id": 1,
      "user_id": 1,
      "title": "Updated Summer Vacation",
      "destination": "London, UK",
      "start_date": "2024-06-01",
      "end_date": "2024-06-15",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

**Error Responses:**

**400 Bad Request** - Validation error or invalid dates:
```json
{
  "success": false,
  "error": {
    "message": "End date must be greater than or equal to start date"
  }
}
```

**401 Unauthorized** - Missing or invalid token:
```json
{
  "success": false,
  "error": {
    "message": "Authentication token required"
  }
}
```

**403 Forbidden** - Trip belongs to another user:
```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to update this trip"
  }
}
```

**404 Not Found** - Trip not found:
```json
{
  "success": false,
  "error": {
    "message": "Trip not found"
  }
}
```

**Validation Rules:**
- `title`: Optional, if provided: 1-255 characters, cannot be empty
- `destination`: Optional, if provided: 1-255 characters, cannot be empty
- `start_date`: Optional, if provided: valid ISO8601 date
- `end_date`: Optional, if provided: valid ISO8601 date, must be >= start_date (or existing start_date)

---

### 5. DELETE /trips/:id

Delete a trip.

**Request:**
```http
DELETE /api/trips/1
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Trip deleted successfully"
}
```

**Error Responses:**

**400 Bad Request** - Invalid trip ID:
```json
{
  "success": false,
  "error": {
    "message": "Invalid trip ID"
  }
}
```

**401 Unauthorized** - Missing or invalid token:
```json
{
  "success": false,
  "error": {
    "message": "Authentication token required"
  }
}
```

**403 Forbidden** - Trip belongs to another user:
```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to delete this trip"
  }
}
```

**404 Not Found** - Trip not found:
```json
{
  "success": false,
  "error": {
    "message": "Trip not found"
  }
}
```

**Note**: Deleting a trip will cascade delete all associated activities (enforced at database level).

---

## SQL Queries Used

### Create Trip
```sql
INSERT INTO trips (user_id, title, destination, start_date, end_date) 
VALUES ($1, $2, $3, $4, $5) 
RETURNING id, user_id, title, destination, start_date, end_date, created_at, updated_at
```

### Get All User Trips
```sql
SELECT id, user_id, title, destination, start_date, end_date, created_at, updated_at 
FROM trips 
WHERE user_id = $1 
ORDER BY start_date DESC, created_at DESC
```

### Get Trip by ID
```sql
SELECT id, user_id, title, destination, start_date, end_date, created_at, updated_at 
FROM trips 
WHERE id = $1
```

### Update Trip (Dynamic)
```sql
UPDATE trips 
SET title = $1, destination = $2, updated_at = NOW() 
WHERE id = $3 
RETURNING id, user_id, title, destination, start_date, end_date, created_at, updated_at
```

### Delete Trip
```sql
DELETE FROM trips 
WHERE id = $1 
RETURNING id
```

---

## Ownership Checks

All endpoints implement ownership verification:

1. **GET /trips/:id**: 
   - Fetches trip from database
   - Compares `trip.user_id` with `req.user.userId`
   - Returns 403 if mismatch

2. **PUT /trips/:id**: 
   - Service layer verifies ownership before update
   - Compares `trip.user_id` with provided `userId`
   - Returns 403 if mismatch

3. **DELETE /trips/:id**: 
   - Service layer verifies ownership before deletion
   - Compares `trip.user_id` with provided `userId`
   - Returns 403 if mismatch

4. **GET /trips**: 
   - Automatically filtered by `user_id` in WHERE clause
   - Users can only see their own trips

5. **POST /trips**: 
   - Automatically sets `user_id` from authenticated user
   - No ownership check needed (user creates their own trip)

---

## Testing Examples

### Create Trip
```bash
curl -X POST http://localhost:3000/api/trips \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Vacation",
    "destination": "Paris, France",
    "start_date": "2024-06-01",
    "end_date": "2024-06-15"
  }'
```

### Get All Trips
```bash
curl -X GET http://localhost:3000/api/trips \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Specific Trip
```bash
curl -X GET http://localhost:3000/api/trips/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Trip
```bash
curl -X PUT http://localhost:3000/api/trips/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "destination": "London, UK"
  }'
```

### Delete Trip
```bash
curl -X DELETE http://localhost:3000/api/trips/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT token
2. **User Isolation**: Users can only access their own trips
3. **Ownership Verification**: Explicit checks prevent unauthorized access
4. **Input Validation**: All inputs validated before database operations
5. **SQL Injection Prevention**: Parameterized queries used throughout
6. **Date Validation**: Business rules enforced (end_date >= start_date)
7. **Cascade Deletes**: Database-level cascade ensures data integrity

---

## Error Handling

All errors follow consistent format:
```json
{
  "success": false,
  "error": {
    "message": "Error message here"
  }
}
```

Validation errors include field details:
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": [
      {
        "field": "end_date",
        "message": "End date must be greater than or equal to start date"
      }
    ]
  }
}
```



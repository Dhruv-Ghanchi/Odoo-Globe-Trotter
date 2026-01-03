# Activity Management API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All activity endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

**Important**: Activities are scoped through trips. Users can only access activities that belong to trips they own.

---

## Endpoints

### 1. POST /trips/:id/activities

Create a new activity for a trip.

**Request:**
```http
POST /api/trips/1/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2024-06-05",
  "time": "09:00",
  "title": "Visit Eiffel Tower",
  "description": "Morning visit to avoid crowds"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Activity created successfully",
  "data": {
    "activity": {
      "id": 1,
      "trip_id": 1,
      "date": "2024-06-05",
      "time": "09:00:00",
      "title": "Visit Eiffel Tower",
      "description": "Morning visit to avoid crowds",
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
        "field": "time",
        "message": "Time must be in HH:MM or HH:MM:SS format"
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

**Validation Rules:**
- `date`: Required, valid ISO8601 date (YYYY-MM-DD)
- `time`: Required, HH:MM or HH:MM:SS format (24-hour)
- `title`: Required, 1-255 characters
- `description`: Optional, max 2000 characters

---

### 2. GET /trips/:id/activities

Get all activities for a trip, ordered by date and time.

**Request:**
```http
GET /api/trips/1/activities
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": 1,
        "trip_id": 1,
        "date": "2024-06-05",
        "time": "09:00:00",
        "title": "Visit Eiffel Tower",
        "description": "Morning visit to avoid crowds",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-15T10:30:00.000Z"
      },
      {
        "id": 2,
        "trip_id": 1,
        "date": "2024-06-05",
        "time": "14:00:00",
        "title": "Lunch at Le Jules Verne",
        "description": null,
        "created_at": "2024-01-15T10:35:00.000Z",
        "updated_at": "2024-01-15T10:35:00.000Z"
      }
    ],
    "count": 2
  }
}
```

**Note**: Activities are sorted by date (ascending) and time (ascending).

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

### 3. PUT /activities/:id

Update an activity. All fields are optional - only provided fields will be updated.

**Request:**
```http
PUT /api/activities/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "time": "10:00",
  "title": "Updated Activity Title"
}
```

**Partial Update Example:**
```http
PUT /api/activities/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "Updated description"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Activity updated successfully",
  "data": {
    "activity": {
      "id": 1,
      "trip_id": 1,
      "date": "2024-06-05",
      "time": "10:00:00",
      "title": "Updated Activity Title",
      "description": "Morning visit to avoid crowds",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T11:00:00.000Z"
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
        "field": "time",
        "message": "Time must be in HH:MM or HH:MM:SS format"
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

**403 Forbidden** - Activity belongs to another user's trip:
```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to access this trip"
  }
}
```

**404 Not Found** - Activity not found:
```json
{
  "success": false,
  "error": {
    "message": "Activity not found"
  }
}
```

**Validation Rules:**
- `date`: Optional, if provided: valid ISO8601 date (YYYY-MM-DD)
- `time`: Optional, if provided: HH:MM or HH:MM:SS format (24-hour)
- `title`: Optional, if provided: 1-255 characters, cannot be empty
- `description`: Optional, if provided: max 2000 characters

---

### 4. DELETE /activities/:id

Delete an activity.

**Request:**
```http
DELETE /api/activities/1
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Activity deleted successfully"
}
```

**Error Responses:**

**400 Bad Request** - Invalid activity ID:
```json
{
  "success": false,
  "error": {
    "message": "Invalid activity ID"
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

**403 Forbidden** - Activity belongs to another user's trip:
```json
{
  "success": false,
  "error": {
    "message": "You do not have permission to access this trip"
  }
}
```

**404 Not Found** - Activity not found:
```json
{
  "success": false,
  "error": {
    "message": "Activity not found"
  }
}
```

---

## SQL Queries Used

### Create Activity
```sql
INSERT INTO activities (trip_id, date, time, title, description) 
VALUES ($1, $2, $3, $4, $5) 
RETURNING id, trip_id, date, time, title, description, created_at, updated_at
```

### Get Activities by Trip ID
```sql
SELECT id, trip_id, date, time, title, description, created_at, updated_at 
FROM activities 
WHERE trip_id = $1 
ORDER BY date ASC, time ASC
```

### Get Activity by ID
```sql
SELECT id, trip_id, date, time, title, description, created_at, updated_at 
FROM activities 
WHERE id = $1
```

### Update Activity (Dynamic)
```sql
UPDATE activities 
SET time = $1, title = $2, updated_at = NOW() 
WHERE id = $3 
RETURNING id, trip_id, date, time, title, description, created_at, updated_at
```

### Delete Activity
```sql
DELETE FROM activities 
WHERE id = $1 
RETURNING id
```

---

## Authorization Logic

All endpoints implement multi-level authorization:

### 1. POST /trips/:id/activities
**Authorization Flow:**
1. Verify JWT token (middleware)
2. Verify trip exists (`getTripById`)
3. Verify trip belongs to user (`trip.user_id === userId`)
4. Create activity

**Code:**
```javascript
// In createActivity service:
await verifyTripOwnership(tripId, userId); // Verifies trip exists and belongs to user
```

### 2. GET /trips/:id/activities
**Authorization Flow:**
1. Verify JWT token (middleware)
2. Verify trip exists and belongs to user
3. Fetch activities for trip

**Code:**
```javascript
// In getActivitiesByTripId service:
await verifyTripOwnership(tripId, userId); // Verifies trip exists and belongs to user
```

### 3. PUT /activities/:id
**Authorization Flow:**
1. Verify JWT token (middleware)
2. Fetch activity by ID
3. Verify activity exists
4. Verify activity's trip belongs to user
5. Update activity

**Code:**
```javascript
// In updateActivity service:
await verifyActivityOwnership(activityId, userId);
// Which internally:
//   1. Fetches activity
//   2. Verifies activity exists
//   3. Calls verifyTripOwnership(activity.trip_id, userId)
```

### 4. DELETE /activities/:id
**Authorization Flow:**
1. Verify JWT token (middleware)
2. Fetch activity by ID
3. Verify activity exists
4. Verify activity's trip belongs to user
5. Delete activity

**Code:**
```javascript
// In deleteActivity service:
await verifyActivityOwnership(activityId, userId);
// Which internally verifies trip ownership
```

### Helper Functions

**verifyTripOwnership(tripId, userId):**
- Fetches trip from database
- Returns 404 if trip not found
- Returns 403 if trip doesn't belong to user
- Returns trip object if valid

**verifyActivityOwnership(activityId, userId):**
- Fetches activity from database
- Returns 404 if activity not found
- Verifies trip ownership (calls verifyTripOwnership)
- Returns activity object if valid

---

## Relational Integrity

The system enforces relational integrity at multiple levels:

1. **Database Level:**
   - Foreign key constraint: `activities.trip_id → trips.id` with `ON DELETE CASCADE`
   - If a trip is deleted, all its activities are automatically deleted

2. **Application Level:**
   - All activity operations verify trip ownership
   - Activities cannot be created for non-existent trips
   - Activities cannot be accessed if their trip doesn't belong to the user

3. **Data Consistency:**
   - Activity dates are not validated against trip dates (activities can be scheduled outside trip dates if needed)
   - All operations use transactions where appropriate
   - Foreign key violations are caught and return appropriate errors

---

## Testing Examples

### Create Activity
```bash
curl -X POST http://localhost:3000/api/trips/1/activities \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-06-05",
    "time": "09:00",
    "title": "Visit Eiffel Tower",
    "description": "Morning visit to avoid crowds"
  }'
```

### Get All Activities for Trip
```bash
curl -X GET http://localhost:3000/api/trips/1/activities \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Activity
```bash
curl -X PUT http://localhost:3000/api/activities/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "time": "10:00",
    "title": "Updated Activity Title"
  }'
```

### Delete Activity
```bash
curl -X DELETE http://localhost:3000/api/activities/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Security Features

1. **JWT Authentication**: All endpoints require valid JWT token
2. **Multi-Level Authorization**: Activities are protected through trip ownership
3. **Ownership Verification**: Explicit checks prevent unauthorized access
4. **Input Validation**: All inputs validated before database operations
5. **SQL Injection Prevention**: Parameterized queries used throughout
6. **Relational Integrity**: Database constraints ensure data consistency
7. **Cascade Deletes**: Database-level cascade ensures orphaned activities are cleaned up

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
        "field": "time",
        "message": "Time must be in HH:MM or HH:MM:SS format"
      }
    ]
  }
}
```

---

## Common Use Cases

### Creating a Day's Itinerary
```bash
# Create multiple activities for the same day
POST /api/trips/1/activities
{
  "date": "2024-06-05",
  "time": "09:00",
  "title": "Breakfast",
  "description": "Hotel breakfast"
}

POST /api/trips/1/activities
{
  "date": "2024-06-05",
  "time": "10:30",
  "title": "Museum Visit",
  "description": "Louvre Museum"
}

POST /api/trips/1/activities
{
  "date": "2024-06-05",
  "time": "14:00",
  "title": "Lunch",
  "description": "Local restaurant"
}
```

### Updating Activity Time
```bash
PUT /api/activities/1
{
  "time": "10:00"
}
```

### Removing Description
```bash
PUT /api/activities/1
{
  "description": null
}
```



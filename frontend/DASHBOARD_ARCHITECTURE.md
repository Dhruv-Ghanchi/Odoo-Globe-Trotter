# Dashboard Architecture Documentation

## Component Structure

```
Dashboard
├── TripList
│   ├── TripCard (multiple)
│   └── TripForm (modal)
└── ActivityList
    ├── ActivityItem (multiple, grouped by date)
    └── ActivityForm (modal)
```

## Data Flow

### 1. **Initial Load Flow**

```
Dashboard mounts
  ↓
TripList mounts → useEffect triggers
  ↓
fetchTrips() called
  ↓
tripService.getTrips() → API call
  ↓
Response: { success: true, data: { trips: [...] } }
  ↓
setTrips(response.data.trips)
  ↓
TripList renders TripCard for each trip
```

### 2. **Trip Selection Flow**

```
User clicks TripCard
  ↓
onSelect() called with trip.id
  ↓
setSelectedTripId(tripId) in Dashboard
  ↓
selectedTripId passed to ActivityList
  ↓
ActivityList useEffect detects tripId change
  ↓
fetchActivities(tripId) called
  ↓
activityService.getActivities(tripId) → API call
  ↓
Response: { success: true, data: { activities: [...] } }
  ↓
setActivities(response.data.activities)
  ↓
Activities grouped by date and rendered
```

### 3. **Create Trip Flow**

```
User clicks "New Trip" button
  ↓
setShowForm(true) in TripList
  ↓
TripForm renders (editingTrip = null)
  ↓
User fills form and submits
  ↓
validate() checks inputs
  ↓
tripService.createTrip(formData) → API call
  ↓
Response: { success: true, data: { trip: {...} } }
  ↓
onSave() callback called
  ↓
fetchTrips() refreshes list
  ↓
setShowForm(false) closes form
```

### 4. **Update Trip Flow**

```
User clicks edit button on TripCard
  ↓
handleEdit(trip) called
  ↓
setEditingTrip(trip) + setShowForm(true)
  ↓
TripForm renders with trip data (useEffect populates form)
  ↓
User modifies and submits
  ↓
tripService.updateTrip(tripId, formData) → API call
  ↓
Response: { success: true, data: { trip: {...} } }
  ↓
onSave() → fetchTrips() → form closes
```

### 5. **Delete Trip Flow**

```
User clicks delete button on TripCard
  ↓
window.confirm() shows confirmation
  ↓
If confirmed → tripService.deleteTrip(tripId) → API call
  ↓
Response: { success: true }
  ↓
setTrips(prev => prev.filter(trip => trip.id !== tripId))
  ↓
If deleted trip was selected → onTripSelect(null)
```

### 6. **Create Activity Flow**

```
User clicks "Add Activity" in ActivityList
  ↓
setShowForm(true) in ActivityList
  ↓
ActivityForm renders (activity = null, tripId from props)
  ↓
User fills form (date defaults to today)
  ↓
User submits → validate() → activityService.createActivity(tripId, formData)
  ↓
Response: { success: true, data: { activity: {...} } }
  ↓
onSave() → fetchActivities() → form closes
```

### 7. **Update Activity Flow**

```
User clicks edit button on ActivityItem
  ↓
handleEdit(activity) called
  ↓
setEditingActivity(activity) + setShowForm(true)
  ↓
ActivityForm renders with activity data
  ↓
User modifies and submits
  ↓
activityService.updateActivity(activityId, formData) → API call
  ↓
Response: { success: true, data: { activity: {...} } }
  ↓
onSave() → fetchActivities() → form closes
```

### 8. **Delete Activity Flow**

```
User clicks delete button on ActivityItem
  ↓
window.confirm() shows confirmation
  ↓
If confirmed → activityService.deleteActivity(activityId) → API call
  ↓
Response: { success: true }
  ↓
setActivities(prev => prev.filter(activity => activity.id !== activityId))
```

## State Management

### Dashboard State

```javascript
const [selectedTripId, setSelectedTripId] = useState(null);
```

**Purpose**: Tracks which trip is currently selected to show its activities.

**Flow**:
- Set when user clicks a trip card
- Passed to ActivityList as prop
- Cleared when trip is deleted

### TripList State

```javascript
const [trips, setTrips] = useState([]);           // All user trips
const [loading, setLoading] = useState(true);     // Loading state
const [error, setError] = useState(null);         // Error message
const [showForm, setShowForm] = useState(false);  // Form visibility
const [editingTrip, setEditingTrip] = useState(null); // Trip being edited
```

**State Updates**:
- `trips`: Updated after fetch, create, update, delete
- `loading`: true during API calls, false after
- `error`: Set on API errors, cleared on retry
- `showForm`: true when form opens, false when closes
- `editingTrip`: null for create, trip object for edit

### ActivityList State

```javascript
const [activities, setActivities] = useState([]);      // Activities for selected trip
const [loading, setLoading] = useState(false);          // Loading state
const [error, setError] = useState(null);               // Error message
const [showForm, setShowForm] = useState(false);       // Form visibility
const [editingActivity, setEditingActivity] = useState(null); // Activity being edited
```

**State Updates**:
- `activities`: Updated when tripId changes or after CRUD operations
- `loading`: true during fetch, false after
- `error`: Set on API errors
- `showForm`: Controls form modal visibility
- `editingActivity`: null for create, activity object for edit

## API Integration

### Service Layer Pattern

All API calls go through service functions:

```javascript
// tripService.js
export const getTrips = async () => {
  const response = await api.get('/trips');
  return response.data;
};

// Component usage
const response = await getTrips();
if (response.success) {
  setTrips(response.data.trips);
}
```

### Error Handling Pattern

```javascript
try {
  const response = await createTrip(formData);
  if (response.success) {
    // Success handling
  }
} catch (err) {
  // Error handling
  setError(err.error?.message || 'Failed to create trip');
  if (err.error?.details) {
    // Handle validation details
  }
}
```

### Loading States

```javascript
// Before API call
setLoading(true);
setError(null);

try {
  // API call
} catch (err) {
  // Error handling
} finally {
  setLoading(false); // Always reset loading
}
```

## Component Responsibilities

### Dashboard
- **Purpose**: Main container, manages trip selection state
- **State**: `selectedTripId`
- **Children**: TripList, ActivityList
- **Props passed**: `selectedTripId`, `onTripSelect`

### TripList
- **Purpose**: Display and manage trips
- **State**: trips, loading, error, showForm, editingTrip
- **Actions**: Fetch, create, update, delete trips
- **Children**: TripCard (multiple), TripForm (conditional)

### TripCard
- **Purpose**: Display single trip
- **Props**: trip, isSelected, onSelect, onEdit, onDelete
- **Actions**: Select trip, trigger edit, trigger delete

### TripForm
- **Purpose**: Create/edit trip modal
- **Props**: trip (null for create, object for edit), onSave, onCancel
- **State**: formData, validationErrors, isSubmitting, error
- **Actions**: Validate, submit to API

### ActivityList
- **Purpose**: Display and manage activities for selected trip
- **State**: activities, loading, error, showForm, editingActivity
- **Props**: tripId (from Dashboard)
- **Actions**: Fetch, create, update, delete activities
- **Children**: ActivityItem (multiple, grouped), ActivityForm (conditional)

### ActivityItem
- **Purpose**: Display single activity
- **Props**: activity, onEdit, onDelete
- **Actions**: Trigger edit, trigger delete

### ActivityForm
- **Purpose**: Create/edit activity modal
- **Props**: tripId, activity (null for create, object for edit), onSave, onCancel
- **State**: formData, validationErrors, isSubmitting, error
- **Actions**: Validate, submit to API

## Key Patterns

### 1. **Optimistic Updates**
After successful API calls, local state is updated immediately:
```javascript
// Delete example
await deleteTrip(tripId);
setTrips(prev => prev.filter(trip => trip.id !== tripId));
```

### 2. **Refresh After Mutations**
After create/update, fetch fresh data:
```javascript
const handleTripSaved = () => {
  fetchTrips(); // Refresh list
  handleFormClose();
};
```

### 3. **Conditional Rendering**
Forms shown conditionally based on state:
```javascript
{showForm && (
  <TripForm
    trip={editingTrip}
    onSave={handleTripSaved}
    onCancel={handleFormClose}
  />
)}
```

### 4. **Grouping Activities**
Activities grouped by date for better UX:
```javascript
const activitiesByDate = activities.reduce((acc, activity) => {
  const date = activity.date;
  if (!acc[date]) acc[date] = [];
  acc[date].push(activity);
  return acc;
}, {});
```

### 5. **Form Reuse**
Same form component for create and edit:
```javascript
const isEditing = !!trip; // Determines mode

useEffect(() => {
  if (trip) {
    // Populate form for edit
  }
}, [trip]);
```

## Loading States

### TripList Loading
- Shows "Loading trips..." while fetching
- Disables form interactions during submission

### ActivityList Loading
- Shows "Loading activities..." while fetching
- Only shows when tripId is selected

### Form Loading
- Shows "Saving..." / "Creating..." during submission
- Disables form inputs and buttons

## Error States

### API Errors
- Displayed at top of component
- Includes retry button for fetch errors
- Field-specific errors shown in forms

### Validation Errors
- Shown per field in forms
- Cleared as user types
- Prevent form submission

## No Page Reloads

All operations use:
- React state updates (no page refresh)
- API calls via axios (no form submissions)
- Modal forms (no navigation)
- Optimistic UI updates

## Data Flow Summary

```
User Action
  ↓
Component Event Handler
  ↓
Service Function (API call)
  ↓
Backend API
  ↓
Response
  ↓
State Update
  ↓
Component Re-render
  ↓
UI Update (no page reload)
```

## Key Features

1. **Real-time Updates**: State updates immediately after API calls
2. **Error Recovery**: Retry buttons for failed fetches
3. **Form Validation**: Client-side validation before API calls
4. **Loading Feedback**: Clear loading states during operations
5. **Optimistic UI**: Immediate feedback, then sync with server
6. **Grouped Display**: Activities organized by date
7. **Modal Forms**: Non-intrusive create/edit experience
8. **Responsive Design**: Works on desktop and mobile



# Task Manager - Full Stack Application

A complete full-stack task management application built with Django REST Framework (backend) and React with Vite (frontend).

## Understanding React + Django Integration (Project Explanation)

This section explains how the frontend and backend work together in this specific project, with exact file locations and beginner-friendly explanations.

---

### 1. How React Fetches Data Using fetch()

**What it does:** React uses the native `fetch()` API to send HTTP requests to the Django backend and receive JSON responses.

**How it works:**
- **GET Request**: Fetches all tasks from the API
- **POST Request**: Creates a new task
- **PATCH Request**: Updates a task (like toggling completion)
- **DELETE Request**: Removes a task

**File Locations:**
- `frontend/src/App.jsx` - Main component that handles all API calls
- `frontend/src/components/TaskList.jsx` - Receives tasks as props and displays them
- `frontend/src/components/AddTaskForm.jsx` - Sends POST request when form is submitted

**How Response Updates React State:**
```javascript
// Example from App.jsx
const response = await fetch('http://localhost:8001/api/tasks/')
const data = await response.json()
setTasks(data)  // Updates React state, which triggers UI re-render
```

When the API returns JSON data, React updates its state using `setTasks()`, which automatically re-renders the UI to show the new data.

---

### 2. Understanding CORS (Cross-Origin Resource Sharing)

**What it is:** CORS is a security feature that allows the React frontend (running on `localhost:3001`) to make requests to the Django backend (running on `localhost:8001`), even though they're on different ports.

**Why it's needed:** 
- React frontend runs on port **3001**
- Django backend runs on port **8001**
- Browsers block requests between different origins (different ports = different origins)
- CORS configuration tells Django: "It's okay to accept requests from port 3001"

**File Location:**
- `backend/backend/settings.py` - Contains CORS configuration

**How CORS_ALLOWED_ORIGINS Fixes the Issue:**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
```

This configuration tells Django to add special headers to its responses, allowing the browser to accept data from the backend when requested by the frontend.

---

### 3. How Django REST Framework Exposes APIs for React

**What it does:** Django REST Framework (DRF) converts database models into JSON APIs that React can consume.

**The API Pipeline (Step by Step):**

1. **Model** (`backend/tasks/models.py`) - Defines the database structure
   - Creates the `Task` table with fields: `id`, `title`, `completed`, `created_at`

2. **Serializer** (`backend/tasks/serializers.py`) - Converts database objects to JSON
   - Takes a Task object from the database
   - Converts it to JSON format: `{"id": 1, "title": "Task name", "completed": false}`

3. **ViewSet** (`backend/tasks/views.py`) - Handles HTTP requests
   - Receives GET/POST/PUT/PATCH/DELETE requests
   - Queries the database using the Model
   - Uses Serializer to convert data to JSON
   - Returns JSON response to React

4. **URLs** (`backend/tasks/urls.py` and `backend/backend/urls.py`) - Routes requests
   - Maps URLs like `/api/tasks/` to the ViewSet
   - Connects HTTP methods to specific functions

**File Locations:**
- `backend/tasks/models.py` - Database model definition
- `backend/tasks/serializers.py` - JSON conversion logic
- `backend/tasks/views.py` - Request handling (TaskViewSet)
- `backend/tasks/urls.py` - App-level URL routing
- `backend/backend/urls.py` - Project-level URL routing

**Example JSON Response:**
```json
[
  {
    "id": 1,
    "title": "Complete project presentation",
    "completed": false,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### 4. Common Pattern: Django as Backend API + React as Frontend UI

**Architecture Overview:**
This project follows a **separation of concerns** pattern where Django and React have different responsibilities.

**Django (Backend) Handles:**
- **Data Storage**: SQLite database stores all tasks
- **Business Logic**: Validates data, processes requests
- **API Endpoints**: Provides JSON data via REST API
- **File Location**: `backend/` folder

**React (Frontend) Handles:**
- **User Interface**: Displays tasks, forms, buttons
- **User Interactions**: Clicking, typing, submitting forms
- **State Management**: Keeps track of tasks in memory
- **File Location**: `frontend/` folder

**How They Communicate:**
- React sends HTTP requests (GET, POST, PATCH, DELETE)
- Django processes requests and returns JSON
- React receives JSON and updates the UI

**Benefits:**
- Frontend and backend can be developed separately
- Backend can serve multiple frontends (web, mobile app, etc.)
- Clear separation makes code easier to maintain

---

### 5. Example Flow: React Request → Django REST → JSON → React Component

**Complete Request-Response Cycle:**

**Step 1: User Action** (in browser)
- User opens the app at `http://localhost:3001`
- React component `App.jsx` loads

**Step 2: React Sends Request** (`frontend/src/App.jsx`)
```javascript
const response = await fetch('http://localhost:8001/api/tasks/')
```
- React sends GET request to Django backend

**Step 3: Django Receives Request** (`backend/tasks/views.py`)
- `TaskViewSet` receives the GET request
- Queries database: `Task.objects.all()`

**Step 4: Django Serializes Data** (`backend/tasks/serializers.py`)
- `TaskSerializer` converts database objects to JSON
- Returns JSON array of tasks

**Step 5: React Receives JSON** (`frontend/src/App.jsx`)
```javascript
const data = await response.json()
setTasks(data)  // Updates state
```

**Step 6: React Renders UI** (`frontend/src/components/TaskList.jsx` → `TaskItem.jsx`)
- `TaskList.jsx` receives tasks as props
- Uses `.map()` to render each task
- `TaskItem.jsx` displays individual task details
- UI updates automatically (SPA behavior - no page refresh)

**File Flow:**
- Request sent from: `frontend/src/App.jsx`
- Handled by: `backend/tasks/views.py`
- Serialized by: `backend/tasks/serializers.py`
- Rendered by: `frontend/src/components/TaskList.jsx` → `frontend/src/components/TaskItem.jsx`

---

### 6. Consuming Django API in React (Lists, Components)

**How the Project Renders Lists of Tasks:**

**File Location:** `frontend/src/components/TaskList.jsx`

**Process:**
1. `TaskList` component receives `tasks` array as props from `App.jsx`
2. Uses JavaScript `.map()` method to iterate through tasks
3. Renders a `TaskItem` component for each task

**Code Pattern:**
```javascript
// From TaskList.jsx
{tasks.map(task => (
  <TaskItem
    key={task.id}
    task={task}
    onToggle={onToggleTask}
    onDelete={onDeleteTask}
  />
))}
```

**Why `.map()` is Used:**
- Converts array of task objects into array of React components
- Each task becomes a `TaskItem` component
- React automatically renders all items in the list

**Data Flow:**
- API returns: `[{id: 1, title: "Task 1"}, {id: 2, title: "Task 2"}]`
- `.map()` creates: `[<TaskItem task={...} />, <TaskItem task={...} />]`
- React renders: List of task items in the UI

---

### 7. Handling Forms in React + Sending POST to Django

**How AddTaskForm Sends POST Requests:**

**File Location:** `frontend/src/components/AddTaskForm.jsx`

**Process:**
1. User types task title in input field
2. User clicks "Add Task" button
3. Form submission triggers `handleSubmit` function
4. `handleSubmit` calls `onAddTask` prop function (passed from `App.jsx`)

**POST Request Implementation** (in `frontend/src/App.jsx`):
```javascript
const response = await fetch('http://localhost:8001/api/tasks/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ title: title, completed: false }),
})
```

**API URL Hit:**
- URL: `http://localhost:8001/api/tasks/`
- Method: POST
- Body: `{"title": "New task", "completed": false}`

**What Happens:**
1. React sends POST request with task data
2. Django receives request at `backend/tasks/views.py`
3. Django creates new task in database
4. Django returns new task as JSON
5. React adds new task to state
6. UI automatically updates to show new task

---

### 8. Displaying Loading & Error States

**Why These States Are Important:**
- **Loading State**: Shows user that data is being fetched (prevents confusion)
- **Error State**: Informs user if something goes wrong (network error, server error, etc.)

**File Locations:**
- `frontend/src/components/Loading.jsx` - Displays spinner while fetching data
- `frontend/src/components/Error.jsx` - Displays error messages

**How They Work:**

**Loading State:**
- When `loading` is `true`, React shows `<Loading />` component
- Spinner appears while API request is in progress
- Once data arrives, `loading` becomes `false` and tasks are displayed

**Error State:**
- If API request fails, `error` state is set with error message
- `<Error />` component displays the error message
- User can close error message and try again

**Usage in App.jsx:**
```javascript
{loading ? (
  <Loading />
) : (
  <TaskList tasks={tasks} />
)}

{error && <Error message={error} />}
```

**Benefits:**
- Better user experience
- Clear feedback about what's happening
- Helps debug issues during development

---

## 📁 Project Structure

```
Project-Presentation/
├── backend/                    # Django Backend
│   ├── backend/               # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py        # Django settings (CORS, REST framework)
│   │   ├── urls.py            # Project-level URLs
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── tasks/                 # Tasks app
│   │   ├── __init__.py
│   │   ├── models.py          # Task model
│   │   ├── serializers.py     # TaskSerializer
│   │   ├── views.py           # TaskViewSet (ModelViewSet)
│   │   ├── urls.py            # App-level URLs
│   │   └── admin.py           # Django admin configuration
│   ├── manage.py
│   └── requirements.txt       # Python dependencies
│
└── frontend/                  # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── TaskList.jsx       # Displays list of tasks
    │   │   ├── TaskItem.jsx       # Single task component
    │   │   ├── AddTaskForm.jsx    # Form to create new task
    │   │   ├── Loading.jsx        # Loading state component
    │   │   └── Error.jsx          # Error message component
    │   ├── App.jsx                # Main application component
    │   ├── main.jsx               # React entry point
    │   └── index.css              # Tailwind CSS imports
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🚀 Setup Instructions

### Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed
- Virtual environment tool (venv or virtualenv)

### Backend Setup (Django)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser (optional, for admin access):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Django development server:**
   ```bash
   python manage.py runserver
   ```
   
   The backend will run on `http://localhost:8001`

### Frontend Setup (React)

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Vite development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:3001`

## 📡 API Endpoints

The Django REST Framework provides the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | List all tasks |
| POST | `/api/tasks/` | Create a new task |
| GET | `/api/tasks/<id>/` | Retrieve a specific task |
| PUT | `/api/tasks/<id>/` | Update a task (full update) |
| PATCH | `/api/tasks/<id>/` | Update a task (partial update) |
| DELETE | `/api/tasks/<id>/` | Delete a task |

### Example JSON Responses

**GET /api/tasks/**
```json
[
  {
    "id": 1,
    "title": "Complete project presentation",
    "completed": false,
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "title": "Review code",
    "completed": true,
    "created_at": "2024-01-14T09:15:00Z"
  }
]
```

**POST /api/tasks/** (Request Body)
```json
{
  "title": "New task",
  "completed": false
}
```

**POST /api/tasks/** (Response)
```json
{
  "id": 3,
  "title": "New task",
  "completed": false,
  "created_at": "2024-01-15T11:00:00Z"
}
```

**PATCH /api/tasks/1/** (Request Body)
```json
{
  "completed": true
}
```

## 🔄 How React-Django Integration Works

### 1. **CORS (Cross-Origin Resource Sharing)**

CORS allows the React frontend (running on `localhost:3001`) to make requests to the Django backend (running on `localhost:8001`), which are different origins.

**Backend Configuration (`backend/settings.py`):**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
```

This tells Django to accept requests from these origins and include appropriate CORS headers in responses.

### 2. **Django REST Framework (DRF)**

DRF converts Django models into JSON APIs:

- **Model** (`tasks/models.py`): Defines the Task database structure
- **Serializer** (`tasks/serializers.py`): Converts Task instances ↔ JSON
- **ViewSet** (`tasks/views.py`): Handles HTTP methods (GET, POST, PUT, PATCH, DELETE)
- **Router** (`tasks/urls.py`): Automatically creates URL patterns

### 3. **React Fetch API**

React uses the native `fetch()` API to communicate with Django:

**Example: Fetching Tasks (GET)**
```javascript
const response = await fetch('http://localhost:8001/api/tasks/')
const data = await response.json()
```

**Example: Creating Task (POST)**
```javascript
const response = await fetch('http://localhost:8001/api/tasks/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ title: 'New task', completed: false }),
})
const newTask = await response.json()
```

**Example: Updating Task (PATCH)**
```javascript
const response = await fetch('http://localhost:8001/api/tasks/1/', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ completed: true }),
})
```

**Example: Deleting Task (DELETE)**
```javascript
const response = await fetch('http://localhost:8001/api/tasks/1/', {
  method: 'DELETE',
})
```

### 4. **Request-Response Flow**

```
┌─────────────┐                    ┌─────────────┐
│   React     │                    │   Django    │
│  Frontend   │                    │   Backend   │
│ (Port 3001) │                    │ (Port 8001) │
└──────┬──────┘                    └──────┬──────┘
       │                                 │
       │  1. fetch('/api/tasks/')        │
       │────────────────────────────────>│
       │                                 │
       │                                 │  2. Query Database
       │                                 │     (Task.objects.all())
       │                                 │
       │                                 │  3. Serialize to JSON
       │                                 │     (TaskSerializer)
       │                                 │
       │  4. JSON Response              │
       │<────────────────────────────────│
       │                                 │
       │  5. Update React State          │
       │     setTasks(data)              │
       │                                 │
```

### 5. **State Management**

React manages application state using `useState` hooks:

- **Tasks State**: Stores the list of tasks fetched from the API
- **Loading State**: Tracks when data is being fetched
- **Error State**: Captures and displays any errors

When a user performs an action (add, update, delete), React:
1. Makes an API request to Django
2. Receives JSON response
3. Updates local state
4. Re-renders the UI

## 🎨 Features

- ✅ **Create Tasks**: Add new tasks with a title
- ✅ **List Tasks**: View all tasks in a clean list
- ✅ **Toggle Completion**: Mark tasks as completed/incomplete
- ✅ **Delete Tasks**: Remove tasks from the list
- ✅ **Loading States**: Visual feedback during API calls
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Responsive Design**: Beautiful UI with Tailwind CSS
- ✅ **Real-time Updates**: Immediate UI updates after operations

## 🛠️ Technologies Used

### Backend
- **Django 4.2**: Web framework
- **Django REST Framework**: API framework
- **django-cors-headers**: CORS middleware
- **SQLite**: Database (default Django database)

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Fetch API**: HTTP client (native browser API)

## 📝 Code Explanation

### Backend: ModelViewSet

The `TaskViewSet` extends `ModelViewSet`, which automatically provides:
- `list()` → GET `/api/tasks/`
- `create()` → POST `/api/tasks/`
- `retrieve()` → GET `/api/tasks/<id>/`
- `update()` → PUT `/api/tasks/<id>/`
- `partial_update()` → PATCH `/api/tasks/<id>/`
- `destroy()` → DELETE `/api/tasks/<id>/`

### Frontend: Component Architecture

- **App.jsx**: Main component managing state and API calls
- **TaskList.jsx**: Renders the list of tasks
- **TaskItem.jsx**: Individual task with checkbox and delete button
- **AddTaskForm.jsx**: Form for creating new tasks
- **Loading.jsx**: Loading spinner component
- **Error.jsx**: Error message display component

## 🎓 Presentation Tips

1. **Start with Backend**: Show Django server running and API endpoints
2. **Demonstrate API**: Use browser or Postman to show JSON responses
3. **Show Frontend**: Display React app and interact with it
4. **Explain CORS**: Show how different ports communicate
5. **Walk Through Code**: Explain key files (models, serializers, views, components)
6. **Show Network Tab**: Demonstrate actual HTTP requests in browser DevTools

## 🐛 Troubleshooting

**Backend not starting:**
- Ensure virtual environment is activated
- Check if port 8000 is already in use
- Verify all dependencies are installed

**Frontend not connecting to backend:**
- Ensure Django server is running
- Check CORS settings in `settings.py`
- Verify API URL in `App.jsx` matches Django server URL

**CORS errors:**
- Ensure `django-cors-headers` is installed
- Check `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Verify `corsheaders` is in `INSTALLED_APPS` and middleware

## 📚 Additional Resources

- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**Built with ❤️ for educational purposes**


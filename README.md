# Task Manager — Presentation Notes

This document follows your presentation questions exactly. It is written to be user-friendly and project-focused: where a question is about concepts, a short explanation is given; where it can be answered from the project, I list the relevant files.

---

## Introduction to React for Django Developers

Below are the core items you listed. Each item has a short, clear explanation suitable for presenting to an audience of Django developers.

- What React is and why it’s used
  - React is a JavaScript library for building user interfaces with reusable components. It makes UI state management and interactive updates easier and faster than manual DOM manipulation.
  - Use when you want a responsive, interactive frontend (forms, live updates, complex UI state).

-#### Difference between traditional Django templates and React frontend
  - Django templates: server-rendered HTML produced by Django views; each page load is rendered on the server.
  - React frontend: client-side rendering (SPA) — the browser runs JavaScript to render and update the UI without full page reloads.
  - Project context: this repo uses Django only as an API provider and React as the SPA UI.
    - Files: `frontend/` (React app), `backend/` (Django API; templates are not used).

- SPA (Single Page Application) concept
  - An SPA loads a single HTML page and updates the view dynamically on the client as the user interacts, producing smooth navigation and instant UI updates.
  - Trade-offs: initial bundle size and SEO considerations vs. responsiveness and interactivity.

- Virtual DOM and component-based architecture
  - React keeps a lightweight Virtual DOM to compute minimal changes and applies only necessary updates to the real DOM (fast rendering).
  - Components are small, reusable UI units (receive `props`, manage `state`). Compose components to build the whole UI.
  - Project components: `frontend/src/components/TaskList.jsx`, `TaskItem.jsx`, `AddTaskForm.jsx`.

- Why companies use React + Django together
  - Django is robust for backend logic, authentication, and data; React provides a modern, fast UI. Separating frontend and backend lets teams work independently and scale each side separately.

---

## Connecting React with Django REST API

- How React fetches data using `fetch()` or `Axios`
  - React uses HTTP clients to call backend APIs. `fetch()` is built-in and returns Promises; `axios` is a popular library that adds niceties (automatic JSON parsing, interceptors).
  - Project usage: `frontend/src/App.jsx` uses `fetch()` for GET/POST/PATCH/DELETE.

- Understanding CORS (Cross-Origin Resource Sharing)
  - Browsers block cross-origin requests by default (different host/port origin). The backend must include CORS headers to allow the frontend to call it.
  - Project file: `backend/backend/settings.py` defines `CORS_ALLOWED_ORIGINS` and `corsheaders` is enabled in `MIDDLEWARE`.

- How Django REST Framework exposes APIs for React
  - DRF provides serializers (model ↔ JSON) and viewsets (request handling). A router maps viewset actions to URL endpoints which React fetches.
  - Project files: `backend/tasks/models.py`, `backend/tasks/serializers.py`, `backend/tasks/views.py`, `backend/tasks/urls.py`.

- Common patterns
  - Django as backend API: Django exposes REST endpoints (JSON), no server-side HTML rendering for the app.
  - React as frontend UI: React app fetches JSON and renders it as components.
  - Files: `backend/tasks/*` (API), `frontend/src/*` (UI).

- Example flow (React → Django JSON)
  - User interacts with React UI → React sends HTTP request (e.g., `fetch('/api/tasks/')`) → Django ViewSet handles request → Serializer converts model instances to JSON → Response sent back → React updates state and re-renders.
  - Callouts (project): `frontend/src/App.jsx` → `backend/tasks/views.py` (`TaskViewSet`) → `backend/tasks/serializers.py` → `frontend/src/components/TaskList.jsx`.

---

## Building a Simple Frontend for a Django API

- Consuming a Django REST API in React
  - React fetches JSON endpoints and stores results in component state (`useState`). Use `useEffect` to fetch on mount.
  - Project example: `App.jsx` calls `fetch()` on mount to populate `tasks`.

- Rendering lists (tasks, products, posts) from API data
  - Pattern: receive an array from API, map it to components with `.map()` and a `key` for each item.
  - Project file: `frontend/src/components/TaskList.jsx` uses `.map()` to render `TaskItem`.

- Handling forms in React and sending POST requests to Django
  - Use controlled inputs to collect input values; submit handler calls `fetch()` (POST) with JSON body and `Content-Type: application/json` header.
  - Project files: `frontend/src/components/AddTaskForm.jsx` (form), `frontend/src/App.jsx` handles POST to `/api/tasks/`.

- Displaying loading & error states
  - Best practice: keep `loading` and `error` state to give user feedback; show spinner or error messages when appropriate.
  - Project files: `frontend/src/components/Loading.jsx`, `frontend/src/components/Error.jsx`, `frontend/src/App.jsx` manages those states.

- Real example (project)
  - Flow: `App.jsx` GET `/api/tasks/` → receives `[{ id, title, completed, created_at }, ...]` → `setTasks(data)` → `TaskList` renders items (each `TaskItem` shows title, created date, and checkbox for completed).

---

## Group Summary

How React acts as a modern frontend for Django’s backend API — using components, API calls, and SPA architecture — to build fast, interactive, scalable full-stack applications.

Key takeaway: Django owns data and business logic; React owns UI and UX. Communication happens over JSON HTTP APIs.

---

## Important files (project-specific) — quick reference

### Frontend (what to show in presentation)
- `frontend/index.html` — static HTML page Vite serves; React mounts into the root element.
- `frontend/src/main.jsx` — React entry point; renders `<App />`.
- `frontend/src/App.jsx` — central logic: fetches tasks, holds state (`tasks`, `loading`, `error`), and defines handlers for add/toggle/delete.
- `frontend/src/components/AddTaskForm.jsx` — controlled form to add tasks (calls `onAddTask`).
- `frontend/src/components/TaskList.jsx` — maps `tasks` array into `TaskItem` components.
- `frontend/src/components/TaskItem.jsx` — displays task details, created date, checkbox to toggle, delete button.
- `frontend/src/components/Loading.jsx` & `Error.jsx` — user feedback components.

### Backend (what to show in presentation)
- `backend/tasks/models.py` — `Task` model (fields: `title`, `completed`, `created_at`).
- `backend/tasks/serializers.py` — `TaskSerializer` (converts model instances ↔ JSON fields: `id`, `title`, `completed`, `created_at`).
- `backend/tasks/views.py` — `TaskViewSet` (DRF `ModelViewSet`) exposing CRUD endpoints.
- `backend/tasks/urls.py` — router registration for `/api/tasks/`.
- `backend/backend/urls.py` — project-level routing mounts app under `path('api/', include('tasks.urls'))`.
- `backend/backend/settings.py` — important settings: `INSTALLED_APPS` (includes `rest_framework`, `corsheaders`), `CORS_ALLOWED_ORIGINS`, and `REST_FRAMEWORK` settings.

### Database
- `backend/db.sqlite3` (created after migrations) — where `Task` records are stored locally for development.

---

## Data Flow (concise diagram + explanation)

1) User opens React app (browser) → `frontend/index.html` loads bundle → `main.jsx` mounts `App`.

2) `App.jsx` (on mount) calls GET `http://localhost:8001/api/tasks/` using `fetch()`.

3) Django receives request at `backend/tasks/views.py` (`TaskViewSet`) → queries `Task.objects.all()` (model) → `TaskSerializer` converts queryset to JSON.

4) Django returns JSON response (list of tasks) → `App.jsx` receives JSON → `setTasks(data)` updates state → React re-renders `TaskList` and `TaskItem` components.

5) For actions:
- Add: POST `/api/tasks/` (React) → create in backend → response appended to frontend state.
- Toggle: PATCH `/api/tasks/<id>/` (React) → backend updates `completed` → response updates frontend state.
- Delete: DELETE `/api/tasks/<id>/` (React) → backend deletes record → frontend removes from state.

---

If you want this as a single-page `PRESENTATION.md` or need speaker notes under each bullet, tell me and I will extract this file and/or add one-line speaker prompts after each item.

---

*(End of presentation README — follows your exact question list and includes project file mappings and data flow.)*
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

---

## Data Flow & Key Files (Frontend + Backend)

### Simple ASCII data flow (end-to-end)

Browser / React UI
  |
  |  (fetch / POST / PATCH / DELETE)
  v
React App (`frontend/src/App.jsx`)
  |
  |  (HTTP request to API: `http://localhost:8001/api/tasks/`)
  v
Django REST Framework ViewSet (`backend/tasks/views.py`)
  |
  |  (uses serializer to convert data)
  v
Serializer (`backend/tasks/serializers.py`)
  |
  |  (reads/writes data)
  v
Model / Database (`backend/tasks/models.py` → SQLite `db.sqlite3`)

Response (JSON) flows back up the same path to React, which calls `setState` and re-renders components.

### Frontend — Main files and their functions
- `frontend/index.html` — Single HTML page served by Vite; React mounts into the root element.
- `frontend/src/main.jsx` — React entry point; bootstraps the `App` component.
- `frontend/src/App.jsx` — Central component: holds `tasks`, `loading`, `error` state; performs `fetch()` calls to the API; passes handlers and data down to child components.
- `frontend/src/components/AddTaskForm.jsx` — Controlled form component for creating tasks (calls `onAddTask`).
- `frontend/src/components/TaskList.jsx` — Renders a list of tasks; maps API array to `TaskItem` components.
- `frontend/src/components/TaskItem.jsx` — Displays a task, checkbox for toggling, and delete button; formats `created_at`.
- `frontend/src/components/Loading.jsx` & `Error.jsx` — Small UI helpers for UX feedback during network calls or failures.

### Backend — Main files and their functions
- `backend/tasks/models.py` — `Task` model definition (fields: `title`, `completed`, `created_at`).
- `backend/tasks/serializers.py` — `TaskSerializer` converts model instances to/from JSON used by the API.
- `backend/tasks/views.py` — `TaskViewSet` (a DRF `ModelViewSet`) that exposes list/create/retrieve/update/partial_update/destroy endpoints.
- `backend/tasks/urls.py` — Registers the viewset with a `DefaultRouter`, producing `/api/tasks/` routes.
- `backend/backend/urls.py` — Project-level URL conf; mounts the app under `path('api/', include('tasks.urls'))`.
- `backend/backend/settings.py` — Project settings; includes `CORS_ALLOWED_ORIGINS`, `INSTALLED_APPS` (DRF, corsheaders), and `REST_FRAMEWORK` config.
- `backend/db.sqlite3` (created after migrations) — SQLite database file (data persistence).

### Quick notes for understanding flow during common user actions
- Load app (initial GET): `App.jsx` calls GET `/api/tasks/` → `TaskViewSet` returns serialized list → `App` sets `tasks` → `TaskList` renders items.
- Add task: `AddTaskForm` → `App.handleAddTask()` POST `/api/tasks/` → `TaskViewSet` creates Task → response appended to `tasks` state.
- Toggle task: `TaskItem` checkbox → `App.handleToggleTask()` PATCH `/api/tasks/<id>/` → `TaskViewSet` updates record → `App` updates state.
- Delete task: `TaskItem` delete → `App.handleDeleteTask()` DELETE `/api/tasks/<id>/` → `TaskViewSet` removes record → `App` filters `tasks` state.

If you want this as a printable one-page summary or a slide-ready markdown (`PRESENTATION.md`), I can extract this section into a separate file and keep `README.md` focused on setup and structure.

**Presentation Questions (Organized by Scope)**

**Pure Frontend Questions**
- **What React is and why it’s used:** React is a JavaScript library for building user interfaces using components. In this project the React app (in `frontend/`) renders the UI, manages state, and reacts to user actions without reloading the page. **Files:** `frontend/src/App.jsx`, `frontend/src/main.jsx`.
  
  **Theory (expanded):**
  - **Definition:** React is a declarative, component-based library for building UIs. Instead of describing step-by-step DOM changes, you declare what the UI should look like for a given application state.
  - **JSX:** React uses JSX — a syntax that looks like HTML inside JavaScript — to describe UI structure. JSX is compiled to `React.createElement` calls by the build tool (Vite/Babel).
  - **Components:** A React app is composed of components (reusable UI pieces). Components receive `props` (read-only inputs) and can manage their own `state` (data that changes over time).
  - **State & Hooks:** Modern React uses functional components with hooks like `useState` (local state) and `useEffect` (side effects such as fetching data). Hooks replaced many lifecycle methods from class components and make code easier to reason about.
  - **One-way data flow:** Data flows down from parent to child via props. Events bubble up via callback props — this makes state changes predictable.
  - **When to use React:** Use React when you need a highly interactive UI, fast updates, or a single-page experience. For simple static pages, server-rendered templates may be simpler.
- **Difference between traditional Django templates and React frontend:** Django templates render HTML on the server for each page load, whereas React builds an SPA that updates the DOM on the client. This project uses Django only as an API (JSON) provider and React for interactive UI. **Files:** `backend/` (templates not used), `frontend/src/*`.
  
  **Theory (expanded):**
  - **Server-rendered templates:** Django templates generate HTML on the server using Python context, which is then sent to the browser. Good for SEO and simple apps.
  - **Client-side rendering (CSR):** React renders HTML in the browser using JavaScript. CSR enables richer interactivity and smoother UX at the cost of requiring JS in the client and sometimes additional SEO work.
- **SPA (Single Page Application) concept:** The app loads a single HTML page (`frontend/index.html`) and React updates the view dynamically. Navigation and state changes do not require full page reloads. **Files:** `frontend/index.html`, `frontend/src/App.jsx`.
  
  **Theory (expanded):**
  - **SPA benefits:** faster navigation after first load, smoother transitions, and the ability to manage state in memory across the app.
  - **SPA trade-offs:** initial bundle size, need for client-side routing (e.g., `react-router`), and extra handling for SEO if needed.
- **Virtual DOM and component-based architecture:** React maintains a lightweight Virtual DOM to efficiently update only changed parts of the UI. Components here include `App`, `TaskList`, `TaskItem`, `AddTaskForm`. **Files:** `frontend/src/components/*.jsx`.
  
  **Theory (expanded):**
  - **Virtual DOM:** React keeps a virtual copy of the DOM in memory. When state changes, React calculates the minimal set of changes (diffing) and applies them to the real DOM — this is called reconciliation and improves performance.
  - **Component composition:** Small components are composed into larger ones, making the code modular and easier to test and reuse.
- **How React fetches data using fetch() or Axios:** React uses `fetch()` in `App.jsx` to GET/POST/PATCH/DELETE JSON from the API and then updates component state. **Files:** `frontend/src/App.jsx`, `frontend/src/components/AddTaskForm.jsx`.
  
  **Theory (expanded):**
  - **`fetch()` vs `axios`:** `fetch()` is a standard browser API that returns Promises and requires manual handling of JSON and some errors. `axios` is a popular third-party library that provides a nicer API (automatic JSON parsing, request/response interceptors, and better error handling across browsers). Both are fine; `fetch()` keeps dependencies minimal.
  - **How it works:** The frontend sends an HTTP request (method + headers + optional body). The server responds with a status code and JSON body. The client checks the status and parses JSON, then updates UI state.
- **Rendering lists & displaying loading/error states:** The UI maps API arrays to components via `.map()` and uses `Loading.jsx`/`Error.jsx` for UX feedback. **Files:** `frontend/src/components/TaskList.jsx`, `frontend/src/components/TaskItem.jsx`, `frontend/src/components/Loading.jsx`, `frontend/src/components/Error.jsx`.

**Theory-only notes**
- Some presentation topics are conceptual and not implemented as files here; I included short definitions so you can explain them during your talk:
  - **Component lifecycle (class vs hooks):** Historically React class components had lifecycle methods like `componentDidMount`. Hooks (`useEffect`) are now the standard for side effects in functional components.
  - **Declarative vs imperative:** React encourages declarative UI definitions (describe the UI for a given state) rather than imperative DOM mutations (manually change DOM nodes).
  - **Ecosystem topics (brief):** Routing (`react-router`), state management (`Redux`, `Context API`), and build tools (Vite, Webpack) are common additions when projects grow.

**Frontend + Backend (Both) Questions**
- **Difference between Django templates and React (context of project):** This is both a frontend design choice and a backend deployment consideration: React handles UI while Django provides JSON APIs. **Files:** `frontend/src/*`, `backend/tasks/views.py`, `backend/tasks/serializers.py`.
- **How React fetches data → Example flow:** End-to-end: React calls `fetch()` in `App.jsx` → request goes to `/api/tasks/` → DRF `TaskViewSet` handles request → `TaskSerializer` returns JSON → React updates state and renders components. **Files:** `frontend/src/App.jsx` → `backend/tasks/views.py` → `backend/tasks/serializers.py` → `frontend/src/components/TaskList.jsx`.
- **Handling forms in React and sending POST requests to Django:** Frontend captures input and POSTs JSON to the API; backend validates via serializer and saves to DB. **Files:** `frontend/src/components/AddTaskForm.jsx`, `frontend/src/App.jsx`, `backend/tasks/serializers.py`, `backend/tasks/views.py`.
- **Consuming a Django REST API in React (lists, components):** Rendering lists (frontend) depends on the API shape provided by DRF (backend). **Files:** `frontend/src/components/TaskList.jsx`, `frontend/src/components/TaskItem.jsx`, `backend/tasks/serializers.py`.

**Pure Backend Questions**
- **How Django REST Framework exposes APIs for React:** DRF converts `Task` model instances to JSON via `TaskSerializer` and exposes endpoints through `TaskViewSet` and the router. **Files:** `backend/tasks/models.py`, `backend/tasks/serializers.py`, `backend/tasks/views.py`, `backend/tasks/urls.py`, `backend/backend/urls.py`.
- **Understanding CORS (Cross-Origin Resource Sharing):** CORS is configured in Django settings so the browser will allow the React app (different origin/port) to call the API. **Files:** `backend/backend/settings.py` (`CORS_ALLOWED_ORIGINS`, `corsheaders` in middleware).
- **Common patterns: Django as backend API:** This pattern is implemented here—Django only serves API endpoints while React serves the UI. **Files:** `backend/tasks/*`, `frontend/*`.
- **Model → Serializer → View → URL pipeline (how data is served):** The backend pipeline is: `Task` model → `TaskSerializer` → `TaskViewSet` → router (`/api/tasks/`) → JSON response. **Files:** `backend/tasks/models.py`, `backend/tasks/serializers.py`, `backend/tasks/views.py`, `backend/tasks/urls.py`.

**Quick mapping: question → files**
- **Pure frontend:** `frontend/src/App.jsx`, `frontend/src/main.jsx`, `frontend/src/components/*.jsx`, `frontend/index.html`.
- **Frontend + backend:** `frontend/src/App.jsx` ↔ `backend/tasks/views.py`, `backend/tasks/serializers.py`, `backend/tasks/models.py`, `backend/backend/settings.py` (CORS).
- **Pure backend:** `backend/tasks/models.py`, `backend/tasks/serializers.py`, `backend/tasks/views.py`, `backend/tasks/urls.py`, `backend/backend/urls.py`, `backend/backend/settings.py`.

**Group Summary (in project context)**
- **React role:** UI layer — components, state, fetches API, renders tasks. **Files:** `frontend/src/*`.
- **Django role:** API layer — stores data, serializes it, and exposes endpoints for React. **Files:** `backend/tasks/*`, `backend/backend/settings.py`.
- **How they work together:** React (frontend) makes HTTP requests to Django (backend) and consumes JSON to power a responsive SPA. See `frontend/src/App.jsx` for the client flow and `backend/tasks/views.py` + `backend/tasks/serializers.py` for server flow.

If you want, I can also:
- Add a short ASCII diagram showing the request/response flow.
- Add a one-page printable summary for your presentation slides.

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

## Presentation (strict Q&A)

Below are your original presentation questions, answered concisely. For questions that are project-specific I list the files where the related code lives; for purely theoretical questions I give a short explanation.

---

**Pure Frontend Questions**

- What React is and why it’s used
  - Brief: React is a JavaScript library for building user interfaces using reusable components and a declarative style. It makes it easy to build interactive, stateful UIs.
  - Project files: theoretical (general) — see `frontend/src/App.jsx` for usage.

- Difference between traditional Django templates and React frontend
  - Brief: Django templates render HTML on the server; React renders UI on the client as a Single Page Application (SPA). Server-rendered pages are good for simple/SEO-heavy apps; React offers dynamic, interactive client-side behavior.
  - Project context: This project uses Django as an API and React as the frontend. Files: `frontend/src/*` (React), `backend/` (no templates used).

- SPA (Single Page Application) concept
  - Brief: The app loads one HTML page and updates views client-side without full page reloads, improving perceived performance and UX.
  - Project files: `frontend/index.html`, `frontend/src/main.jsx`, `frontend/src/App.jsx`.

- Virtual DOM and component-based architecture
  - Brief: React uses a virtual DOM to compute minimal updates; UI is split into components (reusable pieces) that accept props and manage internal state.
  - Project files: `frontend/src/components/TaskList.jsx`, `TaskItem.jsx`, `AddTaskForm.jsx`.

- Why companies use React + Django together
  - Brief: Django handles robust backend logic, data storage, and APIs; React provides a modern interactive frontend. This separation lets teams work independently and scale frontend and backend separately.
  - Project context: `backend/` provides API; `frontend/` is the user-facing SPA.

---

**Frontend + Backend Questions**

- How React fetches data using fetch() or Axios
  - Brief: React sends HTTP requests (GET/POST/PATCH/DELETE) using `fetch()` or a library like `axios`. The response JSON updates component state.
  - Project files: `frontend/src/App.jsx` (uses `fetch()`), `frontend/src/components/AddTaskForm.jsx`.

- Understanding CORS (Cross-Origin Resource Sharing)
  - Brief: Browsers block requests between different origins by default. CORS headers from the backend allow the frontend (different port) to call the API.
  - Project files: `backend/backend/settings.py` (`CORS_ALLOWED_ORIGINS`), `backend/tasks/urls.py` (API routes).

- How Django REST Framework exposes APIs for React
  - Brief: DRF serializes models to JSON and exposes views (ViewSets) mapped by routers to URL endpoints; React consumes those JSON endpoints.
  - Project files: `backend/tasks/models.py`, `backend/tasks/serializers.py`, `backend/tasks/views.py`, `backend/tasks/urls.py`.

- Common patterns: Django as backend API; React as frontend UI
  - Brief: Typical architecture is Django serving JSON APIs and React handling UI and state; they communicate via HTTP. This enables multiple frontends (web/mobile) to reuse the same API.
  - Project files: `backend/tasks/*`, `frontend/src/*`.

- Example flow: React sends request → Django API returns JSON
  - Project-specific flow: `frontend/src/App.jsx` (fetch) → `backend/tasks/views.py` (`TaskViewSet`) → `backend/tasks/serializers.py` → `frontend/src/components/TaskList.jsx` (render).

---

**Pure Backend Questions**

- How React acts as a modern frontend for Django’s backend API
  - Brief: Django provides RESTful JSON endpoints; React requests those endpoints and renders responses as UI. This makes interactive client experiences possible while using Django for robust backend logic.
  - Project files: `backend/tasks/models.py`, `backend/tasks/serializers.py`, `backend/tasks/views.py`, `backend/tasks/urls.py`, `backend/backend/urls.py`.

- Model → Serializer → View → URL pipeline (how data is served)
  - Brief: Model defines data; Serializer converts to/from JSON; ViewSet handles HTTP and uses Serializer; Router maps URLs to ViewSet actions.
  - Project files: same as above: `backend/tasks/models.py`, `serializers.py`, `views.py`, `urls.py`.

- Understanding CORS (project context)
  - Brief: Backend must whitelist the frontend origin so the browser accepts cross-origin responses. See `CORS_ALLOWED_ORIGINS` in settings.
  - Project files: `backend/backend/settings.py`.

---

**Group Summary**

- React (frontend): Components (`frontend/src/components/*`), state/hooks, fetch API; responsible for UI and user interactions.
- Django (backend): Models, serializers, viewsets (`backend/tasks/*`), responsible for data, validation, and exposing JSON APIs.
- Interaction: React requests endpoints (`/api/tasks/`) and renders the returned JSON; common actions are list, create, update (PATCH), and delete.

If you'd like, I can now extract this Presentation section into `PRESENTATION.md` (one file you can print or present from). I will mark this update as completed in the todo list.

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


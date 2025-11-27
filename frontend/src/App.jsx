import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import AddTaskForm from './components/AddTaskForm'
import Loading from './components/Loading'
import Error from './components/Error'

// API base URL
const API_BASE_URL = 'http://localhost:8001/api/tasks/'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all tasks from the API
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_BASE_URL)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  // Add a new task
  const handleAddTask = async (title) => {
    try {
      setError(null)
  
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, completed: false }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newTask = await response.json()
      setTasks([newTask, ...tasks])
    } catch (err) {
      setError(err.message || 'Failed to add task')
      console.error('Error adding task:', err)
    }
  }

  // Update task (toggle completed status)
  const handleToggleTask = async (id, completed) => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedTask = await response.json()
      setTasks(tasks.map(task => 
        task.id === id ? updatedTask : task
      ))
    } catch (err) {
      setError(err.message || 'Failed to update task')
      console.error('Error updating task:', err)
    }
  }

  // Delete a task
  const handleDeleteTask = async (id) => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}${id}/`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      setError(err.message || 'Failed to delete task')
      console.error('Error deleting task:', err)
    }
  }

  return (
    <div 
      className="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{
        backgroundImage: 'url(/seamless-pattern-with-computer-hardware-icons_450837-134.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-xl p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
            Task Manager
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Organize your tasks efficiently
          </p>

          {error && <Error message={error} onClose={() => setError(null)} />}

          <AddTaskForm onAddTask={handleAddTask} />

          {loading ? (
            <Loading />
          ) : (
            <TaskList
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App


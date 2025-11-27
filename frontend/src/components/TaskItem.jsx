function TaskItem({ task, onToggle, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
        task.completed
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-center flex-1 min-w-0">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, task.completed)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer mr-3 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p
            className={`text-lg ${
              task.completed
                ? 'line-through text-gray-500'
                : 'text-gray-800 font-medium'
            }`}
          >
            {task.title}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Created: {formatDate(task.created_at)}
          </p>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex-shrink-0"
        aria-label="Delete task"
      >
        Delete
      </button>
    </div>
  )
}

export default TaskItem


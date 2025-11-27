import TaskItem from './TaskItem'

function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <div className="mt-6 text-center py-8">
        <p className="text-gray-500 text-lg">No tasks yet. Add one above!</p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Your Tasks ({tasks.length})
      </h2>
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggleTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  )
}

export default TaskList


from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Task model.
    Provides CRUD operations:
    - GET /api/tasks/ - List all tasks
    - POST /api/tasks/ - Create a new task
    - GET /api/tasks/<id>/ - Retrieve a specific task
    - PUT /api/tasks/<id>/ - Update a task (full update)
    - PATCH /api/tasks/<id>/ - Update a task (partial update)
    - DELETE /api/tasks/<id>/ - Delete a task
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


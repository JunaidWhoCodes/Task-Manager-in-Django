from django.db import models


class Task(models.Model):
    """
    Task model representing a single task item.
    """
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']  # Newest tasks first

    def __str__(self):
        return self.title


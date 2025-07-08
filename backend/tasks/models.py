from django.db import models
from django.contrib.auth.models import User
from core.models import TimeStampedModel

class Task(TimeStampedModel):      
    title = models.CharField(max_length=200)
    task_type = models.CharField(max_length=20, choices=[('job', 'Job'), ('general', 'General')], default='general')
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_tasks', null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.task_type.capitalize()}: {self.title}"


## rename to event
class GeneralTask(Task):
    """
    Non-job tasks, like meetings, reminders, etc.
    """
    def save(self, *args, **kwargs):
        self.task_type = 'general'
        super().save(*args, **kwargs)

# Create your models here.

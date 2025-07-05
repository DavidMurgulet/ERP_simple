from django.db import models
from django.contrib.auth.models import User
from core.models import TimeStampedModel

class Task(TimeStampedModel):      
    title = models.CharField(max_length=200)
    task_type = models.CharField(max_length=20, choices=[('job', 'Job'), ('general', 'General')], default='general')
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    due_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.task_type.capitalize()}: {self.title}"
    

class JobTask(Task):
    """
    Tasks specifically for job-related activities
    """
    MANUFACTURING_STAGE = [
        ('cnc', 'CNC'),
        ('sanding', 'Sanding'),
        ('painting', 'Painting'),
        ('assembly', 'Assembly'),
        ('delivery', 'Delivery'),
        ('installation', 'Installation'),   
        ('completed', 'Completed')
    ]
    # client = models.ForeignKey('clients.Client', on_delete=models.CASCADE, related_name='job_tasks')  # Temporarily commented out - clients app doesn't exist
    client_name = models.CharField(max_length=200, blank=True, help_text="Client name for this job task")
    task_progress = models.CharField(max_length=20, choices=MANUFACTURING_STAGE, default='cnc')
    ## review these fields
    plans = models.FileField(upload_to='job_tasks/plans/', null=True, blank=True)
    materials = models.TextField(blank=True, help_text="List of materials needed for this task")

    def save(self, *args, **kwargs):
        self.task_type = 'job'
        super().save(*args, **kwargs)

class GeneralTask(Task):
    """
    Non-job tasks, like meetings, reminders, etc.
    """
    def save(self, *args, **kwargs):
        self.task_type = 'general'
        super().save(*args, **kwargs)

# Create your models here.

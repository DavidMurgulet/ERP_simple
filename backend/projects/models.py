from django.db import models
from django.contrib.auth.models import User
from core.models import TimeStampedModel

# Create your models here.


class Project(TimeStampedModel):
    """
    Project model representing a manufacturing project.
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

    PROGRESS = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    title = models.CharField(max_length=200)
    due_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_tasks', null=True, blank=True)
    #updated at and created at are inherited from TimeStampedModel

    client_name = models.CharField(max_length=200, blank=True, help_text="Client name for this job task")
    manufacture_stage = models.CharField(max_length=20, choices=MANUFACTURING_STAGE, default='cnc')
    progress = models.CharField(max_length=20, choices=PROGRESS, default='not_started', help_text="Current progress of the job task")


    # plans = models.FileField(upload_to='job_tasks/plans/', null=True, blank=True)
    # materials = models.TextField(blank=True, help_text="List of materials needed for this job task")

    def save(self, *args, **kwargs):
        self.task_type = 'job'
        super().save(*args, **kwargs)

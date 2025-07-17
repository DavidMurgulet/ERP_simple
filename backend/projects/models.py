from django.db import models
from django.contrib.auth.models import User
from core.models import TimeStampedModel

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
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_projects', null=True, blank=True)
    ## updated_at
    ## created_at
    
    client_name = models.CharField(max_length=200, blank=True, help_text="Client name for this project")
    manufacture_stage = models.CharField(max_length=20, choices=MANUFACTURING_STAGE, default='cnc')
    progress = models.CharField(max_length=20, choices=PROGRESS, default='not_started', help_text="Current progress of the project")
    is_completed = models.BooleanField(default=False, help_text="Indicates if the project is completed")

    # TODO: plans stored on s3 bucket
    # TODO: materials implemented when inventory is implemented
    # plans = models.FileField(upload_to='projects/plans/', null=True, blank=True)
    # materials = models.TextField(blank=True, help_text="List of materials needed for this project")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

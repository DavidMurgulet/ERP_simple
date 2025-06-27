from django.db import models
from django.contrib.auth.models import User
from core.models import TimeStampedModel

class TaskCategory(TimeStampedModel):
    """
    Categories for organizing tasks
    """
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default="#007bff")  # Hex color
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Task Categories"

class Task(TimeStampedModel):
    """
    Todo tasks/items
    """
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_tasks')
    category = models.ForeignKey(TaskCategory, on_delete=models.SET_NULL, null=True, blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    due_date = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.title} - {self.assigned_to.username}"
    
    class Meta:
        ordering = ['-created_at']

# Create your models here.

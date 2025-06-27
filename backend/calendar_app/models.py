from django.db import models
from django.contrib.auth.models import User
from core.models import TimeStampedModel

class Event(TimeStampedModel):
    """
    Calendar events
    """
    EVENT_TYPES = [
        ('meeting', 'Meeting'),
        ('deadline', 'Deadline'),
        ('appointment', 'Appointment'),
        ('reminder', 'Reminder'),
        ('holiday', 'Holiday'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    event_type = models.CharField(max_length=15, choices=EVENT_TYPES, default='other')
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events')
    attendees = models.ManyToManyField(User, blank=True, related_name='attending_events')
    location = models.CharField(max_length=200, blank=True)
    is_all_day = models.BooleanField(default=False)
    is_recurring = models.BooleanField(default=False)
    color = models.CharField(max_length=7, default="#007bff")  # Hex color
    
    def __str__(self):
        return f"{self.title} - {self.start_datetime.strftime('%Y-%m-%d %H:%M')}"
    
    class Meta:
        ordering = ['start_datetime']

# Create your models here.

from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class CustomUser(User):
    """
    Custom user model extending Django's User model.
    This can be used to add additional fields or methods in the future.
    """
    # Add any custom fields here if needed
    # For example:
    # bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.username})"

    class Meta:
        verbose_name = "Custom User"
        verbose_name_plural = "Custom Users"
        ordering = ['username']
    
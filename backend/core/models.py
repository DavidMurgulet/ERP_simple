from django.db import models
from django.contrib.auth.models import User

class TimeStampedModel(models.Model):
    """
    Abstract base class with created_at and updated_at fields
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class Company(models.Model):
    """
    Company information - central to ERP
    """
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Companies"

# Create your models here.

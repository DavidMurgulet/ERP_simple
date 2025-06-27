from django.db import models
from django.contrib.auth.models import User
from core.models import TimeStampedModel, Company

class Department(TimeStampedModel):
    """
    Company departments
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.name} - {self.company.name}"

class Employee(TimeStampedModel):
    """
    Employee information extending Django's User model
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True)
    position = models.CharField(max_length=100)
    hire_date = models.DateField()
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} ({self.employee_id})"

# Create your models here.

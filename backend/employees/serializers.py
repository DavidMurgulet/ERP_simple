from rest_framework import serializers
from .models import Employee, Department
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'description', 'company', 'created_at', 'updated_at']

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    
    class Meta:
        model = Employee
        fields = ['id', 'user', 'employee_id', 'department', 'position', 'hire_date', 
                 'salary', 'phone', 'address', 'is_active', 'created_at', 'updated_at']

class EmployeeCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField()
    department_id = serializers.IntegerField()
    
    class Meta:
        model = Employee
        fields = ['user_id', 'employee_id', 'department_id', 'position', 'hire_date', 
                 'salary', 'phone', 'address', 'is_active']

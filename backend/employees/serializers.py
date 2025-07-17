from rest_framework import serializers
from .models import Employee
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 
            'user',
            'employee_id', 
            'position', 
            'phone', 
            'address', 
            'is_active',
            'first_name',  # From user
            'last_name',   # From user
            'email'        # From user
        ]
        read_only_fields = ['id', 'user']

class EmployeeCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField()
    
    class Meta:
        model = Employee
        fields = [
            'user_id',
            'employee_id',
            'position',
            'phone',
            'address',
            'is_active'
        ]

        def create(self, validated_data):
            user_id = validated_data.pop('user_id')
            user = User.objects.get(id=user_id)
            employee = Employee.objects.create(user=user, **validated_data)
            return employee
        
        def validate_user_id(self, u_id):
            """Ensure the user exists and doesn't already have an employee record"""
            try:
                user = User.objects.get(id=u_id)
                if hasattr(user, 'employee'):
                    raise serializers.ValidationError(
                        "This user already has an employee record.")
            except User.DoesNotExist:
                raise serializers.ValidationError("User does not exist.")
            return u_id



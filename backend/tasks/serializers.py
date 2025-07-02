from rest_framework import serializers
from .models import Task, TaskCategory
from django.contrib.auth.models import User

class TaskCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskCategory
        fields = ['id', 'name', 'color', 'created_at', 'updated_at']

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSimpleSerializer(read_only=True)
    created_by = UserSimpleSerializer(read_only=True)
    category = TaskCategorySerializer(read_only=True)
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'assigned_to', 'created_by', 'category',
                 'priority', 'status', 'due_date', 'completed_at', 'created_at', 'updated_at']

class TaskCreateSerializer(serializers.ModelSerializer):
    assigned_to_id = serializers.IntegerField()
    category_id = serializers.IntegerField(required=False, allow_null=True)
    
    class Meta:
        model = Task
        fields = ['title', 'description', 'assigned_to_id', 'category_id', 
                 'priority', 'status', 'due_date']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

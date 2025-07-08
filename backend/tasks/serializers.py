from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class TaskSerializer(serializers.ModelSerializer):
    created_by = UserSimpleSerializer(read_only=True)
    updated_by = UserSimpleSerializer(read_only=True)
    is_completed = serializers.SerializerMethodField()
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'task_type', 'created_by', 'updated_by',
                 'due_date', 'completed_at', 'is_completed', 'created_at', 'updated_at']
    
    def get_is_completed(self, obj):
        return obj.completed_at is not None

class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'task_type', 'due_date']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

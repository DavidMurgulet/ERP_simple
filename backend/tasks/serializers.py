from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserSimpleSerializer(read_only=True)
    created_by = UserSimpleSerializer(read_only=True)
    status_color = serializers.ReadOnlyField()
    priority_color = serializers.ReadOnlyField()
    
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'assigned_to', 'created_by', 'category',
                 'priority', 'status', 'due_date', 'completed_at', 'add_to_calendar',
                 'status_color', 'priority_color', 'created_at', 'updated_at']

class TaskCreateSerializer(serializers.ModelSerializer):
    assigned_to_id = serializers.IntegerField()
    category_id = serializers.IntegerField(required=False, allow_null=True)
    
    class Meta:
        model = Task
        fields = ['title', 'description', 'assigned_to_id', 'category_id', 
                 'priority', 'status', 'due_date', 'add_to_calendar']
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

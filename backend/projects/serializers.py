from rest_framework import serializers
from .models import Project
from django.contrib.auth.models import User

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class ProjectReadSerializer(serializers.ModelSerializer):
    updated_by = UserSimpleSerializer(read_only=True)

    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'due_date',
            'updated_by',
            'created_at',
            'updated_at',
            'client_name',
            'manufacture_stage',
            'progress',
            'is_completed',
        ]


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['title', 'due_date', 'client_name', 'manufacture_stage', 'progress']

    def create(self, validated_data):
        validated_data['updated_by'] = self.context['request'].user
        return super().create(validated_data)

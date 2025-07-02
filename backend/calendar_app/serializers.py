from rest_framework import serializers
from .models import Event
from django.contrib.auth.models import User

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class EventSerializer(serializers.ModelSerializer):
    organizer = UserSimpleSerializer(read_only=True)
    attendees = UserSimpleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'start_datetime', 'end_datetime', 
                 'event_type', 'organizer', 'attendees', 'location', 'is_all_day', 
                 'is_recurring', 'color', 'created_at', 'updated_at']

class EventCreateSerializer(serializers.ModelSerializer):
    attendee_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
    
    class Meta:
        model = Event
        fields = ['title', 'description', 'start_datetime', 'end_datetime', 
                 'event_type', 'attendee_ids', 'location', 'is_all_day', 
                 'is_recurring', 'color']
    
    def create(self, validated_data):
        attendee_ids = validated_data.pop('attendee_ids', [])
        validated_data['organizer'] = self.context['request'].user
        event = super().create(validated_data)
        
        if attendee_ids:
            attendees = User.objects.filter(id__in=attendee_ids)
            event.attendees.set(attendees)
        
        return event

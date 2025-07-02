from django.shortcuts import render
from django.db import models
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Event
from .serializers import EventSerializer, EventCreateSerializer

class EventListCreateView(generics.ListCreateAPIView):
    """
    List all events or create a new event
    """
    queryset = Event.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EventCreateSerializer
        return EventSerializer
    
    def get_queryset(self):
        queryset = Event.objects.all()
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        if start_date:
            queryset = queryset.filter(start_datetime__gte=start_date)
        if end_date:
            queryset = queryset.filter(end_datetime__lte=end_date)
            
        # Filter by event type
        event_type = self.request.query_params.get('event_type', None)
        if event_type:
            queryset = queryset.filter(event_type=event_type)
            
        return queryset.order_by('start_datetime')

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an event
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_events(request):
    """
    Get events where user is organizer or attendee
    """
    events = Event.objects.filter(
        models.Q(organizer=request.user) | models.Q(attendees=request.user)
    ).distinct().order_by('start_datetime')
    
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def calendar_view(request):
    """
    Get calendar view for a specific month/week
    """
    # Get query parameters
    year = int(request.query_params.get('year', timezone.now().year))
    month = int(request.query_params.get('month', timezone.now().month))
    
    # Calculate date range for the month
    start_date = datetime(year, month, 1)
    if month == 12:
        end_date = datetime(year + 1, 1, 1) - timedelta(days=1)
    else:
        end_date = datetime(year, month + 1, 1) - timedelta(days=1)
    
    events = Event.objects.filter(
        start_datetime__date__gte=start_date.date(),
        start_datetime__date__lte=end_date.date()
    ).order_by('start_datetime')
    
    serializer = EventSerializer(events, many=True)
    return Response({
        'year': year,
        'month': month,
        'events': serializer.data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def upcoming_events(request):
    """
    Get upcoming events (next 7 days)
    """
    start_date = timezone.now()
    end_date = start_date + timedelta(days=7)
    
    events = Event.objects.filter(
        start_datetime__gte=start_date,
        start_datetime__lte=end_date
    ).filter(
        models.Q(organizer=request.user) | models.Q(attendees=request.user)
    ).distinct().order_by('start_datetime')
    
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

# Create your views here.

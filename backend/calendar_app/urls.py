from django.urls import path
from . import views

urlpatterns = [
    # Event URLs
    path('events/', views.EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    path('events/my-events/', views.my_events, name='my-events'),
    path('events/upcoming/', views.upcoming_events, name='upcoming-events'),
    path('calendar/', views.calendar_view, name='calendar-view'),
]

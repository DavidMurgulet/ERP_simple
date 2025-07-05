from django.urls import path
from . import views

urlpatterns = [
    
    # Task URLs
    path('tasks/', views.TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
    path('tasks/<int:pk>/complete/', views.complete_task, name='task-complete'),
    path('tasks/my-tasks/', views.my_tasks, name='my-tasks'),
    path('tasks/stats/', views.task_stats, name='task-stats'),
    path('tasks/with-colors/', views.tasks_with_colors, name='tasks-with-colors'),
]

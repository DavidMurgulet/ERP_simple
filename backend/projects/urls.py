from django.urls import path
from . import views

urlpatterns = [
    # Project URLs
    path('', views.list_projects, name='list-projects'),
    path('create/', views.create_project, name='create-project'),
    path('<int:pk>/', views.project_detail, name='project-detail'),
    path('<int:pk>/update/', views.update_project, name='update-project'),
    path('<int:pk>/delete/', views.delete_project, name='delete-project'),
    path('<int:pk>/complete/', views.complete_project, name='complete-project'),
    path('completed/', views.get_completed, name='get-completed-projects'),
    path('in-progress/', views.get_in_progress, name='get-in-progress-projects'),
]

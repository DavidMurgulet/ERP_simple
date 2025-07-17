from django.urls import path
from . import views

urlpatterns = [
    # Employee URLs
    path('', views.list_employees, name='list-employees'),
    path('create/', views.create_employee, name='create-employee'),
    path('<int:pk>/', views.get_employee, name='get-employee'),
    path('<int:pk>/update/', views.update_employee, name='update-employee'),
    path('<int:pk>/delete/', views.delete_employee, name='delete-employee'),
    path('stats/', views.employee_stats, name='employee-stats'),
]
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('user/', views.current_user_view, name='current_user'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('django.contrib.auth.urls')), 
    
    # Authentication
    path("api/auth/", include("authentication.urls")),
    
    # API Endpoints
    path("api/projects/", include("projects.urls")),
    path("api/employees/", include("employees.urls")),
    path("api/calendar/", include("calendar_app.urls")),
    # path("api/inventory/", include("inventory.urls")),    # Add when ready
    # path("api/jobs/", include("job.urls")),               # Add when ready
    
    # DRF Browsable API
    path("api-auth/", include("rest_framework.urls")),
]

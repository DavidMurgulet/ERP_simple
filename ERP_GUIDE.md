# ERP System Structure Guide

## Django Concepts Explained

### **Models** 🗃️
Models de   # Example: projects/views.py
   class ProjectListView(generics.ListCreateAPIView):
       queryset = Project.objects.all()
       serializer_class = ProjectSerializer your data structure (like database tables):
- Each model class = one database table
- Fields define columns (CharField, IntegerField, ForeignKey, etc.)
- Methods define behavior
- Example: `Employee`, `Project`, `Product`

### **Views** 🎯
Views handle business logic and HTTP requests:
- Function-based views or Class-based views
- Process requests, interact with models, return responses
- Example: `CreateUserView`, `ProjectListView`

### **Apps** 📦
Apps are modular components grouping related functionality:
- Each app has models, views, URLs, templates
- Keeps code organized and reusable
- Example: `authentication`, `projects`, `inventory`

## Your ERP Structure

```
backend/
├── core/                    # 🏗️ Shared utilities, base models
│   ├── models.py           # TimeStampedModel, Company
│   └── ...
├── authentication/         # 👤 User management, login, permissions
│   ├── models.py           # UserProfile
│   ├── views.py            # CreateUserView, UserProfileView
│   ├── serializers.py      # UserSerializer, UserProfileSerializer
│   └── urls.py
├── employees/              # 👥 HR management
│   ├── models.py           # Employee, Department
│   └── ...
├── projects/               # ✅ Project management, tracking
│   ├── models.py           # Project, ProjectCategory
│   └── ...
├── calendar_app/           # 📅 Calendar events, scheduling
│   ├── models.py           # Event
│   └── ...
├── inventory/              # 📦 Inventory management
│   ├── models.py           # Product, Category, Supplier, StockMovement
│   └── ...
├── job/                    # 💼 Job/project management (your existing app)
└── api/                    # 🔌 General API utilities (your existing app)
```

## Models Created

### **Core Models**
- `TimeStampedModel`: Abstract base class with created_at/updated_at
- `Company`: Company information

### **Authentication Models**
- `UserProfile`: Extended user information (phone, bio, etc.)

### **Employee Models**
- `Department`: Company departments
- `Employee`: Employee information linked to Django User

### **Project Models**
- `Project`: Manufacturing projects with progress tracking, client management
- `ProjectCategory`: Organize projects by category

### **Calendar Models**
- `Event`: Calendar events with attendees, recurring options

### **Inventory Models**
- `Category`: Product categories (hierarchical)
- `Supplier`: Vendor information
- `Product`: Inventory items with SKU, pricing, stock levels
- `StockMovement`: Track inventory changes

## API Endpoints Created

- `POST /api/auth/register/` - Create new user
- `POST /api/auth/token/` - Get JWT token
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET/PUT /api/auth/profile/` - User profile management

## Next Steps

1. **Create Views & Serializers** for each app:
   ```python
   # Example: projects/views.py
   class ProjectListCreateView(generics.ListCreateAPIView):
       queryset = Project.objects.all()
       serializer_class = ProjectSerializer
   ```

2. **Add URLs** for each app:
   ```python
   # projects/urls.py
   urlpatterns = [
       path('', ProjectListCreateView.as_view(), name='project-list'),
       path('<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
   ]
   ```

3. **Register models in admin.py** for easy management:
   ```python
   # projects/admin.py
   @admin.register(Project)
   class ProjectAdmin(admin.ModelAdmin):
       list_display = ['title', 'client_name', 'progress', 'due_date']
   ```

4. **Create a frontend** (React, Vue, or Django templates)

5. **Add more features**:
   - File uploads (install Pillow for images)
   - Email notifications
   - Reporting and analytics
   - Permissions and roles

## Key Django Patterns

1. **Model Relationships**:
   - `ForeignKey`: One-to-many (Employee → Department)
   - `OneToOneField`: One-to-one (User → UserProfile)
   - `ManyToManyField`: Many-to-many (Event → Attendees)

2. **Model Inheritance**:
   - `TimeStampedModel` as abstract base class
   - Adds common fields to all models

3. **RESTful API Design**:
   - Use DRF ViewSets or generic views
   - Consistent URL patterns
   - Proper HTTP methods (GET, POST, PUT, DELETE)

This structure gives you a solid foundation for your ERP system! Each app is focused on a specific business domain, making the code maintainable and scalable.

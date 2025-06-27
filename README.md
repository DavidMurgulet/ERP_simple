# ERP Simple - Enterprise Resource Planning System

A comprehensive ERP system built with Django REST Framework, designed to integrate various business functions including HR management, task management, inventory control, calendar scheduling, and more.

## 🚀 Features

- **Authentication System**: User registration, login, and JWT token-based authentication
- **Employee Management**: HR functionality with departments and employee profiles
- **Task Management**: Todo lists with categories, priorities, and assignments
- **Calendar System**: Event scheduling with attendees and recurring options
- **Inventory Management**: Product tracking with categories, suppliers, and stock movements
- **Job Management**: Project and job tracking
- **Modular Architecture**: Clean separation of concerns with Django apps

## 🏗️ Project Structure

```
backend/
├── core/                    # Shared utilities and base models
├── authentication/          # User management and authentication
├── employees/              # HR management
├── tasks/                  # Todo lists and task management
├── calendar_app/           # Calendar events and scheduling
├── inventory/              # Inventory and product management
├── job/                    # Job and project management
└── backend/                # Django project settings
```

## 🛠️ Technology Stack

- **Backend**: Django 5.2, Django REST Framework
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Authentication**: JWT tokens with SimpleJWT
- **API**: RESTful API design
- **Python**: 3.13+

## 📋 Requirements

- Python 3.13+
- Django 5.2+
- Django REST Framework
- django-cors-headers
- djangorestframework-simplejwt

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd erp_simple
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations**
   ```bash
   cd backend
   python manage.py migrate
   ```

5. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/token/` - Get JWT token
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Admin
- `/admin/` - Django admin interface

## 🔧 Development

### Models
Each app contains models that define the data structure:
- **Core**: `TimeStampedModel`, `Company`
- **Employees**: `Employee`, `Department`
- **Tasks**: `Task`, `TaskCategory`
- **Calendar**: `Event`
- **Inventory**: `Product`, `Category`, `Supplier`, `StockMovement`

### Adding New Features
1. Create new Django app: `python manage.py startapp app_name`
2. Add to `INSTALLED_APPS` in settings
3. Create models, views, serializers
4. Add URL patterns
5. Run migrations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🚧 Roadmap

- [ ] Frontend development (React/Vue.js)
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] File upload functionality
- [ ] Multi-tenancy support
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

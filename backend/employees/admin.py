from django.contrib import admin
from .models import Employee

# @admin.register(Department)
# class DepartmentAdmin(admin.ModelAdmin):
#     list_display = ['name', 'company', 'created_at']
#     list_filter = ['company', 'created_at']
#     search_fields = ['name', 'description']

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'get_full_name', 'position', 'is_active']
    list_filter = ['position', 'is_active']
    search_fields = ['user__first_name', 'user__last_name', 'employee_id', 'position']
    
    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    get_full_name.short_description = 'Full Name'

# Register your models here.

from django.contrib import admin
from .models import Task, TaskCategory

@admin.register(TaskCategory)
class TaskCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'created_at']
    search_fields = ['name']

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'assigned_to', 'created_by', 'status', 'priority', 'due_date', 'created_at']
    list_filter = ['status', 'priority', 'category', 'created_at', 'due_date']
    search_fields = ['title', 'description', 'assigned_to__username', 'created_by__username']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_by', 'completed_at']
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set created_by when creating new task
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

# Register your models here.

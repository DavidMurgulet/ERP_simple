from django.contrib import admin
from .models import Task, Project, GeneralTask

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'task_type', 'created_by', 'due_date', 'completed_at', 'created_at']
    list_filter = ['task_type', 'created_at', 'due_date']
    search_fields = ['title', 'description', 'created_by__username']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_by', 'completed_at']
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set created_by when creating new task
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'task_type', 'client_name', 'stage', 'progress', 'created_by', 'due_date', 'created_at']
    list_filter = ['task_type', 'stage', 'progress', 'created_at', 'due_date']
    search_fields = ['title', 'description', 'client_name', 'created_by__username']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_by', 'completed_at']
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set created_by when creating new task
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

@admin.register(GeneralTask)
class GeneralTaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'task_type', 'created_by', 'due_date', 'completed_at', 'created_at']
    list_filter = ['task_type', 'created_at', 'due_date']
    search_fields = ['title', 'description', 'created_by__username']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_by', 'completed_at']
    
    def save_model(self, request, obj, form, change):
        if not change:  # Only set created_by when creating new task
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

# Register your models here.

from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'client_name', 'manufacture_stage',
                    'progress', 'is_completed', 'due_date', 'created_at']
    list_filter = ['manufacture_stage', 'progress', 'is_completed', 'created_at', 'due_date']
    search_fields = ['title', 'client_name']
    date_hierarchy = 'created_at'
    readonly_fields = ['created_at', 'updated_at']

    def save_model(self, request, obj, form, change):
        if not change:  # Only set updated_by when creating new project
            obj.updated_by = request.user
        else:  # Always update updated_by when editing
            obj.updated_by = request.user
        super().save_model(request, obj, form, change)
# Register your models here.

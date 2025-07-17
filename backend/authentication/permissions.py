from rest_framework.permissions import BasePermission

class IsManager(BasePermission):
    """
    Custom permission to only allow users in the 'Manager' group to access certain views.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        return request.user.groups.filter(name='Manager').exists()
    



class isEmployee(BasePermission):
    """
    Custom permission to only allow users in the 'Employee' group to access certain views.
    """
        
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        return request.user.groups.filter(name='Employee').exists()

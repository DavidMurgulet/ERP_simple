from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Employee, Department
from .serializers import EmployeeSerializer, EmployeeCreateSerializer, DepartmentSerializer

class DepartmentListCreateView(generics.ListCreateAPIView):
    """
    List all departments or create a new department
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a department
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

class EmployeeListCreateView(generics.ListCreateAPIView):
    """
    List all employees or create a new employee
    """
    queryset = Employee.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EmployeeCreateSerializer
        return EmployeeSerializer

class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete an employee
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_stats(request):
    """
    Get employee statistics
    """
    total_employees = Employee.objects.filter(is_active=True).count()
    total_departments = Department.objects.count()
    
    return Response({
        'total_employees': total_employees,
        'total_departments': total_departments,
        'active_employees': Employee.objects.filter(is_active=True).count(),
        'inactive_employees': Employee.objects.filter(is_active=False).count(),
    })

# Create your views here.

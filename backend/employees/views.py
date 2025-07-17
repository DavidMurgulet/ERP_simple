from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Employee
from .serializers import EmployeeSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_employees(request):
    """
    List all employees.
    """
    employees = Employee.objects.all().order_by('user__username')
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_employee(request):
    """
    Create a new employee.
    """
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        employee = serializer.save()
        return Response(EmployeeSerializer(employee).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def get_employee(request, pk):
    """
    Retrieve an employee by ID.
    """
    try:
        employee = Employee.objects.get(pk=pk)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_employee(request, pk):
    """
    Update an existing employee.
    """
    try:
        employee = Employee.objects.get(pk=pk)
        serializer = EmployeeSerializer(employee, data=request.data)
        if serializer.is_valid():
            employee = serializer.save()
            return Response(EmployeeSerializer(employee).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_employee(request, pk):
    """
    Delete an employee.
    """
    try:
        employee = Employee.objects.get(pk=pk)
        employee.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Employee.DoesNotExist:
        return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

# class EmployeeListCreateView(generics.ListCreateAPIView):
#     """
#     List all employees or create a new employee
#     """
#     queryset = Employee.objects.all()
#     permission_classes = [IsAuthenticated]
    
#     def get_serializer_class(self):
#         if self.request.method == 'POST':
#             return EmployeeCreateSerializer
#         return EmployeeSerializer

# class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
#     """
#     Retrieve, update or delete an employee
#     """
#     queryset = Employee.objects.all()
#     serializer_class = EmployeeSerializer
#     permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_stats(request):
    """
    Get employee statistics
    """
    total_employees = Employee.objects.filter(is_active=True).count()
    # total_departments = Department.objects.count()
    
    return Response({
        'total_employees': total_employees,
        # 'total_departments': total_departments,
        'active_employees': Employee.objects.filter(is_active=True).count(),
        'inactive_employees': Employee.objects.filter(is_active=False).count(),
    })

# Create your views here.

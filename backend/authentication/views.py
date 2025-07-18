from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer
from django.db import transaction
from employees.models import Employee
from employees.serializers import EmployeeCreateSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Register a new user.
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            with transaction.atomic():
                # Create the user
                user = serializer.save()

                position = request.data.get('position')
                if not position or position.strip() == '':
                    position = 'Employee'


                employee = Employee.objects.create(
                    user=user,    
                    # Auto-generate employee ID
                    employee_id=f"EMP{user.id:04d}",
                    position=position,
                    phone=request.data.get('phone', ''),
                    address=request.data.get('address', ''),
                    is_active=True
                )


                print(f"User created: {user.username}")  # Debug log
                print(f"Employee created: {employee.employee_id}")  # Debug log

                # Generate JWT tokens
                from rest_framework_simplejwt.tokens import RefreshToken
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token

                return Response({
                    'user': UserSerializer(user).data,
                    'employee_id': employee.employee_id,
                    'access': str(access_token),
                    'refresh': str(refresh),
                    'message': 'Registration successful'
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Registration error: {str(e)}")
            return Response({
                'error': 'Registration failed. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    print(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Login view using email and password
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'user': UserSerializer(user).data,
            'access': str(access_token),
            'refresh': str(refresh),
            'message': 'Login successful'
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user_view(request):
    """
    Get current authenticated user
    """
    return Response(UserSerializer(request.user).data)
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserSerializer

class CreateUserView(generics.CreateAPIView):
    """
    View to create a new user.
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        print(f"Registration request data: {request.data}")  # Debug log
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")  # Debug log
            
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        print(f"User created successfully: {user.username}")  # Debug log
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        return Response({
            'user': UserSerializer(user).data,
            'access': str(access_token),
            'refresh': str(refresh),
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)

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
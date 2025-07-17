from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Project
from .serializers import ProjectReadSerializer, ProjectCreateSerializer

## ENDPOINTS NEEDED:
# - List all projects or create a new project
# - Retrieve, update or delete a project

# - Project page will be a list of projects 
# -     Mark a project as completed
# -     will be split into in-progress and completed projects
# -     Ordered alphabetically by title

# - COMPLETED PROJECTS (dropdown for below in-progress projects)
# -     Will be a list of completed projects
# -     Clicking on a project will show the project details
# -     Project details will show the project title, due date, client name, and completed date.

# Clicking on a project will show the project details
# -     Project details will show the project title, due date, client name.

# Search bar at top.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_projects(request):
    projects = Project.objects.all().order_by('-title')
    serializer = ProjectReadSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    serializer = ProjectCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        project = serializer.save()
        return Response(ProjectReadSerializer(project).data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_project(request, pk):
    """
    Delete a project
    """
    try:
        project = Project.objects.get(pk=pk)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_detail(request, pk):
    try:
        project = Project.objects.get(pk=pk)
        serializer = ProjectReadSerializer(project)
        return Response(serializer.data)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=404)
    

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_project(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=404)

    serializer = ProjectCreateSerializer(
        project, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save(updated_by=request.user)
        return Response(ProjectReadSerializer(project).data)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_project(request, pk):
    """
    Mark a project as completed
    """
    try:
        project = Project.objects.get(pk=pk)
        project.is_completed = True  # Assuming you have an is_completed field
        project.save()
        
        serializer = ProjectReadSerializer(project)
        return Response(serializer.data)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_completed(request):
    """
    Get completed projects
    """

    projects = Project.objects.filter(is_completed=True).order_by('-title')
    serializer = ProjectReadSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_in_progress(request):
    """
    Get in-progress projects
    """

    projects = Project.objects.filter(is_completed=False).order_by('-title')
    serializer = ProjectReadSerializer(projects, many=True)
    return Response(serializer.data)
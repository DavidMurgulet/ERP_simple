from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Task
from .serializers import ProjectReadSerializer, ProjectCreateSerializer


class ProjectListCreateView(generics.ListCreateAPIView):
    """
    List all projects / create a new project
    """
    queryset = Task.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectCreateSerializer # Replace with your TaskCreateSerializer if you have one
        return ProjectReadSerializer #

    def get_queryset(self):
        queryset = Task.objects.all()
        task_type = self.request.query_params.get('task_type', None)

        if task_type:
            queryset = queryset.filter(task_type=task_type)

        return queryset.order_by('-created_at')


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a task
    """
    queryset = Task.objects.all()
    serializer_class = ProjectReadSerializer  # Replace with your TaskReadSerializer if you have one
    permission_classes = [IsAuthenticated]


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_task(request, pk):
    """
    Mark a task as completed
    """
    try:
        task = Task.objects.get(pk=pk)
        task.completed_at = timezone.now()
        task.save()

        serializer = TaskSerializer(task)
        return Response(serializer.data)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_tasks(request):
    """
    Get tasks created by the current user
    """
    tasks = Task.objects.filter(
        created_by=request.user).order_by('-created_at')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_stats(request):
    """
    Get task statistics
    """
    total_tasks = Task.objects.count()
    completed_tasks = Task.objects.filter(completed_at__isnull=False).count()
    pending_tasks = Task.objects.filter(completed_at__isnull=True).count()
    job_tasks = Task.objects.filter(task_type='job').count()
    general_tasks = Task.objects.filter(task_type='general').count()

    return Response({
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'pending_tasks': pending_tasks,
        'job_tasks': job_tasks,
        'general_tasks': general_tasks,
        'completion_rate': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def tasks_by_type(request):
    """
    Get tasks grouped by type (job/general)
    """
    tasks = Task.objects.all().order_by('-created_at')
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

# Create your views here.

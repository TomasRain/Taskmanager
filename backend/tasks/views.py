from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer
from rest_framework.permissions import IsAuthenticated
from projects.models import Project

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(project__members__in=[user]) | Task.objects.filter(project__created_by=user)

    def perform_create(self, serializer):
        project_id = self.request.data.get('project_id')
        try:
            project = Project.objects.get(id=project_id)
            if project:
                serializer.save(project=project)
        except Project.DoesNotExist:
            pass

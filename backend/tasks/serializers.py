from rest_framework import serializers
from .models import Task
from users.models import User

class TaskSerializer(serializers.ModelSerializer):
    project = serializers.ReadOnlyField(source='project.name')
    assigned_to = serializers.SlugRelatedField(
        slug_field='username',
        queryset=User.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'priority', 'project', 'assigned_to', 'due_date', 'created_at']

from rest_framework import serializers
from .models import Project
from users.models import User

class ProjectSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    members = serializers.SlugRelatedField(
        many=True,
        slug_field='username',
        queryset=User.objects.all(),
        required=False
    )

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'created_by', 'members', 'created_at']

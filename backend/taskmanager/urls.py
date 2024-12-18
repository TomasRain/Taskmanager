# backend/taskmanager/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from users.views import RegisterView, UserDetailView, check_username, check_email
from rest_framework import routers
from projects.views import ProjectViewSet
from tasks.views import TaskViewSet

router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/user/', UserDetailView.as_view(), name='user_detail'),
    path('api/check-username/<str:username>/', check_username, name='check_username'),  # 用户名检查路由
    path('api/check-email/<str:email>/', check_email, name='check_email'),  # 新增的邮箱检查路由
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
]

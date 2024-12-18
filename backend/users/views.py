# backend/users/views.py

from rest_framework import generics
from .models import User
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes

# 用户注册视图
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        try:
            # 创建用户
            response = super().create(request, *args, **kwargs)
            
            # 获取用户对象
            user = User.objects.get(username=request.data['username'])
            
            # 生成JWT token
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # 返回token和用户信息
            return Response({
                'access': str(access_token),
                'refresh': str(refresh),
                'username': user.username,
                'email': user.email,
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 用户详情视图
class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            return Response({
                'username': user.username,
                'email': user.email,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 检查用户名是否可用的视图
@api_view(['GET'])
@permission_classes([AllowAny])  # 允许任何人访问
def check_username(request, username):
    try:
        print(f"Received request for username: {username}")
        if User.objects.filter(username=username).exists():
            return Response({'available': False}, status=status.HTTP_200_OK)
        return Response({'available': True}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error: {e}")
        return Response({'error': '服务器内部错误'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 检查邮箱是否可用的视图
@api_view(['GET'])
@permission_classes([AllowAny])  # 允许任何人访问
def check_email(request, email):
    try:
        if User.objects.filter(email=email).exists():
            return Response({'available': False}, status=status.HTTP_200_OK)
        return Response({'available': True}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

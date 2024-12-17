# backend/users/views.py
from rest_framework import generics
from .models import User
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
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
        })

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
        }, status=status.HTTP_200_OK)


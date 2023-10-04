from django.urls import path, include
from rest_framework import routers

app_name = 'core'

router = routers.DefaultRouter()
# router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    # path('create-user/', create_user, name='create_user'),
    # path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
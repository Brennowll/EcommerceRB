from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView
)

from core.views import (CustomTokenObtainPairView, UserDetailsViewSet, UserViewSet,
                        create_user, PictureViewSet, ProductViewSet,
                        ProductForOrderViewSet, OrderViewSet, create_checkout_session,
                        verify_available_products)

app_name = 'core'

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'users_details', UserDetailsViewSet,
                basename='users_details')
router.register(r'pictures', PictureViewSet, basename='picture')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'products_for_order', ProductForOrderViewSet,
                basename='products_for_order')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('create_user/', create_user, name='create_user'),
    path('create_checkout_session/', create_checkout_session,
         name='create_checkout_session'),
    path('verify_available_products/', verify_available_products,
         name='verify_available_products'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

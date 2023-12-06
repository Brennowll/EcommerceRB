from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from core.views import (CustomTokenObtainPairView, UserViewSet, create_user, PictureViewSet,
                        ProductViewSet, CartViewSet, ProductForOrderViewSet, OrderViewSet)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'pictures', PictureViewSet, basename='picture')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'carts', CartViewSet, basename='cart')
router.register(r'products_for_order', ProductForOrderViewSet,
                basename='products_for_order')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('create_user/', create_user, name='create_user'),
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

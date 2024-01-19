from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from core.views import (CustomTokenObtainPairView, UserDetailsViewSet, UserViewSet,
                        create_user, PictureViewSet, SingleProductViewSet, ProductViewSet,
                        ProductForOrderViewSet, OrderViewSet, create_checkout_session,
                        verify_available_products, calculate_shipping, track_order,
                        CustomLogoutView, CustomTokenRefreshView)

app_name = 'core'

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'users_details', UserDetailsViewSet,
                basename='users_details')
router.register(r'pictures', PictureViewSet, basename='picture')
router.register(r'products', ProductViewSet, basename='products')
router.register(r'single_product', SingleProductViewSet,
                basename='single_product')
router.register(r'products_for_order', ProductForOrderViewSet,
                basename='products_for_order')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', CustomLogoutView, name='logout'),
    path('create_user/', create_user, name='create_user'),
    path('create_checkout_session/', create_checkout_session,
         name='create_checkout_session'),
    path('verify_available_products/', verify_available_products,
         name='verify_available_products'),
    path('calculate_shipping/', calculate_shipping,
         name='calculate_shipping'),
    path('track_order/', track_order,
         name='track_order'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

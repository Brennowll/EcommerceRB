from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from core.serializers import TokenPairSerializer, UserSerializer, ProductSerializer, CartSerializer, ProductForOrderSerializer, OrderSerializer
from core.models import Cart, ProductForOrder, Order
# import bleach


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(username=self.request.user.username)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        username = serializer.validated_data.get('username')
        email = serializer.validated_data.get('email')

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=HTTP_400_BAD_REQUEST)

        user = serializer.save()
        return Response({"message": "User created successfully"}, status=HTTP_201_CREATED)

    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


class ProductForOrderViewSet(viewsets.ModelViewSet):
    serializer_class = ProductForOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_cart = Cart.objects.filter(user=self.request.user)
        return ProductForOrder.objects.filter(cart=user_cart)

    def perform_create(self, serializer):
        user_cart = Cart.objects.filter(user=self.request.user)
        return serializer.save(cart=user_cart)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from core.serializers import (UserDetailsSerializer, TokenPairSerializer, CategorySerializer,
                              UserSerializer, PictureSerializer, ProductSerializer,
                              CartSerializer, ProductForOrderSerializer, OrderSerializer)
from core.models import (UserDetails, ProductCategory, Cart,
                         ProductForOrder, Order, Product, Picture)
# import bleach


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    def list(self, request, *args, **kwargs):
        serializer = self.get_serializer(self.get_queryset().first())
        return Response(serializer.data)


class UserDetailsViewSet(viewsets.ModelViewSet):
    serializer_class = UserDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserDetails.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User created succesfully. Please login"}, status=HTTP_201_CREATED)

    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class PictureViewSet(viewsets.ModelViewSet):
    serializer_class = PictureSerializer

    def get_queryset(self):
        return Picture.objects.all()


class CustomPagination(PageNumberPagination):
    page_size = 28


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    pagination_class = CustomPagination

    def get_queryset(self):
        id = self.request.query_params.get('id', None)
        category = self.request.query_params.get('category', None)
        queryset = Product.objects.all()

        if category and ProductCategory.objects.filter(name=category).exists():
            queryset = queryset.filter(category__name=category)

        if id:
            queryset = queryset.filter(id=id)

        queryset = queryset.order_by('id')
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        id = self.request.query_params.get('id', None)

        if id:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)

        page = self.paginate_queryset(queryset)
        categories = ProductCategory.objects.all()
        categories_serializer = CategorySerializer(categories, many=True)

        if page:
            serializer = self.get_serializer(page, many=True)
            num_pages = self.paginator.page.paginator.num_pages if self.paginator.page.paginator.count > 0 else 0

            return self.get_paginated_response({
                'count': queryset.count(),
                'num_pages': num_pages,
                'products': serializer.data,
                'categories': categories_serializer.data,
            })

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'num_pages': 1,
            'products': serializer.data,
            'categories': categories_serializer.data,
        })


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

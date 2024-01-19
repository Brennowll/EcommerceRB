from rest_framework import status
import requests
import stripe
from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from decouple import config
from core.serializers import (UserDetailsSerializer, TokenPairSerializer, CategorySerializer,
                              UserSerializer, PictureSerializer, ProductSerializer,
                              ProductForOrderSerializer, OrderSerializer)
from core.models import (UserDetails, ProductCategory, ProductForOrder,
                         Order, Product, Picture, ProductOrdered)


stripe.api_key = config('STRIPE_SECRET_KEY')
cep_certo_key = config('CEP_CERTO_SECRET_KEY')


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = TokenPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Adicionando o token ao cookie HTTP-only
        response.set_cookie(
            'access_token', response.data['access'], httponly=True)
        response.set_cookie(
            'refresh_token', response.data['refresh'], httponly=True)

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Adicionando o novo token de acesso ao cookie HTTP-only
        response.set_cookie(
            'access_token', response.data['access'], httponly=True)

        return response


@api_view(['POST'])
def CustomLogoutView(request):
    response = JsonResponse({'message': 'Logout successful'})

    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')

    return response


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
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        create_if_not_exist = request.query_params.get(
            'create_if_not_exist', False)
        print(create_if_not_exist)
        partial = kwargs.pop('partial', False)

        if create_if_not_exist:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=HTTP_201_CREATED)

        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data, status=HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(
            queryset.first(),
            many=False,
            context={'request': request}
        )

        response_data = serializer.data

        return Response(response_data, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {"message": "User created succesfully. Please login"},
            status=HTTP_201_CREATED)

    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class PictureViewSet(viewsets.ModelViewSet):
    serializer_class = PictureSerializer

    def get_queryset(self):
        return Picture.objects.all()


class SingleProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        slug = self.request.query_params.get('slug', None)
        queryset = Product.objects.all()
        queryset = queryset.get(slug=slug)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=False)
        return Response(serializer.data)


class CustomPagination(PageNumberPagination):
    page_size = 28


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    pagination_class = CustomPagination

    def get_queryset(self):
        authorization_header = self.request.headers.get('Authorization')
        print(authorization_header)

        category = self.request.query_params.get('category', None)
        queryset = Product.objects.all()

        if category and ProductCategory.objects.filter(name=category).exists():
            queryset = queryset.filter(category__name=category)

        queryset = queryset.order_by('id')
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

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


class ProductForOrderViewSet(viewsets.ModelViewSet):
    serializer_class = ProductForOrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProductForOrder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        size = serializer.validated_data['size']

        specified_product = ProductForOrder.objects.filter(
            user=self.request.user,
            product=product,
            size=size
        ).first()

        if specified_product:
            specified_product.quantity += 1
            return specified_product.save()

        return serializer.save(
            user=self.request.user,
            quantity=1
        )

    def perform_destroy(self, instance):
        if instance.quantity > 1:
            instance.quantity -= 1
            return instance.save()

        instance.delete()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(
            queryset, many=True, context={'request': request})

        response_data = serializer.data

        for item in response_data:
            product_id = item.get('product')

            product_data = Product.objects.get(id=product_id)
            item['product'] = ProductSerializer(
                product_data, context={'request': request}).data

        return Response(response_data, status=HTTP_200_OK)


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        stripe_payment_id = serializer.validated_data['stripe_payment_id']
        session = stripe.checkout.Session.retrieve(stripe_payment_id)

        if stripe_payment_id and session.payment_status == 'paid':
            product_for_order_objects = ProductForOrder.objects.filter(
                user=self.request.user
            )

            if not product_for_order_objects.exists():
                return

            userDetails = UserDetails.objects.get(user=self.request.user)
            product_ordered_list = []

            order = serializer.save(
                user=self.request.user,
                adress=userDetails.adress,
                stripe_payment_id=stripe_payment_id
            )

            for product_for_order in product_for_order_objects:
                product_ordered = ProductOrdered.objects.create(
                    product=product_for_order.product,
                    size=product_for_order.size,
                    quantity=product_for_order.quantity,
                    related_order=order
                )

                sizes_and_quantities_available = [pair.split(
                    '-') for pair in product_for_order.product.available_sizes.split(', ')]

                for i, (quantity, size) in enumerate(sizes_and_quantities_available):
                    if size == product_for_order.size:
                        sizes_and_quantities_available[i][0] = str(
                            int(quantity) - product_for_order.quantity)

                updated_available_sizes = ', '.join(
                    ['-'.join(pair) for pair in sizes_and_quantities_available])

                product_for_order.product.available_sizes = updated_available_sizes
                product_for_order.product.save()

                product_ordered_list.append(product_ordered)

            order.products.set(product_ordered_list)
            product_for_order_objects.delete()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(
            queryset, many=True, context={'request': request}
        )

        return Response(serializer.data, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_available_products(request):
    user = request.user

    user_products_for_order = ProductForOrder.objects.filter(user=user)

    for product_for_order in user_products_for_order:
        product = product_for_order.product
        quantity_needed = product_for_order.quantity
        size_needed = product_for_order.size

        sizes_and_quantities = [pair.split(
            '-') for pair in product.available_sizes.split(', ')]

        available_quantity = next(
            (int(quantity) for quantity, size in sizes_and_quantities if size == size_needed), 0)

        if available_quantity < quantity_needed:
            product_for_order.delete()
            return Response(
                {'message': f'Produto "{product.name}" não tem quantidade suficiente em estoque para o tamanho "{size_needed}".'},
                status=HTTP_400_BAD_REQUEST)

    return Response(
        {'message': 'Todos os produtos têm quantidade suficiente em estoque.'},
        status=HTTP_200_OK)


@api_view(['POST'])
def create_checkout_session(request):
    try:
        price = request.data.get('price')

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'brl',
                    'product_data': {
                        'name': 'Pedido Boutique Rimini',
                    },
                    'unit_amount': price,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:5173/carrinho/?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:5173/carrinho/',
        )

        return JsonResponse({'redirectUrl': session['url']})
    except stripe.error.StripeError as e:
        print(f"Erro do stripe: {e}")
        return Response({'error': str(e)}, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calculate_shipping(request):
    cep = request.data.get('cep')

    company_cep = 70762510
    weight = 3
    height = 30
    width = 30
    length = 30

    url = (
        'https://www.cepcerto.com/ws/json-frete'
        f'/{company_cep}/{cep}/{weight}/{height}/{width}/{length}/{cep_certo_key}'
    )

    response = requests.get(url)

    if response.status_code != 200:
        return Response({'error': 'Unable to fetch data'}, status=HTTP_400_BAD_REQUEST)

    data = response.json()
    return Response(data, status=HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def track_order(request):
    tracking_code = request.data.get('trackingCode')

    url = (
        'https://www.cepcerto.com/ws/encomenda-json'
        f'/{tracking_code}/{cep_certo_key}/'
    )

    response = requests.get(url)

    if response.status_code != 200:
        return Response({'error': 'Unable to fetch data'}, status=HTTP_400_BAD_REQUEST)

    data = response.json()
    return Response(data, status=HTTP_200_OK)

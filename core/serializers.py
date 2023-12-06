from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from core.models import ProductCategory, Picture, Product, Cart, ProductForOrder, Order


class TokenPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        raw_username = attrs["username"]
        users = User.objects.filter(email=raw_username)
        if (users):
            attrs['username'] = users.first().username
        data = super(TokenPairSerializer, self).validate(attrs)
        return data


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'


class UserSerializer(serializers.HyperlinkedModelSerializer):
    # url = serializers.HyperlinkedIdentityField(view_name="core:user-detail")

    class Meta:
        model = User
        fields = ["username", "email"]


class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    picturesLinks = serializers.SerializerMethodField()
    sizesAvailable = serializers.CharField(source='sizes_available')

    class Meta:
        model = Product
        exclude = ['pictures', 'sizes_available']

    def get_picturesLinks(self, obj):
        if obj.pictures.exists():
            request = self.context.get('request')
            base_url = request.build_absolute_uri('/media/')
            return [base_url + picture.image.name for picture in obj.pictures.all()]
        else:
            return []


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        exclude = ['user']


class ProductForOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductForOrder


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        exclude = ['user']

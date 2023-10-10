from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from core.models import Product, Cart, ProductForOrder, Order


class TokenPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        raw_username = attrs["username"]
        users = User.objects.filter(email=raw_username)
        if (users):
            attrs['username'] = users.first().username
        data = super(TokenPairSerializer, self).validate(attrs)
        return data


class UserSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name="core:user-detail")

    class Meta:
        model = User
        fields = ["url", "username", "email"]


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product


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

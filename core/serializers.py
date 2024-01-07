from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from core.models import (UserDetails, ProductCategory, Picture,
                         Product, ProductForOrder, ProductOrdered, Order)


class TokenPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        raw_username = attrs["username"]
        users = User.objects.filter(email=raw_username)
        if (users):
            attrs['username'] = users.first().username
        data = super(TokenPairSerializer, self).validate(attrs)
        return data


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'A user with that email already exists.')

        return value

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data.pop('password', None)

        return data


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDetails
        exclude = ['user']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'


class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    picturesLinks = serializers.SerializerMethodField()
    availableSizes = serializers.CharField(source='available_sizes')

    class Meta:
        model = Product
        exclude = ['pictures', 'available_sizes', 'is_available']

    def get_picturesLinks(self, obj):
        if not obj.pictures.exists():
            return []

        request = self.context.get('request')
        base_url = request.build_absolute_uri('/media/')
        return [base_url + picture.image.name for picture in obj.pictures.all()]


class ProductForOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductForOrder
        exclude = ['user']


class ProductOrderedSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)  # Adicione esta linha

    class Meta:
        model = ProductOrdered
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    products = ProductOrderedSerializer(
        many=True, read_only=True, source='productordered_set')

    class Meta:
        model = Order
        exclude = ['user']

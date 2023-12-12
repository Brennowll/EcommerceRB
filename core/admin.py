from django.contrib import admin
from core.models import (UserDetails, ProductCategory, Product,
                         Cart, Order, Picture)


@admin.register(UserDetails)
class UserDetailsAdmin(admin.ModelAdmin):
    list_display = ('user',)


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(Picture)
class PictureAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'product_link')

    def product_name(self, obj):
        return obj.image.name.split('/')[-1]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category',)
    list_filter = ('category',)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user',)
    filter_horizontal = ('products',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'date',)
    list_filter = ('status',)

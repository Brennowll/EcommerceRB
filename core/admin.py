from django.contrib import admin
from core.models import ProductCategory, Product, Cart, Order


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)


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

from django.contrib import admin
from core.models import (UserDetails, ProductCategory, Product,
                         ProductForOrder, ProductOrdered, Order, Picture)


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
    list_filter = ('category', 'is_available')


@admin.register(ProductForOrder)
class ProductForOrder(admin.ModelAdmin):
    list_display = ('user', 'product')
    list_filter = ('user',)


@admin.register(ProductOrdered)
class ProductOrdered(admin.ModelAdmin):
    pass


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'date',)
    list_filter = ('user', 'status',)

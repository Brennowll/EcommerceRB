from django.db import models
from django.contrib.auth.models import User


class ProductCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return str(self.name)


class Picture(models.Model):
    product_link = models.ForeignKey('Product', on_delete=models.PROTECT)
    image = models.ImageField()


class Product(models.Model):
    category = models.ForeignKey(
        ProductCategory, on_delete=models.PROTECT, to_field='name')
    pictures = models.ManyToManyField(Picture, null=True)
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=250)
    sizes_and_colors = models.CharField(max_length=100)

    def __str__(self):
        return str(self.name)


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='ProductForOrder')


class ProductForOrder(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=10)
    color = models.CharField(max_length=10)
    quantity = models.PositiveIntegerField()

    class Meta:
        unique_together = ('cart', 'product', 'size', 'color')


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(ProductForOrder)
    status = models.CharField(max_length=50)
    date = models.DateField(auto_now_add=True)

from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from phonenumber_field.modelfields import PhoneNumberField


class UserDetails(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False)
    cep = models.CharField(max_length=10, blank=True, null=True)
    adress = models.CharField(max_length=50, blank=True, null=True)
    cellphone = PhoneNumberField(unique=True, blank=True, null=True)

    def __str__(self) -> str:
        # pylint: disable=no-member
        return self.user.username
        # pylint: enable=no-membe

    class Meta:
        verbose_name_plural = 'Users Details'


class ProductCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return str(self.name)

    class Meta:
        verbose_name_plural = 'Product categories'


class Picture(models.Model):
    product_link = models.ForeignKey(
        'Product',
        on_delete=models.PROTECT,
        null=True,
        blank=True
    )
    image = models.ImageField(upload_to='images/')

    def __str__(self):
        return self.image.name.split('/')[-1]


class Product(models.Model):
    category = models.ForeignKey(
        ProductCategory, on_delete=models.PROTECT, to_field='name')
    pictures = models.ManyToManyField(Picture)
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=250)
    available_sizes = models.CharField(max_length=100)
    price = models.FloatField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return str(self.name)


class ProductForOrder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=10)
    quantity = models.PositiveIntegerField()

    class Meta:
        unique_together = ('user', 'product', 'size')


class ProductOrdered(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=10)
    quantity = models.PositiveIntegerField()
    related_order = models.ForeignKey(
        'Order', blank=True, null=True, on_delete=models.CASCADE)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(ProductOrdered, blank=True, null=True)
    adress = models.CharField(max_length=90)
    status = models.CharField(max_length=50)
    date = models.DateField(auto_now_add=True)

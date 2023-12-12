from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from phonenumber_field.modelfields import PhoneNumberField


class UserDetails(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=False, null=False)
    adress = models.CharField(max_length=50)
    cellphone = PhoneNumberField(unique=True, blank=True, null=True)

    def __str__(self) -> str:
        # pylint: disable=no-member
        return self.user.username
        # pylint: enable=no-membe

    def clean(self):
        if self.cellphone:
            cellphone_str = str(self.cellphone)
            if not cellphone_str.isdigit() or len(cellphone_str) < 11:
                raise ValidationError(
                    "O número de telefone deve ter pelo menos 11 dígitos.")

    def save(self, *args, **kwargs):
        if self.cellphone:
            cellphone_number = str(self.cellphone.national_number)
            if not cellphone_number.startswith('55'):
                self.cellphone = f'+55{cellphone_number}'

        super().save(*args, **kwargs)

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
    pictures = models.ManyToManyField(Picture, null=True)
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=250)
    sizes_available = models.CharField(max_length=100)
    price = models.FloatField()

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

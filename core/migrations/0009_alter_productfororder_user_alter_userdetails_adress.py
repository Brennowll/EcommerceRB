# Generated by Django 4.2.2 on 2023-12-19 21:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0008_rename_sizes_available_product_available_sizes_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productfororder',
            name='user',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='userdetails',
            name='adress',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]

# Generated by Django 4.2.2 on 2024-01-07 13:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_order_adress_alter_order_products'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='adress',
            field=models.CharField(max_length=90),
        ),
    ]

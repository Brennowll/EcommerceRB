from django.core.management.base import BaseCommand
from core.models import Product, ProductCategory, Picture


class Command(BaseCommand):
    help = 'Cria produtos de teste para paginar'

    def handle(self, *args, **options):
        # Limpe os produtos existentes (opcional)
        # Product.objects.all().delete()

        category = ProductCategory.objects.get(id=10)
        picture = Picture.objects.get(id=6)

        # Crie novos produtos
        for i in range(1, 101):  # Crie 100 produtos (ajuste conforme necessário)
            product = Product(
                available_sizes="2-P, 3-M, 2-G, 3-GG",
                category=category,
                description="Conjunto básico para dias ensolarados, compromissos leves e reuniões de família e amigos, no geral. Revestido com Jeans de grossura média, material leve.",
                name=f"Conjunto Jeans Azul Claro {i}",
                price=89.99
            )
            product.save()  # Salve o produto para obter um ID antes de adicionar imagens
            # Use set() para adicionar imagens ao many-to-many
            product.pictures.set([picture])

        self.stdout.write(self.style.SUCCESS(
            'Produtos de teste criados com sucesso.'))

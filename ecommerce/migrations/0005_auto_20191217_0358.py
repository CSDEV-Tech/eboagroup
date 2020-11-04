# Generated by Django 2.2.7 on 2019-12-17 02:58

from django.db import migrations, models
import ecommerce.models
import boagroup_services.storage


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0004_auto_20191217_0223'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='image1',
            field=models.ImageField(storage=boagroup_services.storage.OverwriteStorage(), upload_to=ecommerce.models.PathAndRename('articles', 'image-1'), verbose_name="changer l'image"),
        ),
        migrations.AlterField(
            model_name='article',
            name='image2',
            field=models.ImageField(blank=True, storage=boagroup_services.storage.OverwriteStorage(), upload_to=ecommerce.models.PathAndRename('articles', 'image-2'), verbose_name="changer l'image"),
        ),
        migrations.AlterField(
            model_name='article',
            name='image3',
            field=models.ImageField(blank=True, storage=boagroup_services.storage.OverwriteStorage(), upload_to=ecommerce.models.PathAndRename('articles', 'image-3'), verbose_name="changer l'image"),
        ),
        migrations.AlterField(
            model_name='article',
            name='image4',
            field=models.ImageField(blank=True, storage=boagroup_services.storage.OverwriteStorage(), upload_to=ecommerce.models.PathAndRename('articles', 'image-4'), verbose_name="changer l'image"),
        ),
        migrations.AlterField(
            model_name='category',
            name='image',
            field=models.ImageField(blank=True, storage=boagroup_services.storage.OverwriteStorage(), upload_to=ecommerce.models.PathAndRename('categories'), verbose_name='Image de la catégorie'),
        ),
        migrations.AlterField(
            model_name='promotion',
            name='image',
            field=models.ImageField(storage=boagroup_services.storage.OverwriteStorage(), upload_to=ecommerce.models.PathAndRename('sales'), verbose_name="changer l'image "),
        ),
        migrations.AlterField(
            model_name='slide',
            name='bg_image',
            field=models.ImageField(blank=True, storage=boagroup_services.storage.OverwriteStorage(), upload_to=ecommerce.models.PathAndRename('slides/bg'), verbose_name="changer l'image"),
        ),
        migrations.AlterField(
            model_name='slide',
            name='image',
            field=models.ImageField(storage=boagroup_services.storage.OverwriteStorage(), upload_to=ecommerce.models.PathAndRename('slides/front'), verbose_name="changer l'image"),
        ),
    ]

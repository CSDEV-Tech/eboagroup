# Generated by Django 2.2.7 on 2020-07-11 19:22

import boagroup_services.storage
from django.db import migrations, models
import utils.utils


class Migration(migrations.Migration):

    dependencies = [
        ('ecommerce', '0013_auto_20200630_0511'),
    ]

    operations = [
        migrations.AlterField(
            model_name='article',
            name='image1',
            field=models.ImageField(storage=boagroup_services.storage.OverwriteStorage(), upload_to=utils.utils.PathAndRename('uploads/ecommerce/articles', 'image-1'), verbose_name="changer l'image"),
        ),
        migrations.AlterField(
            model_name='article',
            name='image2',
            field=models.ImageField(blank=True, storage=boagroup_services.storage.OverwriteStorage(), upload_to=utils.utils.PathAndRename('uploads/ecommerce/articles', 'image-2'), verbose_name="changer l'image"),
        ),
        migrations.AlterField(
            model_name='article',
            name='image3',
            field=models.ImageField(blank=True, storage=boagroup_services.storage.OverwriteStorage(), upload_to=utils.utils.PathAndRename('uploads/ecommerce/articles', 'image-3'), verbose_name="changer l'image"),
        ),
        migrations.AlterField(
            model_name='article',
            name='image4',
            field=models.ImageField(blank=True, storage=boagroup_services.storage.OverwriteStorage(), upload_to=utils.utils.PathAndRename('uploads/ecommerce/articles', 'image-4'), verbose_name="changer l'image"),
        ),
        migrations.AlterField(
            model_name='category',
            name='image',
            field=models.ImageField(blank=True, storage=boagroup_services.storage.OverwriteStorage(), upload_to=utils.utils.PathAndRename('uploads/ecommerce/categories'), verbose_name='Image de la catégorie'),
        ),
        migrations.AlterField(
            model_name='promotion',
            name='image',
            field=models.ImageField(storage=boagroup_services.storage.OverwriteStorage(), upload_to=utils.utils.PathAndRename('uploads/ecommerce/sales'), verbose_name="changer l'image "),
        ),
        migrations.AlterField(
            model_name='slide',
            name='bg_image',
            field=models.ImageField(blank=True, storage=boagroup_services.storage.OverwriteStorage(), upload_to=utils.utils.PathAndRename('uploads/ecommerce/slides/bg'), verbose_name="changer l'image"),
        ),
        migrations.AlterField(
            model_name='slide',
            name='image',
            field=models.ImageField(storage=boagroup_services.storage.OverwriteStorage(), upload_to=utils.utils.PathAndRename('uploads/ecommerce/slides/front'), verbose_name="changer l'image"),
        ),
    ]

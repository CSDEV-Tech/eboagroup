# Generated by Django 2.2.7 on 2020-06-30 04:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ecommerce', '0013_auto_20200630_0511'),
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Newsletter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Titre de la newsletter')),
                ('sent_at', models.DateTimeField(null=True, verbose_name="Date d'envoi")),
            ],
        ),
        migrations.CreateModel(
            name='Subscriber',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
            ],
            options={
                'verbose_name': 'Abonné à la newsletter',
                'verbose_name_plural': 'Abonnés à la newsletter',
            },
        ),
        migrations.CreateModel(
            name='NewsletterPromotion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('newsletter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='newsletter.Newsletter')),
                ('post_related', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ecommerce.Promotion', verbose_name='promotion')),
            ],
            options={
                'verbose_name': 'promotions',
                'verbose_name_plural': 'promotions',
            },
        ),
        migrations.CreateModel(
            name='NewsletterPost',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('newsletter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='newsletter.Newsletter')),
                ('post_related', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='blog.Post', verbose_name='article')),
            ],
            options={
                'verbose_name': 'articles',
                'verbose_name_plural': 'articles',
            },
        ),
        migrations.CreateModel(
            name='NewsletterArticle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('article_related', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ecommerce.Article', verbose_name='produit')),
                ('newsletter', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='newsletter.Newsletter')),
            ],
            options={
                'verbose_name': 'produits',
                'verbose_name_plural': 'produits',
            },
        ),
        migrations.AddField(
            model_name='newsletter',
            name='articles',
            field=models.ManyToManyField(through='newsletter.NewsletterArticle', to='ecommerce.Article'),
        ),
        migrations.AddField(
            model_name='newsletter',
            name='posts',
            field=models.ManyToManyField(through='newsletter.NewsletterPost', to='blog.Post'),
        ),
        migrations.AddField(
            model_name='newsletter',
            name='promotions',
            field=models.ManyToManyField(through='newsletter.NewsletterPromotion', to='ecommerce.Promotion'),
        ),
    ]
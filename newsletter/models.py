import binascii
import os

from django.db import models

# Create your models here.
from blog.models import Post
from ecommerce.models import Article, Promotion


class NewsletterArticle(models.Model):
    article_related = models.ForeignKey(to=Article, on_delete=models.CASCADE, verbose_name="produit")
    newsletter = models.ForeignKey(to="Newsletter", on_delete=models.CASCADE, null=True)

    class Meta:
        verbose_name = "produits"
        verbose_name_plural = "produits"

    def image_tag(self):
        """ The image to be displayed """
        if self.article_related is not None:
            return self.article_related.image_tag()
        else:
            return "-"

    image_tag.short_description = 'Image'


class NewsletterPost(models.Model):
    post_related = models.ForeignKey(to=Post, on_delete=models.CASCADE, verbose_name="article")
    newsletter = models.ForeignKey(to="Newsletter", on_delete=models.CASCADE)

    class Meta:
        verbose_name = "articles"
        verbose_name_plural = "articles"

    def image_tag(self):
        """ The image to be displayed """
        if self.post_related is not None:
            return self.post_related.image_tag()
        else:
            return "-"

    image_tag.short_description = 'Image'


class NewsletterPromotion(models.Model):
    promotion_related = models.ForeignKey(to=Promotion, on_delete=models.CASCADE, verbose_name="promotion")
    newsletter = models.ForeignKey(to="Newsletter", on_delete=models.CASCADE)

    class Meta:
        verbose_name = "promotions"
        verbose_name_plural = "promotions"

    def image_tag(self):
        """ The image to be displayed """
        if self.promotion_related is not None:
            return self.promotion_related.image_tag()
        else:
            return "-"

    image_tag.short_description = 'Image'


class Newsletter(models.Model):
    title = models.CharField(max_length=255, verbose_name="Titre de la newsletter")
    sent_at = models.DateTimeField(verbose_name="Date d'envoi", null=True)
    articles = models.ManyToManyField(to=Article, through="NewsletterArticle")
    promotions = models.ManyToManyField(to=Promotion, through="NewsletterPromotion")
    posts = models.ManyToManyField(to=Post, through="NewsletterPost")


def generate_token():
    return binascii.hexlify(os.urandom(20)).decode()


class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    token = models.CharField(max_length=40, verbose_name="Clé d'enregistrement", default=None, null=True, unique=True)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        fail = True
        while fail:
            if self.token is None:
                self.token = generate_token()
            try:
                super().save()
            except:
                pass
            else:
                fail = False

    class Meta:
        verbose_name = "Abonné à la newsletter"
        verbose_name_plural = "Abonnés à la newsletter"

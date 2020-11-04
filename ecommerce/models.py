import binascii
import os
import random
from datetime import datetime, timedelta

import math
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from django.db import models
# Create your models here.
from django.db.models import Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.text import slugify

# from rest_framework.authtoken.models import Token
from boagroup_services.storage import OverwriteStorage
from utils.utils import get_date, PathAndRename


class Town(models.Model):
    """A Town"""
    name = models.CharField(max_length=255, verbose_name="nom de la ville", unique=True)

    def __str__(self):
        return self.name

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.name = self.name.capitalize()
        super().save()

    class Meta:
        verbose_name = "ville"


class Zone(models.Model):
    """ This is a Model for grouping communes together"""
    name = models.CharField(max_length=255, verbose_name="nom de la zone")
    priority = models.PositiveIntegerField(default=1, verbose_name="priorité de la zone",
                                           validators=[MinValueValidator(1)])
    town = models.ForeignKey(to=Town, on_delete=models.CASCADE, verbose_name="ville parente")

    def __str__(self):
        return f"{self.town} - zone {self.name}"

    class Meta:
        unique_together = [
            "priority",
            "town",
        ]


class Commune(models.Model):
    """ A subdivision of a town """
    name = models.CharField(max_length=255, verbose_name="nom de la commune")
    zone = models.ForeignKey(to=Zone, on_delete=models.CASCADE, verbose_name="zone située")
    shipping_cost = models.PositiveIntegerField(verbose_name="Frais de livraison", default=1,
                                                validators=[MinValueValidator(1)])

    def __str__(self):
        return f"commune de {self.name}"

    def town(self):
        return self.zone.town.name

    town.short_description = "ville"


class Address(models.Model):
    """ A Model for representing addresses"""
    address = models.CharField(max_length=255, verbose_name="adresse")
    commune = models.ForeignKey(to=Commune, on_delete=models.PROTECT, verbose_name="Commune située")

    def __str__(self):
        return f"Ville de {self.commune.zone.town}, {self.commune}, {self.address}"

    class Meta:
        verbose_name = "adresse"

    @property
    def town(self):
        return f'{self.commune.zone.town.name}'

    @property
    def municipality(self):
        return self.commune.name

    @property
    def zone(self):
        return self.commune.zone.name


class Furnisher(models.Model):
    name = models.CharField(max_length=255, verbose_name="nom du fournisseur")
    zone = models.ForeignKey(to=Zone, on_delete=models.PROTECT, verbose_name="zone située")

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "fournisseur"

    def town(self):
        return f'{self.zone.town.name}'

    town.short_description = "Ville située"


class User(AbstractUser):
    email = models.EmailField(verbose_name="user email", unique=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['username']

    class Meta(AbstractUser.Meta):
        verbose_name = "Utilisateur (Authentification)"
        verbose_name_plural = "Utilisateurs (Authentification)"


class Category(models.Model):
    """ A category """
    name = models.CharField(max_length=255, verbose_name="nom", unique=True)
    slug = models.SlugField(max_length=255, verbose_name="Lien de la catégorie", blank=True, unique=True)
    image = models.ImageField(verbose_name="Image de la catégorie", blank=True,
                              storage=OverwriteStorage(),
                              upload_to=PathAndRename("uploads/ecommerce/categories"))

    class Meta:
        verbose_name = "catégorie"

    def __str__(self):
        return self.name

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super().save()

        self.slug = slugify(self.name)
        try:
            findee = get_object_or_404(Category, slug=self.slug)
            if findee.pk == self.pk:
                raise Http404
        except Http404:
            super().save()
        else:
            self.slug = f"{self.slug}-{self.pk}"
            super().save()

    @property
    def count(self):
        return len(self.article_set.all())

    def image_tag(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((u'<img src="%s" style="max-height: 40px" />' % escape(self.image.url))
                         if self.image else '-')

    image_tag.short_description = 'Image'

    def big_image_tag(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((f"""<a href="{escape(self.image.url)}"><img src="{escape(
            (self.image.url))}" style="max-height: 200px" /></a>"""))

    big_image_tag.short_description = 'image de la catégorie'

    # @property
    # def filters(self):
    #     """ get filters """
    #     return list(self.categoryfilter_set.values("id", "name",))


class CategoryFilter(models.Model):
    """ A category filter """
    parent = models.ForeignKey(to="Category", on_delete=models.PROTECT, verbose_name="catégorie parent", )
    name = models.CharField(max_length=255, verbose_name="nom", unique=True)

    def __str__(self):
        return f"{self.parent} - {self.name}"

    class Meta:
        verbose_name = "filtre de catégorie"
        verbose_name_plural = "filtres de catégorie"


class CategoryFilterLine(models.Model):
    """ Median class between category filter and article """
    category_filter = models.ForeignKey(to=CategoryFilter, on_delete=models.PROTECT, verbose_name="catégorie")
    article = models.ForeignKey(to="Article", on_delete=models.CASCADE, verbose_name="article")

    class Meta:
        verbose_name = "filtre de catégorie"
        verbose_name_plural = "filtres de catégorie"


class Promotion(models.Model):
    """ A reduction """
    label = models.CharField(max_length=255, verbose_name="nom de la solde")
    image = models.ImageField(verbose_name="changer l'image ",
                              storage=OverwriteStorage(),
                              upload_to=PathAndRename("uploads/ecommerce/sales"))
    total = models.PositiveIntegerField(default=0, verbose_name="coût total")
    dateBegin = models.DateTimeField(verbose_name="date de début")
    dateEnd = models.DateTimeField(verbose_name="date de fin")
    slug = models.SlugField(max_length=255, verbose_name="Lien de la promotion", blank=True)
    articles = models.ManyToManyField(to="Article", through="PromotionLine")
    description = models.CharField(max_length=255, verbose_name="texte d'accroche", blank=True)

    class Meta:
        verbose_name = "solde"

    @property
    def date_begin(self):
        return get_date(self.dateBegin)

    def stock(self):
        """ Calculate the stock left """
        if len(self.promotionline_set.all()) == 0:
            return 0

        article_less = min([line.article_related.stock / line.article_count for line in self.promotionline_set.all() if
                            line.article_count > 0])

        return math.floor(article_less)

    @property
    def presumed_price(self):
        """ Calculate the presumed price """
        total = 0
        for line in self.promotionline_set.all():
            total += line.article_related.real_price * line.article_count

        return total

    @property
    def date_end(self):
        return get_date(self.dateEnd)

    def __str__(self):
        """ Write """
        return f"{self.label}"

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.slug = slugify(self.label)
        try:
            findee = get_object_or_404(Promotion, slug=self.slug)
            if findee.pk == self.pk:
                raise Http404
        except Http404:
            super().save()
        else:
            self.slug = f"{self.slug}-{self.pk}"
            super().save()

    def image_tag(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((u'<img src="%s" style="max-height: 40px" />' % escape(self.image.url))
                         if self.image else '-')

    image_tag.short_description = 'Image'

    def big_image_tag(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((f"""<a href="{escape(self.image.url)}"><img src="{escape(
            (self.image.url))}" style="max-height: 200px" /></a>"""))

    big_image_tag.short_description = 'image de la promotion'
    stock.short_description = "quantité disponible"


class FurnisherArticle(models.Model):
    article_related = models.ForeignKey(to="Article", on_delete=models.CASCADE, verbose_name="article lié")
    furnisher_related = models.ForeignKey(to=Furnisher, on_delete=models.CASCADE, verbose_name="nom du fournisseur")

    class Meta:
        verbose_name = "fournisseur"

    def __str__(self):
        return f"{self.furnisher_related.name}"


class Article(models.Model):
    """ An article """
    new_until = models.DateTimeField(verbose_name="nouveau jusqu'au", default=timezone.now)
    name = models.CharField(max_length=255, verbose_name="nom du produit")
    price = models.PositiveIntegerField(verbose_name="prix du produit", default=1, validators=[MinValueValidator(1)])
    description = models.TextField(verbose_name="description du produit", blank=True)
    stock = models.PositiveIntegerField(verbose_name="stock restant", default=1, validators=[MinValueValidator(0)])
    image1 = models.ImageField(verbose_name="changer l'image", blank=False, storage=OverwriteStorage(),
                               upload_to=PathAndRename("uploads/ecommerce/articles", "image-1"))
    image2 = models.ImageField(verbose_name="changer l'image", blank=True,
                               storage=OverwriteStorage(),
                               upload_to=PathAndRename("uploads/ecommerce/articles", "image-2"))
    image3 = models.ImageField(verbose_name="changer l'image", blank=True,
                               storage=OverwriteStorage(),
                               upload_to=PathAndRename("uploads/ecommerce/articles", "image-3"))
    image4 = models.ImageField(verbose_name="changer l'image", blank=True,
                               storage=OverwriteStorage(),
                               upload_to=PathAndRename("uploads/ecommerce/articles", "image-4"))
    slug = models.SlugField(max_length=255, verbose_name="Lien de l'article", blank=True, unique=True)
    reduction = models.PositiveIntegerField(verbose_name="réduction (en %)", default=0)
    created_at = models.DateTimeField(verbose_name="Date de création", auto_now=True)

    # Foreign Keys
    category = models.ForeignKey(verbose_name="catégorie", to="Category", on_delete=models.PROTECT)

    # ManyToMany
    evaluations = models.ManyToManyField(to="Account", through="Evaluation")
    tags = models.ManyToManyField(to="Tag", through="TagLine", )
    furnishers = models.ManyToManyField(to=Furnisher, through="FurnisherArticle", verbose_name="Fournisseurs")
    filters = models.ManyToManyField(to="CategoryFilter", through="CategoryFilterLine")
    commands = models.ManyToManyField(to="Command", through="CommandLine")

    # is_new = models.BooleanField(verbose_name="nouveau ?", default=True)
    # expirationDate = models.DateTimeField(verbose_name="Date de f")

    @property
    def get_filters(self):
        """ get filters of the article """
        return list(self.filters.values("id", "name", ))

    @property
    def get_tags(self):
        """ get tags of the articles """
        return list(self.tags.values("id", "tag", ))

    @property
    def date_creation(self):
        return get_date(self.created_at)

    def is_new(self):
        new = (datetime(
            self.new_until.year,
            self.new_until.month,
            self.new_until.day,
        ) - datetime.now()) >= timedelta(days=1)

        if new:
            return "Oui"
        else:
            return "Non"

    is_new.short_description = "nouveau ?"

    @property
    def order_number(self):
        return len(self.commandline_set.all())

    @property
    def reviews_count(self):
        return len(self.evaluations.all())

    @property
    def category_link(self):
        return self.category.slug

    @property
    def evaluation(self):
        """ Get evaluation """
        moyenne = 0
        evaluations = Evaluation.objects.filter(article=self)
        if len(evaluations) == 0:
            return 0

        for evaluation in evaluations:
            moyenne += evaluation.note

        moyenne = moyenne / len(evaluations)
        return moyenne

    def get_eval(self):
        return f'{self.evaluation} / 5'

    get_eval.short_description = "note"

    class Meta:
        ordering = ["name"]
        verbose_name = "produit"

    @property
    def image1_url(self):
        return self.image1.url if self.image1 else None

    @property
    def image2_url(self):
        return self.image2.url if self.image2 else None

    @property
    def image3_url(self):
        return self.image3.url if self.image3 else None

    @property
    def image4_url(self):
        return self.image4.url if self.image4 else None

    def image_tag(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((u'<img src="%s" style="max-height: 40px" />' % escape(self.image1.url))
                         if self.image1 else '-')

    image_tag.short_description = 'Image'

    def big_image_tag1(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((f"""<a href="{escape(self.image1.url)}"><img src="{escape(
            (self.image1.url))}" style="max-height: 200px" /></a>"""))

    big_image_tag1.short_description = 'Image principale'

    def big_image_tag2(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((f"""<a href="{escape(self.image2.url)}"><img src="{escape(
            (self.image2.url))}" style="max-height: 200px" /></a>"""))

    big_image_tag2.short_description = 'Image 2'

    def big_image_tag3(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((f"""<a href="{escape(self.image3.url)}"><img src="{escape(
            (self.image3.url))}" style="max-height: 200px" /></a>"""))

    big_image_tag3.short_description = 'Image 3'

    def big_image_tag4(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((f"""<a href="{escape(self.image4.url)}"><img src="{escape(
            (self.image4.url))}" style="max-height: 200px" /></a>"""))

    big_image_tag4.short_description = 'Image 4'

    def __str__(self):
        return self.name

    @property
    def real_price(self):
        return int(self.price * (1 - (self.reduction) / 100))

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super().save()

        self.slug = slugify(self.name)
        try:
            findee = get_object_or_404(Article, slug=self.slug)
            if findee.pk == self.pk:
                raise Http404
        except Http404:
            super().save()
        else:
            self.slug = f"{self.slug}-{self.pk}"
        finally:
            super().save()


class Account(models.Model):
    """ The user's account """
    email_verified = models.BooleanField(verbose_name="Email vérifié ?", default=False)
    avatar = models.ImageField(verbose_name="image de profil", blank=True, upload_to="profiles")
    # default_address = models.CharField(max_length=255, verbose_name="adresse de résidence de l'utilisateur", default="")
    # default_town = models.CharField(max_length=255, verbose_name="ville de résidence de l'utilisateur", default="")
    address = models.ForeignKey(to=Address, on_delete=models.PROTECT, verbose_name="addresse")
    contact1 = models.CharField(max_length=255, verbose_name="contact 1")
    contact2 = models.CharField(max_length=255, verbose_name="contact 2", blank=True, null=True)
    user_related = models.OneToOneField(to=User, on_delete=models.CASCADE, verbose_name="Utilisateur lié")

    @property
    def residence(self):
        """ Get the residence address"""
        return {
            "address": self.address.address,
            "commune": self.address.commune.name,
            "zone": self.address.commune.zone.name,
            "town": self.address.commune.zone.town.name,
        }

    def town_residence(self):
        return self.address.town

    def address_residence(self):
        return self.address.address

    def commune_residence(self):
        return self.address.commune.name

    town_residence.short_description = "Ville"
    commune_residence.short_description = "Commune"
    address_residence.short_description = "addresse"

    def __str__(self):
        return f'{self.user_related.first_name} {self.user_related.last_name}'

    def first_name(self):
        return self.user_related.first_name

    def last_name(self):
        return self.user_related.last_name

    @property
    def email(self):
        return self.user_related.email

    @property
    def image_url(self):
        return self.avatar.url if self.avatar else None

    def image_tag(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((u'<img src="%s" style="max-height: 40px" />' % escape(self.avatar.url))
                         if self.avatar else '-')

    image_tag.short_description = 'Image'

    def big_image_tag(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((f"""<a href="{escape(self.avatar.url)}"><img src="{escape(
            (self.avatar.url))}" style="max-height: 200px" /></a>"""))

    big_image_tag.short_description = 'Image de profil'

    first_name.short_description = "Prénom(s)"
    last_name.short_description = "Nom"

    class Meta:
        verbose_name = "compte client"
        verbose_name_plural = "comptes client"
        ordering = ["id"]


class AbstractAdressable(models.Model):
    """ A class with addresses """
    # country = models.CharField(max_length=255, verbose_name="pays")
    address = models.ForeignKey(to=Address, on_delete=models.PROTECT, verbose_name="addresse de destination")
    # town = models.CharField(max_length=255, verbose_name="ville du bénéficiaire")
    # address = models.CharField(max_length=255, verbose_name="adresse du bénéficiaire")
    last_name = models.CharField(max_length=255, verbose_name="prénom du bénéficiaire", )
    first_name = models.CharField(max_length=255, verbose_name="nom du bénéficiaire", )
    contact = models.CharField(max_length=255, verbose_name="contact du bénéficiaire", )

    class Meta:
        abstract = True

    def town(self):
        return f'{self.address.town}'

    def get_address(self):
        return f'{self.address.address}'

    get_address.short_description = "adresse de destination"
    town.short_description = "ville de destination"


class AbstractCart(models.Model):
    """ Abstract Cart """
    ref = models.CharField(max_length=255, verbose_name="référence", blank=True, unique=True)

    class Meta:
        abstract = True

    def generate_ref(self):
        """
        Generate reference -> 8 Letters followed by 4 Digits
        :return:
        """
        chars = "AZERTYUIOPQSDFGHJKLMWXCVBNazertyuiopqsdfghjklmwxcvbn1234567890"

        ref = ""
        for i in range(8):
            ref += random.choice(chars)

        return ref

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        if not self.ref:
            # Generate ref before saving
            self.ref = self.generate_ref()

        super().save()


class PromoCart(models.Model):
    promotion_related = models.ForeignKey(to=Promotion, verbose_name="solde liée", on_delete=models.PROTECT)
    cart_related = models.ForeignKey(to="Cart", verbose_name="panier lié", on_delete=models.CASCADE)

    class Meta:
        verbose_name = "solde inclue"
        verbose_name_plural = "soldes incluses"


class Cart(AbstractCart):
    """ The real Cart """
    # owner = models.OneToOneField(to=Account, on_delete=models.CASCADE, null=True, blank=True,
    #                              verbose_name="Propriétaire")
    # 255.255.255.255
    promotions = models.ManyToManyField(to=Promotion, through="PromoCart")
    created_at = models.DateTimeField(verbose_name="créé le", auto_created=True, default=datetime.now)

    class Meta:
        verbose_name = "panier"

    def __str__(self):
        return f"panier {self.ref}"


class PromoCommand(models.Model):
    promotion_related = models.ForeignKey(to=Promotion, verbose_name="solde liée", on_delete=models.PROTECT)
    command_related = models.ForeignKey(to="Command", verbose_name="commande liée", on_delete=models.CASCADE)

    class Meta:
        verbose_name = "solde inclue"
        verbose_name_plural = "soldes incluses"


class Command(AbstractCart, AbstractAdressable):
    """ A command """
    PAYMENT_CHOICES = (
        (2, 'Mobile Money'),
        (1, 'Cash à la livraison'),
    )

    STATES = (
        (False, 'EN COURS'),
        (True, 'ARRIVE A DESTINATION'),
    )

    date = models.DateTimeField(verbose_name="date de réception")
    shipping_code = models.CharField(max_length=255, verbose_name="code de confirmation de livraison")
    created_at = models.DateTimeField(verbose_name="date d'émission", auto_created=True, default=datetime.now)
    payment_modality = models.SmallIntegerField(verbose_name="méthode de payement", choices=PAYMENT_CHOICES)
    owner = models.ForeignKey(to=Account, on_delete=models.CASCADE, verbose_name="commanditaire")
    delivered = models.BooleanField(verbose_name="Etat", default=False, choices=STATES)
    shipping_cost = models.PositiveIntegerField(verbose_name="Coût de la livraison", default=0)
    details = models.TextField(verbose_name="détails de la commande", blank=True, default="")
    total_cost = models.PositiveIntegerField(verbose_name="Coût total", default=0)
    promotions = models.ManyToManyField(to="Promotion", through="PromoCommand")

    def net_price(self):
        return f"{self.total_cost - self.shipping_cost} FCFA"

    net_price.short_description = "Coût Net"

    def shipping_add(self):
        return f"{self.shipping_cost} FCFA"

    shipping_add.short_description = "Coût de la livraison"

    def generate_code(self):
        """
        Generate reference -> 8 Letters followed by 4 Digits
        :return:
        """
        chars = "AZERTYUIOPQSDFGHJKLMWXCVBN"
        digits = "1234567890"

        ref = ""
        for i in range(3):
            ref += random.choice(chars)
        for i in range(3):
            ref += random.choice(digits)

        return ref

    @property
    def date_emission(self):
        return get_date(self.created_at)

    @property
    def date_reception(self):
        return get_date(self.date)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super().save()
        self.shipping_code = self.generate_code()

        if self.delivered:
            # Count article lines
            for line in self.commandline_set.all():
                line.article_related.stock -= line.article_count

                if line.article_related.stock <= 0:
                    line.article_related.stock = 0

                line.article_related.save()

            # Count also promotion lines
            for promotion in self.promotions.all():
                for line in promotion.promotionline_set.all():
                    line.article_related.stock -= line.article_count

                    if line.article_related.stock <= 0:
                        line.article_related.stock = 0

        total = 0
        for line in self.commandline_set.all():
            total += line.article_related.real_price * line.article_count

        for promotion in self.promotions.all():
            total += promotion.total

        self.total_cost = total
        self.total_cost += self.shipping_cost
        super().save()

    @property
    def total(self):
        return f'{self.total_cost} FCFA'

    class Meta:
        verbose_name = "commande"
        ordering = ("-date",)


class Line(models.Model):
    """ A class representing a line of a Cart or a command or a promotion """
    article_related = models.ForeignKey(to=Article, verbose_name="article lié", on_delete=models.PROTECT)
    article_count = models.PositiveIntegerField(default=1, verbose_name="nombre d'articles",
                                                validators=[MinValueValidator(1)]
                                                )

    class Meta:
        abstract = True


class CartLine(Line):
    """ Cart Line """
    Cart_related = models.ForeignKey(to=Cart, verbose_name="contenant", on_delete=models.CASCADE)

    @property
    def total(self):
        return self.article_related.real_price * self.article_count

    class Meta:
        verbose_name = "ligne de panier"
        verbose_name_plural = "lignes du panier"


class CommandLine(Line):
    """ Command Line """
    command_related = models.ForeignKey(to=Command, verbose_name="contenant", on_delete=models.CASCADE)
    furnisher_related = models.ForeignKey(to=Furnisher, verbose_name="Fournisseur le plus proche",
                                          on_delete=models.PROTECT, blank=True, null=True)

    @property
    def total(self):
        return self.article_related.real_price * self.article_count

    class Meta:
        verbose_name = "ligne de la commande"
        verbose_name_plural = "lignes de la commande"


class PromotionLine(Line):
    """ A promotion line """
    promo_related = models.ForeignKey(to=Promotion, verbose_name="contenant", on_delete=models.CASCADE)

    def price(self):
        return self.article_related.real_price

    price.short_description = "Prix de l'article"

    class Meta:
        verbose_name = "article"
        constraints = [models.constraints.CheckConstraint(check=Q(article_count__gte=1), name='gt_than_1')]


class WishList(models.Model):
    """ The WishList """
    owner = models.OneToOneField(to=Account, on_delete=models.CASCADE, verbose_name="Propriétaire")
    items = models.ManyToManyField(to=Article, related_name="wish_line", verbose_name="liste d'articles")


class Tag(models.Model):
    """A tag for an article """
    tag = models.CharField(max_length=255, verbose_name="mot")

    class Meta:
        verbose_name = "Mot-clé"
        verbose_name_plural = "Mots-clé"

    def __str__(self):
        """ The tag """
        return self.tag


class TagLine(models.Model):
    """ A Tag Line """
    article_related = models.ForeignKey(to=Article, on_delete=models.SET_NULL, null=True)
    tag_related = models.ForeignKey(to=Tag, on_delete=models.CASCADE, verbose_name="Mot-clé")

    class Meta:
        verbose_name = "Mot-clé"
        verbose_name_plural = "Mots-clé"


class Slide(models.Model):
    """ Slides """
    leading = models.CharField(max_length=255, verbose_name="texte de premier plan")
    title = models.CharField(max_length=255, verbose_name="titre")
    subtitle = models.CharField(max_length=255, verbose_name="sous-titre")
    show = models.BooleanField(verbose_name="afficher ?", default=True)
    order = models.PositiveIntegerField(verbose_name="ordre de défilement", default=1, unique=True,
                                        validators=[MinValueValidator(1)])
    image = models.ImageField(verbose_name="changer l'image",
                              storage=OverwriteStorage(),
                              upload_to=PathAndRename("uploads/ecommerce/slides/front"))
    article_related = models.ForeignKey(to=Article, on_delete=models.CASCADE,
                                        verbose_name="article lié")
    bg_image = models.ImageField(verbose_name="changer l'image", blank=True,
                                 storage=OverwriteStorage(),
                                 upload_to=PathAndRename("uploads/ecommerce/slides/bg"))

    class Meta:
        verbose_name = "slide"
        ordering = ["order"]

    def __str__(self):
        return f"slide n° {self.order} ({self.article_related})"

    def image_tag(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((u'<img src="%s" style="max-height: 40px" />' % escape(self.image.url))
                         if self.image else '-')

    def name(self):
        return str(self)

    def big_image_tag(self):
        """ The image to be displayed """
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((f"""<a href="{escape(self.image.url)}"><img src="{escape(
            (self.image.url))}" style="max-height: 200px" /></a>"""))

    def bg_image_tag(self):
        from django.utils.html import escape
        from django.utils.safestring import mark_safe
        return mark_safe((f"""<a href="{escape(self.bg_image.url)}"><img src="{escape(
            (self.bg_image.url))}" style="max-height: 200px" /></a>"""))

    image_tag.short_description = 'Image'
    name.short_description = 'Slide'
    big_image_tag.short_description = 'Image'
    bg_image_tag.short_description = "Image d'arrière-plan"


class Evaluation(models.Model):
    article = models.ForeignKey(to=Article, on_delete=models.CASCADE, verbose_name="Article")
    account = models.ForeignKey(to=Account, on_delete=models.SET_NULL, null=True, verbose_name="Client concerné")
    note = models.PositiveIntegerField(verbose_name="note", default=0)

    def __str__(self):
        return f"{self.note} / 5" + (f" par {self.account}" if self.account else None)


class Tokens(models.Model):
    """
    The default authorization token model.
    """
    key = models.CharField("Key", max_length=40, primary_key=True)
    created = models.DateTimeField("Created", auto_now_add=True)
    expirationDate = models.DateTimeField(verbose_name="Date d'expiration")

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super(Tokens, self).save(*args, **kwargs)

    def generate_key(self):
        return binascii.hexlify(os.urandom(20)).decode()

    def __str__(self):
        return self.key


class ResetPasswordTokens(Tokens):
    """Token for resetting password"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, verbose_name="User",
        unique=True
    )

    class Meta:
        verbose_name = "Jeton de réinitialisation de mot de passe"
        verbose_name_plural = "Jetons de réinitialisation de mot de passe"

    def save(self, *args, **kwargs):
        """ Override save method"""
        self.expirationDate = datetime.now() + timedelta(hours=3)
        super().save()


class VerifiyEmailTokens(Tokens):
    """Token for verifying user email"""
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, verbose_name="User",
        unique=True
    )

    class Meta:
        verbose_name = "Jeton de vérification d'email"
        verbose_name_plural = "Jeton de vérification d'email"

    def save(self, *args, **kwargs):
        """ Override save method"""
        self.expirationDate = datetime.now() + timedelta(hours=48)
        super().save()

class Contact(models.Model):
    name = models.CharField(verbose_name="Nom", max_length=255)
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(verbose_name="Contact", max_length=255)
    message = models.TextField(verbose_name="Message")
    date = models.DateTimeField(verbose_name="Date du contact", auto_created=True)

    class Meta:
        ordering = ["-date"]
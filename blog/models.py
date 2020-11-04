from datetime import datetime

from django.db import models
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.utils.text import slugify
from filebrowser.fields import FileBrowseField
from geoip2.errors import AddressNotFoundError
from tinymce import HTMLField

from boagroup_services.storage import OverwriteStorage
from ecommerce.models import Account
from utils.utils import get_date, PathAndRename
from django.utils.html import escape, strip_tags
from django.utils.safestring import mark_safe
from django.contrib.gis.geoip2 import GeoIP2

class Category(models.Model):
    """ A category """
    name = models.CharField(max_length=255, verbose_name="nom", unique=True)
    slug = models.SlugField(max_length=255, verbose_name="Lien de la catégorie", blank=True, unique=True)
    image = models.ImageField(verbose_name="Image de la catégorie", blank=True,
                              storage=OverwriteStorage(),
                              upload_to=PathAndRename("uploads/blog/categories"))

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

class Hit(models.Model):
    viewed_at = models.DateTimeField(verbose_name="vu le", auto_now=True)
    post_related = models.ForeignKey(to="Post", on_delete=models.CASCADE, verbose_name="article lié")
    ip = models.GenericIPAddressField(verbose_name="addresse IP")

    def location(self):
        g = GeoIP2()
        location = {'city': "Inconnue"}
        if self.ip is not None:
            try:
                location = g.city(str(self.ip))
            except AddressNotFoundError:
                pass
            else:
                location['city'] = f"{location['city']} - {location['country_name']}"

        return location['city']

    location.short_description = "Origine"


    class Meta:
        verbose_name = "Vue"
        ordering = ["-viewed_at"]

class Post(models.Model):
    sections = (
        (0, 'Aucune'),
        (1, 'Articles Mis en Avant'),
        (2, 'Articles Populaires'),
    )

    section = models.SmallIntegerField(verbose_name='section', choices=sections, default=0)
    show = models.BooleanField(verbose_name="Afficher l'article ?", default=True)
    title = models.CharField(max_length=255, verbose_name="titre", unique=True, )
    # image = models.ImageField(verbose_name="changer l'image",
    #                           storage=OverwriteStorage(),
    #                           upload_to=PathAndRename("uploads/blog/articles"))
    image = FileBrowseField(verbose_name="changer l'image",
                            blank=False,
                            directory="uploads/",
                            extensions=[".jpg", ".png"],
                            max_length=255
                            )
    content = HTMLField(blank=True, verbose_name="contenu de l'article", )
    date = models.DateField(verbose_name="date de publication", auto_now=True)
    slug = models.SlugField(verbose_name="lien de l'article", max_length=255, blank=True, unique=True)
    author = models.ForeignKey(to="Author", on_delete=models.CASCADE, verbose_name="éditeur")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, verbose_name="Catégorie",
                                 related_name="articles")
    # open = models.BooleanField(verbose_name="Ouvert ?", default=True)
    tags = models.ManyToManyField(to="Tag", through="TagLine", )

    class Meta:
        verbose_name = "article"
        ordering = ["-date"]
        get_latest_by = ['-date']

    def hit_count(self):
        return self.hit_set.count()

    hit_count.short_description = "Nombre de vues"

    @property
    def excerpt(self):
        return mark_safe(strip_tags(self.content)[:300])

    @property
    def category_title(self):
        return self.category.name

    @property
    def category_slug(self):
        return self.category.slug

    @property
    def image_url(self):
        return self.image.url

    @property
    def category_link(self):
        return self.category.slug

    @property
    def get_tags(self):
        """ get tags of the articles """
        return list(self.tags.values("id", "tag", ))

    @property
    def author_name(self):
        """ Author name """
        return self.author.name

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.title = self.title.strip()
        self.slug = slugify(self.title)
        super().save()

    def image_tag(self):
        """ The image to be displayed """
        return mark_safe((u'<img src="%s" style="max-height: 40px" />' % escape(self.image.url))
                         if self.image else '-')

    image_tag.short_description = 'Image de couverture'

    def big_image_tag(self):
        """ The image to be displayed """
        return mark_safe((f"""<a href="{escape(self.image.url)}"><img src="{escape(
            (self.image.url))}" style="max-height: 200px" /></a>"""))

    big_image_tag.short_description = 'image de couverture'

    def __str__(self):
        return f"Article '{self.title}' écrit par {self.author} le {self.date}"

    def get_absolute_url(self):
        return reverse("blog:blog_single", kwargs={"slug": self.slug})

    @property
    def published_at(self):
        return get_date(datetime(
            self.date.year,
            self.date.month,
            self.date.day,
        ))


class Author(models.Model):
    name = models.CharField(verbose_name="nom", max_length=255)

    def __str__(self):
        return f"{self.name}"

    class Meta:
        verbose_name = "editeur"


class Comment(models.Model):
    date = models.DateTimeField(verbose_name="commenté le", auto_now=True)
    content = models.CharField(max_length=255, verbose_name="contenu")
    subject = models.ForeignKey(to=Post, verbose_name="article lié", related_name="comments", on_delete=models.CASCADE)
    author = models.ForeignKey(to=Account, verbose_name="auteur", on_delete=models.CASCADE)
    parent = models.ForeignKey(to="self", on_delete=models.SET_NULL, verbose_name="Commentaire parent",
                               related_name="responses",
                               null=True, default=None)

    class Meta:
        verbose_name = "commentaire"
        ordering = ["date"]

    def get_date(self):
        return get_date(self.date)

    def __str__(self):
        return f"commentaire écrit par {self.author.first_name()} {self.author.last_name()} le {self.date}"


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
    article_related = models.ForeignKey(to=Post, on_delete=models.SET_NULL, null=True)
    tag_related = models.ForeignKey(to=Tag, on_delete=models.CASCADE, verbose_name="Mot-clé")

    class Meta:
        verbose_name = "Mot-clé"
        verbose_name_plural = "Mots-clé"



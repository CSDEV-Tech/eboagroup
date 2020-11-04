from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
# from django.conf import settings

from ecommerce.models import (
    Article,
    Promotion,
    Category,
    Command,
    CommandLine,
    Account,
    # ShippingAddress,
    Slide,
    Cart, CartLine, User, Tag, PromotionLine, CategoryFilter, CategoryFilterLine, Furnisher, Town, Zone,
    Commune, Contact)

admin.site.site_header = "Back Office de BOA-GROUP Services"


@admin.register(Tag)
class Tag(ImportExportModelAdmin):
    pass


# Register your models here.
@admin.register(Slide)
class SlideAdmin(ImportExportModelAdmin):
    list_per_page = 20
    fieldsets = [
        ("Général", {
            'fields': [
                "leading", "title", "subtitle",
            ]
        }),
        ("Image", {
            'fields': [
                'big_image_tag', 'image',
                'bg_image_tag', 'bg_image',
            ]
        }),
        ("Plus", {
            'fields': [
                'order', 'show', 'article_related',
            ]
        }),
    ]
    readonly_fields = ('big_image_tag', 'image_tag', 'bg_image_tag',)
    exclude = ('image_tag',)

    list_display = ('image_tag', 'order', 'article_related', 'show',)
    list_display_links = ('image_tag', 'order')
    list_editable = ('show',)
    list_filter = ("article_related",)

    # @admin.register(CategoryFilter)
    # class CategoryFilterAdmin(ImportExportModelAdmin):
    #     list_display = ('name', 'parent',)
    #     fields = ("name", "parent",)


@admin.register(Commune)
class CommuneAdmin(ImportExportModelAdmin):
    list_display = ('name', "town", "zone", "shipping_cost")
    readonly_fields = ('town',)
    fields = ['name', 'zone', "shipping_cost", 'town', ]
    list_filter = ("zone",)


class CommuneInline(admin.TabularInline):
    model = Commune
    fields = ['name', ]
    extra = 2


class CategoryFilterInline(admin.TabularInline):
    model = CategoryFilter
    extra = 2


class CategoryFilterLineInline(admin.TabularInline):
    model = CategoryFilterLine
    extra = 2


@admin.register(Category)
class CategoryAdmin(ImportExportModelAdmin):
    list_display = ('image_tag', 'name', 'slug',)
    list_display_links = ('image_tag', 'name',)
    # fields = ('name', 'slug', "big_image_tag", 'image', )
    readonly_fields = ("slug", "image_tag", "big_image_tag",)
    fieldsets = [
        ("Général", {
            'fields': [
                'name',
                'slug',
            ]
        }),
        ("Image", {
            'fields': [
                'big_image_tag', 'image',
            ],
        }),
    ]

    inlines = [
        # SubCategoryInline,
        CategoryFilterInline,
    ]


class TagInline(admin.TabularInline):
    model = Article.tags.through
    extra = 2


class EvaluationInline(admin.TabularInline):
    model = Article.evaluations.through
    fields = ("note", "account",)
    readonly_fields = ("note", "account",)
    extra = 1


class FurnisherInline(admin.TabularInline):
    model = Article.furnishers.through
    extra = 1


@admin.register(Article)
class ArticleAdmin(ImportExportModelAdmin):
    list_display = ('image_tag', 'name', 'category', 'price', 'stock',
                    "new_until", "get_eval",
                    )
    list_filter = ('category',)
    list_per_page = 20
    # list_editable = (
    #     "is_new",
    # )
    search_fields = ["name", ]
    list_display_links = ('image_tag', "name",)

    fieldsets = [
        ("Général", {
            'fields': [
                'new_until',
                'big_image_tag1', 'image1',
                # 'is_new',
                'name',
                'slug',
                'category',
                'description',
            ]
        }),
        ("Images", {
            'fields': [
                'big_image_tag2', 'image2',
                'big_image_tag3', 'image3',
                'big_image_tag4', 'image4',
            ],
            'classes': ('collapse',),
        }),
        ("Plus", {
            'fields': ['price', 'stock', 'reduction']
        }),
    ]

    readonly_fields = (
        'big_image_tag1', 'big_image_tag2', 'big_image_tag3', 'big_image_tag4', 'slug', "is_new", "get_eval")

    inlines = [
        FurnisherInline,
        CategoryFilterLineInline,
        EvaluationInline,
        TagInline,
    ]


class PromotionLineInline(admin.TabularInline):
    model = PromotionLine
    extra = 2
    fields = ("article_related", "price", "article_count")
    readonly_fields = ("price",)


@admin.register(Promotion)
class PromotionAdmin(ImportExportModelAdmin):
    fieldsets = [
        ("Général", {
            'fields': [
                'label',
                'stock',
                'slug',
                'description',
            ]
        }),
        ("Images", {
            'fields': [
                'big_image_tag', 'image',
            ]
        }),
        ("Plus", {
            'fields': ['total', 'dateBegin', 'dateEnd', ]
        }),
    ]

    inlines = [
        PromotionLineInline
    ]

    list_display = ('image_tag', 'label', 'total',
                    'stock', 'dateBegin', 'dateEnd',)
    list_display_links = ('image_tag', 'label',)
    readonly_fields = ("image_tag", "big_image_tag", 'slug', 'stock',)
    list_filter = ("dateBegin", "dateEnd",)
    list_per_page = 20


class PromoCommandInline(admin.TabularInline):
    model = Command.promotions.through
    extra = 0


class CommandLineInline(admin.TabularInline):
    model = CommandLine
    extra = 0

    fields = ("article_related", "article_count", "total", "furnisher_related")
    readonly_fields = ("total", "furnisher_related")


@admin.register(Command)
class CommandAdmin(ImportExportModelAdmin):
    list_per_page = 20
    list_display = ('ref', 'owner', 'date', 'created_at', 'total', 'delivered')
    list_editable = ('delivered',)
    list_filter = ('owner', 'date', 'created_at')
    fieldsets = [
        ("Général", {
            'fields': ['ref', 'date', 'created_at', "net_price", "shipping_add", 'total', 'payment_modality',
                       'delivered', ]
        }),
        ("Destination", {
            'fields': ['town', 'address', 'first_name', 'last_name', 'contact', ]
        }),
        ("Plus", {
            'fields': ['shipping_code', "details"]
        }),
    ]

    readonly_fields = (
        'ref', 'shipping_code', "shipping_add", "net_price", "net_price", 'owner', 'town', 'address', 'date', 'total',
        'payment_modality', 'first_name',
        'last_name', 'contact', 'created_at', "details",)

    inlines = [
        CommandLineInline,
        PromoCommandInline,
    ]


@admin.register(Furnisher)
class FurnisherAdmin(ImportExportModelAdmin):
    fields = ['name', 'zone', "town"]
    list_display = ["name", "zone", "town", ]
    readonly_fields = ["town", ]


class ZoneInline(admin.TabularInline):
    model = Zone
    extra = 1


@admin.register(Zone)
class ZoneAdmin(ImportExportModelAdmin):
    fields = ("name", "priority", "town")
    list_display = ("name", "priority", "town",)
    list_filter = ("town",)

    inlines = [
        CommuneInline
    ]


@admin.register(Town)
class TownAdmin(ImportExportModelAdmin):
    fields = ("name",)
    inlines = [ZoneInline, ]


@admin.register(Account)
class AccountAdmin(ImportExportModelAdmin):
    list_per_page = 20
    # fields = ('big_image_tag', "default_town", "default_address",)
    readonly_fields = (
        'email', 'first_name', 'last_name', 'contact1', 'contact2', 'big_image_tag',
        'town_residence', "commune_residence", "address_residence"
    )

    fieldsets = [
        ("Image", {
            'fields': [
                "big_image_tag",
            ]
        }),
        ("Général", {
            'fields': [
                'last_name', 'first_name', 'email', 'contact1', 'contact2',
            ]
        }),
        ("Résidence", {
            'fields': [
                'town_residence', "commune_residence", "address_residence",
            ]
        }),
    ]

    list_display = ('image_tag', 'first_name',
                    'last_name', 'email', "email_verified")
    search_fields = ('first_name', 'last_name',)
    list_display_links = ("image_tag", "first_name",)
    inlines = [
        # ResidenceInline
    ]


class PromoCartInline(admin.TabularInline):
    model = Cart.promotions.through
    extra = 0


# if settings.DEBUG:
class CartLineInline(admin.TabularInline):
    model = CartLine
    extra = 0

    fields = ("article_related", "article_count", "total")
    readonly_fields = ("total",)


@admin.register(Cart)
class CartAdmin(ImportExportModelAdmin):
    list_per_page = 20
    fields = ('ref', 'created_at',)
    readonly_fields = ('ref', 'created_at',)
    list_display = ('ref', 'created_at',)
    list_filter = ('created_at',)
    inlines = [
        CartLineInline,
        PromoCartInline,
    ]


@admin.register(User)
class UserAdmin(ImportExportModelAdmin):
    list_display = ('username', 'last_name',
                    'first_name', 'email', 'is_superuser')
    search_fields = ("username", "last_name", "first_name", "email")
    list_display_links = ('username',)
    list_per_page = 20


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'phone', 'email',)
    fieldsets = [
        ("Général", {
            'fields': [
                'date',
                'name',
                'email',
                'phone',
            ]
        }),
        ("Message", {
            'classes': ('wide', 'extrapretty'),
            'fields': [
                'message',
            ],
        }),
    ]

    readonly_fields = ('name', 'date', 'email', 'phone', 'message',)

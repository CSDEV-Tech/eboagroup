from django.contrib import admin

# Register your models here.
from newsletter.models import (Newsletter, Subscriber)



class PostInline(admin.TabularInline):
    model = Newsletter.posts.through
    extra = 2
    fields = ("image_tag", "post_related")
    readonly_fields = ("image_tag",)

class PromotionInline(admin.TabularInline):
    model = Newsletter.promotions.through
    extra = 2
    fields = ("image_tag", "promotion_related")
    readonly_fields = ("image_tag",)

class ProductInline(admin.TabularInline):
    model = Newsletter.articles.through
    extra = 2
    fields = ("image_tag", "article_related")
    readonly_fields = ("image_tag",)


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    readonly_fields = ("sent_at",)
    list_display = ("title", )
    fieldsets = [
        ("Général", {
            "fields": [
                "title",
                "sent_at"
            ]
        })
    ]

    inlines = [
        ProductInline,
        PromotionInline,
        PostInline,
    ]

@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    readonly_fields = ("email", "token", )
    list_display = ("email",)
from django.contrib import admin
from django.db.models import QuerySet

from blog.models import (Post, Tag, Category, Author, Comment, Hit)

#
# def show_all(modeladmin, request, queryset: QuerySet):
#     queryset.update(open=True)


# show_all.short_description = "Ouvrir les articles sélectionnés"

#
# def hide_all(modeladmin, request, queryset: QuerySet):
#     queryset.update(open=False)


# hide_all.short_description = "Fermer les articles sélectionnés"


@admin.register(Tag)
class Tag(admin.ModelAdmin):
    pass


class TagInline(admin.TabularInline):
    model = Post.tags.through
    extra = 2


class HitInline(admin.TabularInline):
    model = Hit
    extra = 0
    fields = ('ip', 'viewed_at', 'location')
    readonly_fields = ('ip', 'viewed_at', 'location')


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    fields = ('content', 'author', 'date',)
    readonly_fields = ('content', 'author', 'date',)


# Register your models here.
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("image_tag", "title", 'section', "category", 'hit_count', 'date', 'show',)
    list_editable = ('show',)
    list_filter = ('category', 'section', 'date',)

    search_fields = ["title", ]
    list_display_links = ("image_tag", "title",)

    readonly_fields = ("image_tag", "big_image_tag", "slug", 'hit_count')
    list_per_page = 20

    fieldsets = [
        ("Général", {
            'classes': ('suit-tab suit-tab-general',),
            'fields': [
                # 'open',
                'show',
                'section',
                'title',
                'slug',
                'category',
                'author',
            ]
        }),
        ("Image", {
            'classes': ('suit-tab suit-tab-general',),
            'fields': [
                'big_image_tag', 'image',
            ],
        }),
        ("Contenu", {
            'classes': ('wide', 'extrapretty'),
            'fields': [
                'content',
            ],
        }),
    ]

    # actions = [show_all, hide_all]
    inlines = [
        TagInline,
        CommentInline,
        HitInline
    ]


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    pass


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('image_tag', 'name', 'slug',)
    list_display_links = ('image_tag', 'name',)
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

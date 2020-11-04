from algoliasearch_django import AlgoliaIndex
from algoliasearch_django.decorators import register

from .models import (
    Article
)

from django.conf import settings

# Save on search only if on production
if not settings.DEBUG:
    @register(Article)
    class ArticleIndex(AlgoliaIndex):
        fields = (
            'name',
            'get_filters',
            'get_tags',
            'price',
            'description',
            'stock',
            'slug',
            'image1_url',
            'category_link',
            'id',
            'is_new',
            "category",
            'real_price'
        )
        settings = {'searchableAttributes': ['name', 'tags.tag', 'category', 'get_tags', 'get_filters', 'category_link']}
        index_name = 'article_index'

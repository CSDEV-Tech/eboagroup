from algoliasearch_django import AlgoliaIndex
from algoliasearch_django.decorators import register

from blog.models import (
    Post
)

from django.conf import settings

# Save on search only if on production
if not settings.DEBUG:
    @register(Post)
    class PostIndex(AlgoliaIndex):
        fields = (
            'title',
            'excerpt',
            'get_tags',
            'slug',
            'image_url',
            'category_title',
            'category_link',
            'id',
        )

        settings = {'searchableAttributes':
                        [
                            'title',
                            'tags.tag',
                            'category',
                            'get_tags',
                            'category_link'
                        ]
                    }
        index_name = 'blog_post_index'

from rest_framework import serializers

from blog.models import Post, Tag, Category, Author, Comment
from ecommerce.api.serializers import AccountSerializer


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            "id",
            'tag',
        )


class CategorySerializer(serializers.ModelSerializer):
    featured_title = serializers.CharField()
    featured_author = serializers.CharField()
    featured_slug = serializers.SlugField()
    featured_date = serializers.DateField()
    featured_image = serializers.ImageField()

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            'slug',
            "image",
            "featured_title",
            "featured_author",
            "featured_date",
            "featured_image",
            "featured_slug",
        )

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = (
            "id",
            "name",
        )


# class ResponseSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Comment
#         fields = (
#             'date',
#             'content',
#             "parent_id",
#         )


class CommentSerializer(serializers.ModelSerializer):
    author = AccountSerializer(read_only=True)
    # responses = ResponseSerializer(many=True, read_only=True)

    class Meta:
        model = Comment
        fields = (
            "id",
            'date',
            'content',
            "parent_id",
            'author',
            "get_date",
            # "responses"
        )


class PostResumeSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    author = AuthorSerializer(read_only=True)
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            'section',
            'title',
            "image",
            "published_at",
            "slug",
            "category_title",
            "author",
            "tags",
            "excerpt",
        ]

class CategoryShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            'slug',
        )

class PostSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    category = CategoryShortSerializer(read_only=True)
    author = AuthorSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            'section',
            'title',
            # "open",
            "image",
            "content",
            "published_at",
            "slug",
            "category",
            "author",
            "comments",
            "tags",
            "excerpt",
        ]

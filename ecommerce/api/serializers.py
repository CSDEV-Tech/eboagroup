from rest_framework import serializers
from ecommerce.models import (
    Article,
    Slide,
    Category,
    Promotion,
    Cart,
    CartLine,
    Account,
    User,
    WishList, Command, CommandLine, Tag, PromotionLine, CategoryFilter, Address, Town, Commune)

class MunicipalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Commune
        fields = (
            'name',
            'town',
            "shipping_cost"
        )


class TownSerializer(serializers.ModelSerializer):
    class Meta:
        model = Town
        fields = (
            'name',
        )


class CategoryFilterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryFilter
        fields = ("name", "id",)


class CategorySerializer(serializers.ModelSerializer):
    # article_set = ArticleSerializer(many=True, read_only=True)
    # parent = serializers.PrimaryKeyRelatedField(read_only=True)
    # subcategories = SubCategorySerializer(many=True, read_only=True)
    categoryfilter_set = CategoryFilterSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ("name", "id", 'slug',
                  # 'parent_id',
                  # 'parent',
                  # 'subcategories',
                  "categoryfilter_set",
                  "count", "image",)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            'tag',
        )


class ArticleSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    filters = CategoryFilterSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Article
        fields = (
            'id',
            'name',
            'tags',
            'price',
            'description',
            'stock',
            'image1',
            'image2',
            'image3',
            'image4',
            'category',
            'is_new',
            'real_price',
            'slug',
            "evaluation",
            'reduction',
            "order_number",
            "reviews_count",
            "filters",
        )


class ProductShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = (
            'id',
            'name',
            'price',
            'stock',
            'image1',
            'is_new',
            'real_price',
            'slug',
            "evaluation",
            'reduction',
        )


class PromotionLineSerializer(serializers.ModelSerializer):
    article_related = ArticleSerializer(read_only=True)

    class Meta:
        model = PromotionLine
        fields = (
            "article_related", "article_count",
            "id",
        )


class PromotionSerializer(serializers.ModelSerializer):
    articles = ArticleSerializer(many=True, read_only=True)
    promotionline_set = PromotionLineSerializer(many=True, read_only=True)

    class Meta:
        model = Promotion
        fields = (
            "presumed_price",
            "label",
            "total",
            "id",
            "date_begin",
            "date_end",
            "slug",
            "articles",
            "stock",
            "image",
            "description",
            "promotionline_set",
        )


class SlideSerializer(serializers.ModelSerializer):
    article_related = ArticleSerializer(read_only=True)

    class Meta:
        model = Slide
        fields = ("order", "image", "article_related", "leading", "title", "subtitle", "bg_image",)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'id', 'email']


class CartLineSerializer(serializers.ModelSerializer):
    article_related = ArticleSerializer(read_only=True)

    class Meta:
        model = CartLine
        fields = ("article_related", "article_count",)


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = (
            "address",
            "zone",
            "municipality",
            "town",
        )


class AccountSerializer(serializers.ModelSerializer):
    user_related = UserSerializer()
    address = AddressSerializer()

    class Meta:
        model = Account
        fields = (
            "contact1",
            "contact2",
            "user_related",
            "address",
            "avatar",
            "email_verified",
        )


class WishListSerializer(serializers.ModelSerializer):
    items = ArticleSerializer(many=True, read_only=True)

    class Meta:
        model = WishList
        fields = ("owner_id", "items")


class CartSerializer(serializers.ModelSerializer):
    cartline_set = CartLineSerializer(many=True)
    promotions = PromotionSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ('ref', 'cartline_set', 'promotions',)


class CommandLineSerializer(serializers.ModelSerializer):
    article_related = ArticleSerializer(read_only=True)

    class Meta:
        model = CommandLine
        fields = ("article_related", "article_count",)


class CommandSerializer(serializers.ModelSerializer):
    promotions = PromotionSerializer(many=True, read_only=True)
    commandline_set = CommandLineSerializer(many=True)
    owner = AccountSerializer()
    address = AddressSerializer()

    class Meta:
        model = Command
        fields = (
            'ref',
            'owner',
            'commandline_set',
            'total_cost',
            'shipping_code',
            'first_name',
            'last_name',
            'contact',
            'address',
            'date_reception',
            'date_emission',
            'delivered',
            'shipping_cost',
            'promotions',
        )

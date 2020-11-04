# Create your views here.
from algoliasearch_django import raw_search
from django.conf import settings
from django.core.paginator import Paginator
from django.db.models import OuterRef, Subquery, Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils.html import strip_tags
from rest_framework import status, permissions
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from blog.api.serializers import PostSerializer, CategorySerializer, PostResumeSerializer, CommentSerializer, \
    TagSerializer
from blog.forms import CommentForm, CommentEditForm, SearchForm
from blog.models import Post, Category, Hit, Comment, Tag
from ecommerce.api.serializers import ProductShopSerializer
from ecommerce.models import Article


class ContextAPIView:
    def set_data(self, data=None, error=False, msg=""):
        if data is None:
            data = {}
        return {"error": error, "msg": msg, **data}


def getIp(request: Request) -> str:
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    return ip


class IndexView(APIView, ContextAPIView):
    """
    Index
    """

    def get(self, request: Request):
        slider_posts = Post.objects.filter(
            category=OuterRef("pk"),
            show=True
        ).prefetch_related('author')

        categories = Category.objects.all().annotate(
            featured_title=Subquery(
                slider_posts.values('title')[:1]
            ),
            featured_author=Subquery(
                slider_posts.values('author__name')[:1]
            ),
            featured_date=Subquery(
                slider_posts.values('date')[:1]
            ),
            featured_image=Subquery(
                slider_posts.values('image')[:1]
            ),
            featured_slug=Subquery(
                slider_posts.values('slug')[:1]
            ),
        )

        featured_posts = Post.objects.filter(
            show=True,
            section=1
        ).prefetch_related("category", "author", "tags")[:5]

        popular_posts = Post.objects.filter(
            show=True,
            section=2
        ).prefetch_related("category", "author", "tags")[:4]

        products_ad = Article.objects.filter().order_by('-created_at')[:10]

        # FOR POSTS when showing one into the view
        # _.replace(str, /\.\.\/\.\.\/\.\.\/\.\.\/\.\./g, '')

        tags = Tag.objects.all()

        return Response(self.set_data(data={
            "categories": CategorySerializer(categories, many=True, read_only=True).data,
            "featured": PostResumeSerializer(featured_posts, many=True, read_only=True).data,
            "popular": PostResumeSerializer(popular_posts, many=True, read_only=True).data,
            "shop": ProductShopSerializer(products_ad, many=True, read_only=True).data,
            "tags": TagSerializer(tags, many=True, read_only=True).data,
        }))


class PostDetailView(APIView, ContextAPIView):
    def get(self, request: Request, slug: str):
        try:
            post = Post.objects.filter(slug=slug).prefetch_related('category', 'tags', 'comments', 'author').first()

            assert post is not None

            related = Post.objects.exclude(id=post.id).filter(category=post.category).prefetch_related('category',
                                                                                                       'tags',
                                                                                                       'comments',
                                                                                                       'author')
        except:
            return Response(self.set_data(error=True, msg="Post not found !"),
                            status=status.HTTP_404_NOT_FOUND)
        else:
            # Create of get the Hit for this post
            try:
                Hit.objects.get(ip=getIp(request), post_related=post)
            except Hit.DoesNotExist:
                hit = Hit(ip=getIp(request), post_related=post)
                hit.save()

            return Response(
                self.set_data(data={
                    "post": PostSerializer(post, read_only=True).data,
                    "related": PostResumeSerializer(related, many=True).data
                })
            )


class CommentView(APIView, ContextAPIView):
    """
    View for comment management
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request: Request, pk=None):
        # author = request.user.account
        request.data["author"] = request.user.account.id

        request.data["content"] = strip_tags(request.data.get("content"))

        form = CommentForm(request.data)

        if form.is_valid():
            comment = form.save()  # type: Comment

            return Response(
                self.set_data(data={
                    "comment": CommentSerializer(comment, read_only=True).data
                })
            )
        else:
            return Response(
                self.set_data(
                    error=True,
                    msg=form.errors,
                ),
                status=status.HTTP_400_BAD_REQUEST
            )

    def put(self, request: Request, pk: int):
        try:
            comment = get_object_or_404(Comment, pk=pk, author=request.user.account)
        except Http404:
            return Response(
                self.set_data(
                    error=True,
                    msg="Action Interdite",
                ),
                status=status.HTTP_403_FORBIDDEN
            )
        else:
            form = CommentEditForm(request.data, instance=comment)

            if form.is_valid():
                comment = form.save()

                return Response(
                    self.set_data(
                        msg="Commentaire mis à jour avec succès",
                        data={
                            "comment": CommentSerializer(comment, read_only=True).data
                        })
                )
            else:
                return Response(
                    self.set_data(
                        error=True,
                        msg=form.errors,
                    ),
                    status=status.HTTP_400_BAD_REQUEST
                )

    def delete(self, request: Request, pk: int):
        try:
            comment = get_object_or_404(Comment, pk=pk, author=request.user.account)
        except Http404:
            return Response(
                self.set_data(
                    error=True,
                    msg="Action Interdite",
                ),
                status=status.HTTP_403_FORBIDDEN
            )
        else:
            comment.delete()
            return Response(
                self.set_data(
                    msg="Commentaire supprimé avec succès", )
            )


class SearchView(APIView, ContextAPIView):
    def post(self, request: Request):

        form = SearchForm(request.data)

        if form.is_valid():
            data = self.search(form.data)
            return Response(self.set_data(
                msg="Requête exécutée avec succès",
                data=data
            ))
        else:
            return Response(
                self.set_data(
                    error=True,
                    msg=form.errors,
                ),
                status=status.HTTP_400_BAD_REQUEST
            )

    def search(self, data: dict):
        if data.get("tags", None) is None:
            data["tags"] = ""
        if data.get("query", None) is None:
            data["query"] = ""
        if data.get("category", None) is None:
            data["category"] = ""

        if data.get("page", None) is None:
            data["page"] = 1
        else:
            data["page"] = int(data["page"])

        if len(str(data["tags"]).strip()) > 0:
            tags = str(data["tags"]).split(";")
        else:
            tags = []

        # Make search
        if not settings.DEBUG:
            # On production : launch request on Algolia API server
            re_tags = [f"get_tags.tag:{tag}" for tag in tags]

            params = {
                "facetFilters": [
                    re_tags,
                    [f"category_link:{str(data['category'])}"],
                ],
                "page": int(str(data['page'])) - 1,
            }

            response = raw_search(Post, query=data['query'], params=params)
            results = response["hits"]
            total = response["nbHits"]
            num_pages = response["nbPages"]

        else:
            # On Dev : launch search on DB
            # print(f"'{q}'")
            queries = Q(title__icontains=data['query'])

            if len(str(data["category"])) > 0:
                queries = queries & Q(category__slug=str(data["category"]))

            if len(tags) > 0:
                queries = queries & Q(tags__tag__in=tags)


            print(queries)

            response = Post.objects.filter(queries).distinct()

            results = PostResumeSerializer(response.all(), many=True).data

            total = len(results)
            # Paginate results
            p = Paginator(results, 20)
            if not (data["page"] > p.num_pages):
                results = list(p.get_page(data["page"]).object_list)
            else:
                results = []

            num_pages = p.num_pages
            params = {}

        return {
            "results": results,
            'total_pages': num_pages,
            "page": data["page"],
            "total_results": total,
            "params": params
        }

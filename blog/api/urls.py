from django.urls import path, re_path
from . import views


app_name = "blog_api"

urlpatterns = [
    # Index of api
    path('', views.IndexView.as_view(), name="api_post_list"),
    path('p/<slug:slug>', views.PostDetailView.as_view(), name="api_post_detail"),
    re_path('^comment/?$', views.CommentView.as_view(), name="api_comment"),
    path('comment/<int:pk>', views.CommentView.as_view(), name="api_comment_manage"),
    path('comment/<int:pk>/', views.CommentView.as_view(), name="api_comment_manage2"),
    re_path('^search/?$', views.SearchView.as_view(), name="api_blog_search"),
]
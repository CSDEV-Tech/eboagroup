from django.urls import path, re_path
from . import views

app_name = "ecommerce_api"
urlpatterns = [
    # Index of api
    path('', views.IndexView.as_view(), name="api_index"),

    # users detail
    re_path('^user/?$', views.UserDetailView.as_view(), name="api_user_detail"),

    # auth management
    re_path('^login/?$', views.LoginView.as_view(), name="api_login"),
    re_path('^logout/?$', views.LogoutView.as_view(), name="api_logout"),
    re_path('^register/?$', views.RegisterView.as_view(), name="api_register"),
    #
    # # Password Management
    # path('^password/change/?$', views.UserViewSet.as_view(), name="api_password_change"),
    # path('^password/reset/?$', views.UserViewSet.as_view(), name="api_password_reset"),
    # path('^password/reset/confirm/?$', views.UserViewSet.as_view(), name="api_password_reset_confirm"),

    # Common List View
    re_path('^articles/?$', views.ArticleListView.as_view(), name="api_article_list"),

    re_path('^categories/?$', views.CategoryListView.as_view(), name="api_category_list"),

    re_path('^promotions/?$', views.PromotionListView.as_view(), name="api_promotion_list"),

    re_path('^slides/?$', views.SlideListView.as_view(), name="api_slides"),

    re_path('^latest-articles/?$', views.LatestArticlesListView.as_view(), name="api_latest_articles"),

    # Detail views
    path('p/<int:pk>', views.ArticleDetailView.as_view(), name="api_article_detail"),
    path('p/<int:pk>/', views.ArticleDetailView.as_view(), name="api_article_detail2"),

    path('promotions/<int:pk>', views.PromotionDetailView.as_view(), name="api_promotion_detail"),
    path('promotions/<int:pk>/', views.PromotionDetailView.as_view(), name="api_promotion_detail2"),

    path('categories/<int:pk>', views.CategoryDetailView.as_view(), name="api_category_detail"),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name="api_category_detail2"),

    # Shopping Cart Management
    re_path('^cart/?$', views.CartView.as_view(), name="api_basket_post"),

    path('cart/<str:ref>', views.CartView.as_view(), name="api_basket"),
    path('cart/<str:ref>/', views.CartView.as_view(), name="api_basket2"),
    re_path('^checkout/?$', views.CheckoutView.as_view(), name="api_checkout"),

    # Command management
    re_path("^commands/?$", views.CommandListView.as_view(), name="api_get_commands"),
    path("commands/<str:ref>", views.CommandDetailView.as_view(), name="api_command_detail"),
    path("commands/<str:ref>/", views.CommandDetailView.as_view(), name="api_command_detail2"),

    # wishlist
    re_path('^wishlist/?$', views.WishListView.as_view(), name="api_user_wishlist"),

    # note article
    re_path("^note-article/?$", views.NoteArticleView.as_view(), name="api_note_article"),

    # confirm email | send confirmation request
    re_path("^email-confirm/?$", views.ConfirmEmailView.as_view(), name="api_email_confirmation"),
    re_path("^send-email-confirm/?$", views.SendEmailConfirmView.as_view(), name="api_send_email_confirmation"),

    # reset password
    re_path("^password-reset/?$", views.ResetPasswordView.as_view(), name="api_password_reset"),
    # re_path("^password-reset/confirm/?$", views.ResetPasswordView.as_view(), name="api_password_reset"),

    # change password
    re_path('^password-change/?$', views.ChangePasswordView.as_view(), name="api_password_change"),

    # edit profile
    re_path('^profile-edit/?$', views.EditUserView.as_view(), name="api_edit_profile"),

    # contact
    re_path('^contact/?$', views.ContactView.as_view(), name="api_contact"),

    # search
    re_path('^search/?$', views.SearchView.as_view(), name="api_search"),
]

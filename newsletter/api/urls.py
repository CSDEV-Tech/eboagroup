from django.urls import path, re_path
from . import views


app_name = "newsletter_api"

urlpatterns = [
    # Index of api
    re_path('^subscribe/?$', views.SubscribeView.as_view(), name="api_newsletter_subscribe"),
    path('unsubscribe/<str:token>', views.SubscribeView.as_view(), name="api_newsletter_unsubscribe"),
    path('unsubscribe/<str:token>/', views.SubscribeView.as_view(), name="api_newsletter_unsubscribe2"),
]
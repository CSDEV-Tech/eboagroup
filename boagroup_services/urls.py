from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.csrf import csrf_exempt
from filebrowser.sites import site
from boagroup_services import views

urlpatterns = []

# DEBUG
if settings.DEBUG:
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [
    # For browsing files on the server
    path('admin/filebrowser/', site.urls),

    # For RichTextFeatures
    path('tinymce/', include("tinymce.urls")),

    # upload file
    path('uploadfile/', csrf_exempt(views.UploadView.as_view()), name="uploadfile"),

    # Admin Site
    path('admin/', admin.site.urls),
    path('admin', admin.site.urls),
    # path('', include("ecommerce.urls")),

    # Api Apps
    re_path('^api/blog/?', include("blog.api.urls")),
    re_path('^api/ecommerce/?', include("ecommerce.api.urls")),
    re_path('^api/newsletter/?', include("newsletter.api.urls")),
]

# Path for the view
urlpatterns += [
    path('', views.index, name="index"),
    path('email-confirm/<token>', views.index, name="email-confirm"),
    path('password-reset/<token>', views.index, name="password-reset"),
    re_path('^analytics/?$', views.analytics, name="analytics"),
    re_path('^invoice/?$', views.invoice, name="invoice"),
    re_path('^mail/?$', views.mail, name="mail"),
    re_path(r'^(?:.*)/?$', views.index, name="index_re"),
]

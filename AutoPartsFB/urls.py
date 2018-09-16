"""AutoPartsFB URL Configuration"""

from django.conf import settings
from django.urls import path, re_path, include
from django.conf.urls.static import static
from django.contrib import admin

from PartsFB.rest.views import create_anonymous_user

from django.contrib.staticfiles.urls import staticfiles_urlpatterns


urlpatterns = []

urlpatterns += [
    path('admin/', admin.site.urls),
    re_path(r'^auth/users/create-anonymous/', create_anonymous_user),
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('social_django.urls', namespace='social')),
    re_path(r'^auth/', include('djoser.social.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),
    re_path(r'^auth/', include('djoser.urls.jwt')),
]

urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += [path('', include('PartsFB.urls'))]

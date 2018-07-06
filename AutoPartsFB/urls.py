"""AutoPartsFB URL Configuration"""

from django.conf import settings
from django.urls import path, re_path, include
from django.conf.urls.static import static
from django.contrib import admin

from django.contrib.staticfiles.urls import staticfiles_urlpatterns


urlpatterns = []

if settings.DEBUG:
    urlpatterns += [re_path(r'^silk/', include('silk.urls'))]

urlpatterns += [
    path('admin/', admin.site.urls),
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),
]

urlpatterns += [path('', include('PartsFB.urls'))]

# urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

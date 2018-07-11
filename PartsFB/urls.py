from django.urls import path, re_path, include
from . import views
from .rest import urls as api_urls


urlpatterns = [
    path('api/', include(api_urls)),
    re_path(r'^', views.page),
    # re_path(r'^index$', views.page)
]

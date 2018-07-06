from django.urls import path, include
from . import views
from .rest import urls as api_urls


urlpatterns = [
    path('', views.page),
    path('index', views.page),
    path('api/', include(api_urls))
]

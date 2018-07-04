from django.urls import path, include
from . import views
from .api import PartBrandListResource, PartBrandDetailResource


api_urls = [
    path('part-brands/', PartBrandListResource.as_list()),
    path('part-brands/<int:pk>/', PartBrandDetailResource.as_detail()),
]

urlpatterns = [
    path('', views.page),
    path('index', views.page),
    path('api/', include(api_urls))
]

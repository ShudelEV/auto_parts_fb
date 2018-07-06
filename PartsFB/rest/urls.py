from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()
# router.register(r'detail-part-brands', views.PartBrandDetailViewSet, r'detail-part-brand')

urlpatterns = router.urls
#
urlpatterns += [
    path('part-brands/<int:pk>/', views.PartBrandDetailViewSet.as_view({'get': 'retrieve'})),
    path('part-brands/', views.PartBrandShortViewSet.as_view({'get': 'list'})),
]

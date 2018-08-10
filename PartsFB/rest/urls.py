from rest_framework import routers
from django.urls import path, include
from . import views


router = routers.DefaultRouter()
# router.register(r'detail-part-brands', views.PartBrandDetailViewSet, r'detail-part-brand')

urlpatterns = router.urls

feedbacks_urls = [
    path('', views.FeedbackList.as_view()),
    path('create/', views.create_feedback),
    # path('<int:pk>/'),
    path('<int:pk>/images/', views.ImageList.as_view()),
]
urlpatterns += [
    path('part-brands/<int:pk>/', views.PartBrandDetailViewSet.as_view({'get': 'retrieve'})),
    path('part-brands/', views.PartBrandShortViewSet.as_view({'get': 'list'})),
    path('<str:brand_name>/feedbacks/', include(feedbacks_urls)),
    path('part-types/', views.PartTypeList.as_view()),
    path('car-models/', views.CarModelList.as_view()),
]

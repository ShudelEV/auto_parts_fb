from django.urls import path, include
from . import views
from django_rester.views import Login, Logout

urls_accounts = [
    path('login/', Login.as_view(), name='login'),
    path('logout/', Logout.as_view(), name='logout'),
]

api_urlpatterns = [
    path('part-brands/', views.PartBrandView.as_view()),
    path('account/', include(urls_accounts))
]

urlpatterns = [
    path('', views.page),
    path('index', views.page),
    path('api/', include(api_urlpatterns))
]

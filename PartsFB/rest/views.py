from rest_framework import viewsets, status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from PartsFB.models import PartBrand
from .serializers import PartBrandDetailSerializer, PartBrandShortSerializer
from django.views.decorators.csrf import csrf_protect
from django.db.models import Prefetch
import logging
# from silk.profiling.profiler import silk_profile

logging.basicConfig(
    filename="test.log",
    level=logging.DEBUG,
    format="%(asctime)s:%(levelname)s:%(message)s"
)


def bad_request(err_massage):
    return Response(err_massage, status=status.HTTP_400_BAD_REQUEST)


class PartBrandDetailViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PartBrand.objects.all()
    serializer_class = PartBrandDetailSerializer


class PartBrandShortViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PartBrand.objects.all()
    serializer_class = PartBrandShortSerializer

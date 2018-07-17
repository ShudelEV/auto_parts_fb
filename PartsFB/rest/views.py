from rest_framework import viewsets, status, generics, mixins
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from PartsFB.models import PartBrand, FeedBack, PartType, Part
from .serializers import PartBrandDetailSerializer, PartBrandShortSerializer, FeedBackSerializer, \
    PartTypeSerializer, CreateFeedBackSerializer, CreatePartSerializer
from django.views.decorators.csrf import csrf_protect
from django.db.models import Prefetch
from PartsFB.data import PART_CATEGORIES
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


class FeedbackList(mixins.ListModelMixin, generics.GenericAPIView):
    queryset = FeedBack.objects.all()
    serializer_class = FeedBackSerializer

    def get(self, request, *args, **kwargs):
        self.queryset = self.queryset.filter(part__brand__name=kwargs['brand_name'])
        return self.list(request, *args, **kwargs)


class PartTypeList(mixins.ListModelMixin, generics.GenericAPIView):
    queryset = PartType.objects.all()
    serializer_class = PartTypeSerializer

    def get(self, request, *args, **kwargs):
        response = self.list(request, *args, **kwargs)
        part_types = response.data
        # Add PART_CATEGORIES to response
        response.data = {'category_list': PART_CATEGORIES, 'part_types': part_types}
        return response


@api_view(['POST'])
def create_feedback(request, *args, **kwargs):
    data = request.data
    # Build a part serializer
    part_data = {
        'type': data.get('part'),
        'brand': PartBrand.objects.get(name=kwargs.get('brand_name')).id,
    }
    if data.get('car'):
        part_data.update({'car': data.get('car')})
    part_serializer = CreatePartSerializer(data=part_data)
    if part_serializer.is_valid():
        # Add part
        part = part_serializer.save()
        # Build a fb serializer
        fb_data = {
            'part': part.id,
            'description': data.get('description'),
            'stars': data.get('stars'),
            # 'images': ''
        }
        fb_serializer = CreateFeedBackSerializer(data=fb_data)
        if fb_serializer.is_valid():
            # Add fb
            fb_serializer.save()
            return Response(fb_serializer.data, status=status.HTTP_201_CREATED)
        else:
            part.delete()
            return bad_request(fb_serializer.errors)
    else:
        return bad_request(part_serializer.errors)

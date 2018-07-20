from rest_framework import viewsets, status, generics, mixins
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from PartsFB.models import PartBrand, FeedBack, PartType, Part, CarModel, CarBrand
from .serializers import PartBrandDetailSerializer, PartBrandShortSerializer, FeedBackSerializer, \
    PartTypeSerializer, CreateFeedBackSerializer, CreatePartSerializer, CarModelSerializer, \
    CreateCarModelSerializer, CreateCarSerializer
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


class CarModelList(mixins.ListModelMixin, generics.GenericAPIView):
    queryset = CarModel.objects.all()
    serializer_class = CarModelSerializer

    def get(self, request, *args, **kwargs):
        response = self.list(request, *args, **kwargs)
        car_models = response.data
        brand_list = [i.name for i in CarBrand.objects.all().only('name')]
        # Add brand list to response
        response.data = {'brand_list': brand_list, 'car_models': car_models}
        return response


@csrf_protect
@api_view(['POST'])
@permission_classes((AllowAny, ))
def create_feedback(request, *args, **kwargs):
    data = request.data
    # { Build a part serializer
    part_data = {
        'brand': PartBrand.objects.get(name=kwargs.get('brand_name')).id,
    }
    if data.get('part'):
        part_data.update({'type': data.get('part')})
    elif data.get('new_part_type'):
        new_part_type_data = data.get('new_part_type')
        part_type_serializer = PartTypeSerializer(data={
            'name': new_part_type_data.get('name'),
            'category': new_part_type_data.get('category')
        })
        if part_type_serializer.is_valid():
            part_type = part_type_serializer.save()
            part_data.update({'type': part_type.id})
        else:
            return bad_request(part_type_serializer.errors)
    # }
    #   { Add a car to the part serializer data
    if data.get('car'):
        part_data.update({'car': data.get('car')})
    elif data.get('new_car'):
        # Create a new car
        new_car_data = data.get('new_car')
        car_model = None
        car_model_id = None
        if new_car_data.get('model'):
            car_model_id = new_car_data.get('model')
        elif new_car_data.get('brand') and new_car_data.get('model_name'):
            # Create a car model
            car_model_serializer = CreateCarModelSerializer(data={
                'name': new_car_data.get('model_name'),
                'brand': CarBrand.objects.get(name=new_car_data.get('brand')).id
            })
            if car_model_serializer.is_valid():
                car_model = car_model_serializer.save()
                car_model_id = car_model.id
            else:
                return bad_request(car_model_serializer.errors)
        car_serializer = CreateCarSerializer(data={
            'owner': 1,
            'model': car_model_id,
            'manufacture_year': new_car_data.get('year'),
            'engine_volume': new_car_data.get('engine_volume'),
            'engine_type': new_car_data.get('engine_type'),
            'gear': new_car_data.get('gear'),
            'body_style': new_car_data.get('body_style')
        })
        if car_serializer.is_valid():
            car_serializer.save()
            part_data.update({'car': car_serializer.save().id})
        else:
            if car_model:
                car_model.delete()
            return bad_request(car_serializer.errors)
        # }
    part_serializer = CreatePartSerializer(data=part_data)
    # }
    if part_serializer.is_valid():
        # Add a part
        part = part_serializer.save()
        # { Build a fb serializer
        fb_data = {
            'part': part.id,
            'description': data.get('description'),
            'stars': data.get('stars'),
            # 'images': ''
        }
        fb_serializer = CreateFeedBackSerializer(data=fb_data)
        # }
        if fb_serializer.is_valid():
            # Add fb
            fb_serializer.save()
            return Response(fb_serializer.data, status=status.HTTP_201_CREATED)
        else:
            part.delete()
            return bad_request(fb_serializer.errors)
    else:
        return bad_request(part_serializer.errors)

from rest_framework import viewsets, status, generics, mixins
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from rest_framework.response import Response
from django.contrib.auth.models import User
from PartsFB.models import PartBrand, FeedBack, PartType, Part, CarModel, CarBrand, Image
from .serializers import PartBrandDetailSerializer, PartBrandShortSerializer, FeedBackSerializer, \
    PartTypeSerializer, CreateFeedBackSerializer, CreatePartSerializer, CarModelSerializer, \
    CreateCarModelSerializer, CreateCarSerializer, ImageSerializer
from django.views.decorators.csrf import csrf_protect
from django.db.models import Prefetch
from PartsFB.data import PART_CATEGORIES, FIRST_NAMES, LAST_NAMES
import random
import logging
# from silk.profiling.profiler import silk_profile

logging.basicConfig(
    filename="test.log",
    level=logging.DEBUG,
    format="%(asctime)s:%(levelname)s:%(message)s"
)


def bad_request(err_massage):
    return Response(err_massage, status=status.HTTP_400_BAD_REQUEST)


def generate_random_username(**kwargs):
    if kwargs.get('username'):
        username = kwargs.get('username') + random.randint(1, 999)
    else:
        first = random.sample(FIRST_NAMES, 1)[0]
        last = random.sample(LAST_NAMES - {first}, 1)[0]
        username = first + last
    try:
        User.objects.get(username=username)
        return generate_random_username(username=username)
    except User.DoesNotExist:
        return username


@csrf_protect
@api_view(['GET'])
# @authentication_classes((BasicAuthentication, ))
# @permission_classes((AllowAny, ))
def create_anonymous_user(request):
    username = generate_random_username()
    password = User.objects.make_random_password()
    try:
        User.objects.create_user(username, password=password)
    except Exception:
        return bad_request('')
    else:
        return Response(data={'username': username, 'password': password}, status=status.HTTP_200_OK)


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
@permission_classes((IsAuthenticated, ))
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
    user_id = User.objects.get(username=request.user).id
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
            'owner': user_id,
            'model': car_model_id,
            'manufacture_year': new_car_data.get('year'),
            'engine_volume': new_car_data.get('engine_volume'),
            'engine_type': new_car_data.get('engine_type'),
            'gear': new_car_data.get('gear'),
            'body_style': new_car_data.get('body_style')
        })
        if car_serializer.is_valid():
            car = car_serializer.save()
            part_data.update({'car': car.id})
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
            'owner': user_id,
            'part': part.id,
            'description': data.get('description'),
            'stars': data.get('stars')
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


class ImageList(APIView):
    permission_classes = (IsAuthenticated, )
    parser_classes = (MultiPartParser,)

    def post(self, request, format=None, **kwargs):
        data = request.data
        data.update({'feedback': kwargs.get('pk')})
        serializer = ImageSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return bad_request(serializer.errors)

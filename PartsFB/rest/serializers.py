from rest_framework import serializers
from rest_framework.relations import StringRelatedField, SlugRelatedField
from rest_framework.fields import JSONField
from django.contrib.auth.models import User
from PartsFB.models import PartBrand, FeedBack, Car, CarModel, Part, PartType, Image
from django.utils.translation import gettext_lazy as _


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class PartBrandShortSerializer(serializers.ModelSerializer):
    fb_quantity = serializers.SerializerMethodField()

    class Meta:
        model = PartBrand
        fields = ('id', 'name', 'image', 'country', 'specialization', 'site_url', 'fb_quantity')

    def get_fb_quantity(self, obj):
        return FeedBack.objects.filter(part__brand=obj).count()


class PartBrandDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartBrand
        fields = '__all__'


class CarModelSerializer(serializers.ModelSerializer):
    brand = StringRelatedField()

    class Meta:
        model = CarModel
        fields = ['id', 'name', 'brand']


class CreateCarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModel
        fields = '__all__'


class CarSerializer(serializers.ModelSerializer):
    owner = StringRelatedField()
    model = StringRelatedField()

    class Meta:
        model = Car
        fields = ['id', 'owner', 'model', 'manufacture_year', 'engine_volume', 'engine_type', 'gear', 'body_style']


class CreateCarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'


class TranslatablePartTypeSerializer(serializers.ModelSerializer):
    name_t = serializers.SerializerMethodField('get_name')

    class Meta:
        model = PartType
        fields = ['id', 'name_t', 'category']

    def get_name(self, obj):
        return _(obj.name)


class PartTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartType
        fields = ['id', 'name', 'category']


class PartSerializer(serializers.ModelSerializer):
    type_t = serializers.SerializerMethodField('get_type_name')
    car = CarSerializer()

    class Meta:
        model = Part
        fields = ['id', 'type_t', 'brand', 'car']

    def get_type_name(self, obj):
        return _(obj.type.name)


class CreatePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = ['type', 'brand', 'car']


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['image', 'description']


class CreateImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class FeedBackSerializer(serializers.ModelSerializer):
    # represent field using __str__ method of the model (read only)
    owner = StringRelatedField()
    part = PartSerializer()
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = FeedBack
        fields = ['id', 'owner', 'part', 'description', 'stars', 'images', 'created', 'updated']


class CreateFeedBackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedBack
        fields = ['id', 'owner', 'part', 'description', 'stars']


from rest_framework import serializers
from rest_framework.relations import StringRelatedField, SlugRelatedField
from django.contrib.auth.models import User
from PartsFB.models import PartBrand, FeedBack, Car, CarModel, Part


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class PartBrandShortSerializer(serializers.ModelSerializer):
    fb_quantity = serializers.SerializerMethodField()

    class Meta:
        model = PartBrand
        fields = ('id', 'name', 'country', 'fb_quantity')

    def get_fb_quantity(self, obj):
        return FeedBack.objects.filter(part__brand=obj).count()


class PartBrandDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartBrand
        fields = '__all__'


class CarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModel
        fields = '__all__'


class CarSerializer(serializers.ModelSerializer):
    owner = StringRelatedField()
    model = StringRelatedField()

    class Meta:
        model = Car
        fields = ['id', 'owner', 'model', 'manufacture_year', 'engine_volume', 'engine_type', 'gear', 'body_style']


class PartSerializer(serializers.ModelSerializer):
    type = StringRelatedField()
    car = CarSerializer()

    class Meta:
        model = Part
        fields = ['id', 'type', 'car']


class FeedBackSerializer(serializers.ModelSerializer):
    # represent field using __str__ method of the model (read only)
    owner = StringRelatedField()
    part = PartSerializer()

    class Meta:
        model = FeedBack
        fields = ['id', 'owner', 'part', 'description', 'stars', 'images', 'created', 'updated']

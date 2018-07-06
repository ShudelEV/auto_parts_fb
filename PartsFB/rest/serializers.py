from rest_framework import serializers
from PartsFB.models import PartBrand


class PartBrandShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartBrand
        fields = ('id', 'name', 'country')


class PartBrandDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartBrand
        fields = '__all__'

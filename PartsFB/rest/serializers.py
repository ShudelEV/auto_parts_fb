from rest_framework import serializers
from PartsFB.models import PartBrand, FeedBack


class PartBrandShortSerializer(serializers.ModelSerializer):
    fb_quantity = serializers.SerializerMethodField()

    class Meta:
        model = PartBrand
        fields = ('id', 'name', 'country', 'fb_quantity')

    def get_fb_quantity(self, obj):
        feedbacks_qset = FeedBack.objects\
            .select_related('part', 'part__brand')\
            .only('part', 'part__brand')
        return feedbacks_qset.filter(part__brand=obj).count()


class PartBrandDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartBrand
        fields = '__all__'


class FeedBackSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedBack
        fields = '__all__'

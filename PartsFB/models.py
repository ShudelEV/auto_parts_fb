from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from .data import COUNTRIES, PART_CATEGORIES, ENGINE_TYPE, GEAR_TYPE, BODY_STYLE


def brand_image_path(instance, filename):
    return 'manufacturer_images/{1}'.format(instance.name, filename)


# Abstract class Manufacturer
class Manufacturer(models.Model):
    name = models.CharField(max_length=200, unique=True)
    COUNTRY_CHOICES = tuple((key, _(value)) for key, value in COUNTRIES.items())
    country = models.CharField(max_length=2, choices=COUNTRY_CHOICES)
    image = models.ImageField(blank=True, max_length=255, upload_to=brand_image_path)
    description = models.TextField(blank=True)
    site_url = models.URLField(blank=True, null=True)

    class Meta:
        abstract = True
        ordering = ['name']


class PartBrand(Manufacturer):
    specialization = models.CharField(max_length=256, blank=True, null=True)

    def __str__(self):
        return '{0} ({1})'.format(self.name, self.country)


class PartType(models.Model):
    name = models.CharField(max_length=200, unique=True)
    CATEGORY_CHOICES = tuple((key, _(value)) for key, value in PART_CATEGORIES.items())
    category = models.CharField(max_length=2, choices=CATEGORY_CHOICES)

    def __str__(self):
        return self.name


class CarBrand(Manufacturer):
    def __str__(self):
        return self.name


class CarModel(models.Model):
    name = models.CharField(max_length=200)
    brand = models.ForeignKey(CarBrand, models.PROTECT, related_name='car_models')
    # model_year = models.TextField()

    def __str__(self):
        return '{0} {1}'.format(self.brand, self.name)

    class Meta:
        unique_together = ('name', 'brand')


class Car(models.Model):
    owner = models.ForeignKey(User, models.PROTECT, related_name='cars')
    model = models.ForeignKey(CarModel, models.PROTECT, related_name='cars')
    manufacture_year = models.IntegerField(null=True, blank=True)
    engine_volume = models.IntegerField(null=True, blank=True)
    engine_type = models.IntegerField(choices=ENGINE_TYPE, null=True, blank=True)
    gear = models.IntegerField(choices=GEAR_TYPE, null=True, blank=True)
    body_style = models.IntegerField(choices=BODY_STYLE, null=True, blank=True)

    def __str__(self):
        return '{0} / Owner: {1}'.format(self.model, self.owner)


class Part(models.Model):
    type = models.ForeignKey(PartType, models.SET_NULL, null=True, blank=True, related_name='parts')
    brand = models.ForeignKey(PartBrand, models.PROTECT, related_name='parts')
    car = models.ForeignKey(Car, models.SET_NULL, null=True, blank=True, related_name='parts')

    def __str__(self):
        return '{0}/{1}'.format(self.type, self.brand)


class FeedBack(models.Model):
    owner = models.ForeignKey(User, models.PROTECT, related_name='feedbacks', default=1)
    part = models.ForeignKey(Part, models.PROTECT, related_name='feedbacks')
    description = models.TextField()
    STARS = (
        (1, _('bad')),
        (2, _('no bad')),
        (3, _('normal')),
        (4, _('good')),
        (5, _('very good'))
    )
    stars = models.IntegerField(choices=STARS)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True, blank=True, null=True)

    def __str__(self):
        return '{0}'.format(self.part)

    class Meta:
        ordering = ['part__brand', '-created']


def fb_images_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/Users/<user_name>/feedbacks/<filename>
    return 'Users/{0}/feedbacks/{1}'.format(instance.feedback.owner, filename)


class Image(models.Model):
    image = models.ImageField(max_length=255, upload_to=fb_images_path)
    description = models.CharField(max_length=255, null=True, blank=True)
    feedback = models.ForeignKey(FeedBack, related_name='images', on_delete=models.CASCADE)

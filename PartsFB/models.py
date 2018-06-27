from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from .data import COUNTRIES, PART_CATEGORIES


def brand_image_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/<PartBrandImages> or <CarBrandImages>/<brand_name>
    return '{0}Images/{1}'.format(instance.name, filename)


# Abstract class Manufacturer
class Manufacturer(models.Model):
    name = models.CharField(max_length=200, unique=True)
    COUNTRY_CHOICES = tuple((code, _(name)) for code, name in list(COUNTRIES))
    country = models.CharField(max_length=2, choices=COUNTRY_CHOICES)
    image = models.ImageField(blank=True, max_length=255, upload_to=brand_image_path)
    description = models.TextField()

    class Meta:
        abstract = True
        ordering = ['name']


class PartBrand(Manufacturer):
    pass


class PartType(models.Model):
    name = models.CharField(max_length=200)
    brand = models.ForeignKey(PartBrand, models.CASCADE, related_name='parts')
    CATEGORY_CHOICES = tuple((code, _(name)) for code, name in list(PART_CATEGORIES))
    category = models.CharField(max_length=1, choices=CATEGORY_CHOICES)


class CarBrand(Manufacturer):
    pass


class CarModel(models.Model):
    name = models.CharField(max_length=200)
    brand = models.ForeignKey(CarBrand, models.SET_NULL, null=True)
    description = models.TextField()
    # model_year = models.TextField()


class Car(models.Model):
    owner = models.ForeignKey(User, models.PROTECT)
    model = models.ForeignKey(CarModel, models.SET_NULL, null=True)
    # engine
    # gear
    # body_style


class Part(models.Model):
    type = models.ForeignKey(PartType, models.SET_NULL, null=True)
    car = models.ForeignKey(Car, models.SET_NULL, null=True)


def fb_images_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/Users/<user_name>/feedbacks/<filename>
    return 'Users/{0}/feedbacks/{1}'.format(instance.part.car.owner, filename)


class FeedBack(models.Model):
    part = models.ForeignKey(Part, models.CASCADE, related_name='feedbacks')
    description = models.TextField()
    STARS = (
        ('1', 'bad'),
        ('2', 'no bad'),
        ('3', 'normal'),
        ('4', 'good'),
        ('5', 'very good')
    )
    stars = models.TextField(choices=STARS)
    images = models.ImageField(blank=True, max_length=255, upload_to=fb_images_path)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True, null=True)

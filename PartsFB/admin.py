from django.contrib import admin
from .models import FeedBack, Part, PartType, PartBrand, Car, CarModel, CarBrand


admin.site.register([FeedBack, Part, PartType, PartBrand, Car, CarModel, CarBrand])

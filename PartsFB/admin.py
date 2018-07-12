from django.contrib import admin
# from Profile.models import User
from .models import FeedBack, Part, PartType, PartBrand, Car, CarModel, CarBrand


admin.site.register([FeedBack, Part, PartType, PartBrand, Car, CarModel, CarBrand])

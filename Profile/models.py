from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    phone = models.CharField(verbose_name="phone number", max_length=13, blank=True)
    # ? Add a number validator
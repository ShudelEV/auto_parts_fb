from django.db import models
from django.contrib.auth.models import AbstractUser


def avatar_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/Users/<user_name>/<filename>
    return 'Users/{0}/{1}'.format(instance, filename)


class User(AbstractUser):
    avatar = models.ImageField(
        verbose_name="avatar", blank=True, max_length=255, upload_to=avatar_path
    )

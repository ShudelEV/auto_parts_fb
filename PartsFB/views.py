from django.shortcuts import render
# ------------------------------- API -------------------------------------------
from django_rester.views import BaseAPIView
from django_rester.decorators import permissions
from django_rester.exceptions import ResponseOkMessage
from django_rester.permission import AllowAny, IsAdmin
from django_rester.status import HTTP_200_OK
from PartsFB.models import CarBrand
from django_rester.fields import JSONField
# -------------------------------------------------------------------------------


# View for index page.
def page(request):
    return render(request, 'index.html')


# ------------------------------- API -------------------------------------------
class TestView(BaseAPIView):
    # request_fields and response_fields are validators
    request_fields = {"POST": {
        "id": JSONField(field_type=int, required=True),
        "name": JSONField(field_type=str, required=True),
        "country": JSONField(field_type=str, required=True),
        "image": JSONField(field_type=str, required=True),
        "description": JSONField(field_type=str, required=True),
        # "fk": [{"id": JSONField(field_type=int, required=True)}],
        },
        "GET": {
            "id": JSONField(field_type=int),
        }
    }

    response_fields = {"POST": {
        "id": JSONField(field_type=int, required=True),
        "name": JSONField(field_type=str, required=True),
        "country": JSONField(field_type=str, required=True),
        "image": JSONField(field_type=str, required=True),
        "description": JSONField(field_type=str, required=True),},
        "GET": {
            "id": JSONField(field_type=int, required=True),
            "name": JSONField(field_type=str, required=True),
            "country": JSONField(field_type=str, required=True),
            "image": JSONField(field_type=str, required=True),
            "description": JSONField(field_type=str, required=True),
        }
    }

    def retrieve_items(self):
        return CarBrand.objects.all()

    def create_item(self, title):
        item, cre = CarBrand.objects.get_or_create(title=title)
        return item, cre

    @permissions(AllowAny)
    def get(self, request, request_data, *args, **kwargs):
        items = self.retrieve_items()
        response_data = {}
        return response_data, HTTP_200_OK

    @permissions(IsAdmin)
    def post(self, request, request_data, *args, **kwargs):
        title = request_data.get('title', None)
        # no need to check 'if title', because it is allready validated by 'available_fields'
        # ... here we will do some view magic with the rest request_data
        item, cre = self.create_item(title)
        if not cre:
            raise ResponseOkMessage(message='Item allready exists', data={'title': title})
        response_data = {}
        return response_data, HTTP_200_OK

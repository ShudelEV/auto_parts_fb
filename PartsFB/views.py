from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND


# View for index page.
def page(request):
    return render(request, 'index.html')


def not_found_404(request):
    return Response(status=HTTP_404_NOT_FOUND)

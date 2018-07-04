from restless.dj import DjangoResource
from restless.preparers import FieldsPreparer

from .models import PartBrand

# ------------------------------- Debug -----------------------------------------
import logging
from silk.profiling.profiler import silk_profile

logging.basicConfig(
    filename="test.log",
    level=logging.DEBUG,
    format="%(asctime)s:%(levelname)s:%(message)s"
)

# logging.debug("REST.readShops/Form: {}".format(request.data))


class PartBrandListResource(DjangoResource):
    preparer = FieldsPreparer(fields={
        'id': 'id',
        'name': 'name',
        'country': 'country',
    })

    def list(self):
        return PartBrand.objects.all().prefetch_related('parts')


class PartBrandDetailResource(DjangoResource):
    preparer = FieldsPreparer(fields={
        'id': 'id',
        'name': 'name',
        'country': 'country',
        'description': 'description',
    })

    # Override image field because error: ImageField is not JSON serializable
    def prepare(self, data):
        prepped = super(PartBrandDetailResource, self).prepare(data)
        prepped.update({'image': data.image.__str__()})
        return prepped

    def detail(self, pk):
        return PartBrand.objects.get(pk=pk)

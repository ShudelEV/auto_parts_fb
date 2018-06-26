from .settings import *

DEBUG = True

INTERNAL_IPS = ['127.0.0.1']
ALLOWED_HOSTS += INTERNAL_IPS
ALLOWED_HOSTS.append('localhost')
# Media static files (Images, Video)
MEDIA_ROOT = os.path.join(BASE_DIR, 'static/public/')

# Debug Tools for api's projects
INSTALLED_APPS.append('silk')
MIDDLEWARE.append('silk.middleware.SilkyMiddleware')
# SILKY_PYTHON_PROFILER = True

# App for hot-reload feature
INSTALLED_APPS.append('webpack_loader')
WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}

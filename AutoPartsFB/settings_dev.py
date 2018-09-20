from .settings import *

DEBUG = True

# Debug Tools for api's projects
INSTALLED_APPS.append('silk')
# MIDDLEWARE.append('silk.middleware.SilkyMiddleware')
# SILKY_PYTHON_PROFILER = True

# App for hot-reload feature
INSTALLED_APPS.append('webpack_loader')
WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'dist/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}

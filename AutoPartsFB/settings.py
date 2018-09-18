import os
from datetime import timedelta
import dj_database_url
import django_heroku
from django.utils.translation import gettext_lazy as _

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 'f1_g=%%re(xwle(n!(7@)=ih47ckk5%qvuufre7e5vqlly0)ew'

DEBUG = False

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['avtoparts.herokuapp.com']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework_jwt',
    'djoser',
    'social_django',
    'PartsFB.apps.PartsFBConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'AutoPartsFB.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'PartsFB/static/templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'debug': DEBUG,
        },
    },
]

WSGI_APPLICATION = 'AutoPartsFB.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'autoparts_db',
        'USER': 'autoparts_user',
        'PASSWORD': 'autoparts5000',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# Parse database configuration from $DATABASE_URL
DATABASES['default'].update(dj_database_url.config(conn_max_age=500, ssl_require=True))

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FileUploadParser',
    ),
}

# I18N, L10N
LANGUAGES = [
    ('ru', _('Russian')),
    ('en', _('English')),
]
LOCALE_PATHS = [
    os.path.join(BASE_DIR, 'AutoPartsFB/locale/'),
]
LANGUAGE_CODE = 'en-us'
USE_TZ = True
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True

# File spreading
STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_DIRS = (
    # os.path.join(BASE_DIR, 'PartsFB/static/'),
)
# Simplified static file serving.
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media static files (Images, Video)
MEDIA_URL = '/media/'
# Change path for production
MEDIA_ROOT = os.path.join(BASE_DIR, 'static/public/')

# python-social-auth
SOCIAL_AUTH_POSTGRES_JSONFIELD = True

AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.vk.VKOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
    'social_core.backends.twitter.TwitterOAuth',
    'django.contrib.auth.backends.ModelBackend',
)

# SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/'

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '475790162750-ler2ioqumfa9qrobql0j6qeh7lfnr61u.apps.googleusercontent.com'
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = 'TDFXKJD4l8FmhTDkd-N8k1TC'

SOCIAL_AUTH_GOOGLE_OAUTH2_IGNORE_DEFAULT_SCOPE = True
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
]
SOCIAL_AUTH_VK_OAUTH2_KEY = '6670405'
SOCIAL_AUTH_VK_OAUTH2_SECRET = 'qSX7E2IZhk1LQDYySu6I'

SOCIAL_AUTH_FACEBOOK_KEY = '254286108555969'
SOCIAL_AUTH_FACEBOOK_SECRET = '532a3eb5975b519f43d079d51897cd85'
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
  'locale': 'ru_RU',
  'fields': 'id, name, email'
}

SOCIAL_AUTH_TWITTER_KEY = ''
SOCIAL_AUTH_TWITTER_SECRET = ''

# djoser
DJOSER = {
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS': [
        '/logged-in/google-oauth2',
        '/logged-in/vk-oauth2',
        '/logged-in/facebook-oauth2',
        '/logged-in/twitter-oauth'
    ]
}

JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': timedelta(hours=12),  # default - 300 seconds
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(hours=168),  # default - 7 days
    'JWT_ALLOW_REFRESH': True,
}

# Activate Django-Heroku.
django_heroku.settings(locals())

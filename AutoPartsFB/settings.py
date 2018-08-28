import os
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 'f1_g=%%re(xwle(n!(7@)=ih47ckk5%qvuufre7e5vqlly0)ew'

DEBUG = False

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_jwt',
    'djoser',
    'social_django',
    # 'Profile.apps.ProfileConfig',
    'PartsFB.apps.PartsFBConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# AUTH_USER_MODEL = 'Profile.User'

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
        'rest_framework.authentication.TokenAuthentication',
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
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    # 'PAGE_SIZE': 100
}

# I18N, L10N
LANGUAGE_CODE = 'en-us'
USE_TZ = True
TIME_ZONE = 'Europe/Minsk'
USE_I18N = True
USE_L10N = True

# File spreading
STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static')
# STATIC_DIRS = (
#     os.path.join(BASE_DIR, 'static/'),
# )

# Media static files (Images, Video)
MEDIA_URL = '/media/'
# Change path for production
MEDIA_ROOT = os.path.join(BASE_DIR, 'static/public/')

# python-social-auth
SOCIAL_AUTH_POSTGRES_JSONFIELD = True

AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.vk.VKOAuth2',
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

# djoser
DJOSER = {
    'SOCIAL_AUTH_ALLOWED_REDIRECT_URIS': [
        '/auth/o/vk-oauth2/',
        '/logged-in/google-oauth2',
        '/logged-in/vk-oauth2',
        '/logged-in/twitter-oauth'
    ]
}

JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': timedelta(days=1),  # default - 300 seconds
    'JWT_REFRESH_EXPIRATION_DELTA': timedelta(days=7),  # default
    'JWT_ALLOW_REFRESH': True,
}

from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"), # make new user
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"), # view to get token
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"), # view to refresh token
    path("api-auth/", include("rest_framework.urls")), # view to authenticate
    path("api/", include("api.urls")), # send to api routes
]

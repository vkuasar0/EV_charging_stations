from django.urls import path
from .views import *

urlpatterns = [
    path('get-location', CityLocation.as_view(), name='get-location'),
    path('get-station', StationLocation.as_view(), name='get-station')
]
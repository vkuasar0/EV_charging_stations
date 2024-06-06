from pymongo import MongoClient
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import os
from dotenv import load_dotenv
load_dotenv()

client = MongoClient(os.getenv('MONGO_URL'))
database = client[os.getenv('MONGO_DB')]

class CityLocation(APIView):
    def post(self, request, format=None):
        city = request.data.get('city')
        if city is None:
            return Response({ 'message': 'Missing required fields: city'}, status=status.HTTP_400_BAD_REQUEST)
        data = database.get_collection('locations').find_one({'city': city})
        if data is None:
            return Response({ 'message': 'City not found'}, status=status.HTTP_204_NO_CONTENT)
        response_data = {
            'latitude': data['location']['latitude'],
            'longitude': data['location']['longitude']
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
class StationLocation(APIView):
    def post(self, request, format=None):
        city = request.data.get('city')
        if city is None:
            return Response({ 'message': 'Missing required fields: city'}, status=status.HTTP_400_BAD_REQUEST)
        data = database.get_collection('stations').find_one({'city': city})
        if data is None:
            return Response({ 'message': 'Station not found'}, status=status.HTTP_204_NO_CONTENT)
        response_data = {
            'latitude': data['location']['latitude'],
            'longitude': data['location']['longitude']
        }
        return Response(response_data, status=status.HTTP_200_OK)
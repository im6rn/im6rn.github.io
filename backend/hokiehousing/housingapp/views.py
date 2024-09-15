from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import UserPreferences


@csrf_exempt
def submit_quiz(request):
    try:
        data = json.loads(request.body)
        
        preferences = UserPreferences.objects.create(
            desired_price = data["desired_price"],
            utilities = data["utilities_included"],
            bedrooms = data['desired_bedrooms'],
            bathrooms = data["desired_bathrooms"],
            amenities = data['desired_amenities'],
            public_transit = data['public_transport']
        )

        return JsonResponse({'status': 'success', 'user_token': preferences.id})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

def get_apartment_listings(request):
    user_id = request.GET.get("user_token")

    try:
        preferences = UserPreferences.objects.get(id=user_id)

        file_path = settings.BASE_DIR / 'housingapp' / 'apt_data.json'

        with open(file_path, 'r') as file:
            data = json.load(file)

        response = []

        for apt in data:
            tn = {
                "apt_id": apt["apt_id"],
                "sq_ft": apt["sq_ft"],
                "num_rooms": apt["num_rooms"],
                "num_bathrooms": apt["num_bathrooms"],
                "address": apt["address"]
            }

            response.append(tn)
        
        return JsonResponse({"status": "success", "content": response}, safe = False)



    
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    
    pass

def calculate_score(apartment, preferences):
    importance = preferences.importance


    pass

def get_apartment_details(request, apartment_id):
    pass


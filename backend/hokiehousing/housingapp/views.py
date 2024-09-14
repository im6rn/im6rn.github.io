from django.shortcuts import render
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
            on_campus = data['on_campus'],
            in_suite_bath = data['in_suite_bath'],
            desired_price = data["desired_price"],
            max_price = data["max_price"],
            utilities_included = data["utilities_included"],
            living_learning_community = data["living_learning_community"],
            ac = data["ac"],
            public_transport = data["public_transport"],
            desired_amenities = ["desired_amenities"],
            desired_bathrooms = data["desired_bathrooms"],
            desired_bedrooms = data["desired_bedrooms"],
            desired_distance_from_campus = data["desired_distance_from_campus"],
            max_distance_from_campus = data["max_distance_from_campus"],
            importance = data["importance"]
        )

        return JsonResponse({'status': 'success', 'user_token': preferences.id})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

def get_apartment_listings(request):
    pass

def calculate_score(apartment, preferences):
    pass

def get_apartment_details(request, apartment_id):
    pass


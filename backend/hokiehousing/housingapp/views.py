from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import UserPreferences

sample_apts = [
    {
        "complex": "Halstead Fair Oaks",
        "address": "4576 Hunt Club Circle, Fairfax, VA 22033",
        "on_campus": False,
        "in_suite_bath": True,
        "price": 2200,
        "utilities_included": True,
        "living_learning_community": [],
        'ac': True,
        "public_transport": True,
        "amenities": [
            "pool",
            "washer/dryer",
            "trash"
        ],
        "furnished": False,
        "bathrooms": 2,
        "bedrooms": 2,
        "distance_from_campus": 5
    },
    {
        "complex": "The Knoll at Fair Oaks",
        "address": "5555 Pender Creek Circle, Fairfax, VA 22033",
        "on_campus": False,
        "in_suite_bath": True,
        "price": 2900,
        "utilities_included": True,
        "living_learning_community": [],
        'ac': True,
        "public_transport": True,
        "amenities": [
            "pool",
            "washer/dryer",
            "trash",
            "mewhenthe"
        ],
        "furnished": False,
        "bathrooms": 2,
        "bedrooms": 3,
        "distance_from_campus": 7
    }
]

@csrf_exempt
def submit_quiz(request):
    try:
        data = json.loads(request.body)
        
        # Check if the student is living on-campus or off-campus
        on_campus = data.get('on_campus', False)

        if on_campus:
            # On-campus: Use only relevant fields
            preferences = UserPreferences.objects.create(
                on_campus=True,
                in_suite_bath=data.get('in_suite_bath'),
                ac=data.get('ac'),
                living_learning_community=data.get('living_learning_community', []),
                # Add more on-campus specific fields
            )
        else:
            # Off-campus: Use the off-campus relevant fields
            preferences = UserPreferences.objects.create(
                on_campus=False,
                desired_price=data.get('desired_price'),
                utilities_included=data.get('utilities_included'),
                public_transport=data.get('public_transport'),
                desired_amenities=data.get('desired_amenities', []),
                furnished=data.get('furnished'),
                desired_bathrooms=data.get('desired_bathrooms'),
                desired_bedrooms=data.get('desired_bedrooms'),
                desired_distance_from_campus=data.get('desired_distance_from_campus'),
                # Add more off-campus specific fields
            )

        return JsonResponse({'status': 'success', 'user_token': preferences.id})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

def get_apartment_listings(request):

    
    pass

def calculate_score(apartment, preferences):
    importance = preferences.importance


    pass

def get_apartment_details(request, apartment_id):
    pass


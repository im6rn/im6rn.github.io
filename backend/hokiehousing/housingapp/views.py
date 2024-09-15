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
                "price": apt["price_per_month"],
                "sq_ft": apt["sq_ft"],
                "num_rooms": apt["num_rooms"],
                "num_bathrooms": apt["num_bathrooms"],
                "address": apt["address"],
                "rating": calculate_score(apt, preferences)
            }

            response.append(tn)

        sorted_response = sorted(response, key=lambda x: x['rating'], reverse=True)
        
        return JsonResponse({"status": "success", "content": response}, safe = False)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    
    pass

def calculate_score(apartment, preferences):
    score = 0
    max_score = 100  # Set a base maximum score for scaling

    # Define weights for each criterion
    weights = {
        'price': 30,
        'utilities': 10,
        'bedrooms': 15,
        'bathrooms': 10,
        'amenities': 20,
        'public_transit': 10,
        'ac': 5,
    }

    # Normalize price (closer to desired price, higher the score)
    price_difference = abs(preferences.desired_price - apartment['price_per_month'])
    max_price_difference = max(preferences.desired_price, apartment['price_per_month'])
    price_score = max(0, (1 - price_difference / max_price_difference)) * weights['price']
    score += price_score

    # Utilities check (exact match gets full weight)
    utilities_score = weights['utilities'] if apartment['utilities_included'] == preferences.utilities else 0
    score += utilities_score

    # Bedrooms check (more or equal bedrooms gets full weight)
    if apartment['num_rooms'] >= preferences.bedrooms:
        bedrooms_score = weights['bedrooms']
    else:
        bedrooms_score = (apartment['num_rooms'] / preferences.bedrooms) * weights['bedrooms']
    score += bedrooms_score

    # Bathrooms check (same as bedrooms logic)
    if apartment['num_bathrooms'] >= preferences.bathrooms:
        bathrooms_score = weights['bathrooms']
    else:
        bathrooms_score = (apartment['num_bathrooms'] / preferences.bathrooms) * weights['bathrooms']
    score += bathrooms_score

    # Amenities check (count how many desired amenities are met)
    desired_amenities = set(preferences.amenities)
    available_amenities = set(apartment['amenities'])
    matching_amenities = desired_amenities.intersection(available_amenities)
    amenities_score = (len(matching_amenities) / len(desired_amenities)) * weights['amenities'] if desired_amenities else 0
    score += amenities_score

    # Public transport (if matches user preference)
    if apartment['near_public_transport'] == preferences.public_transit:
        public_transit_score = weights['public_transit']
    else:
        public_transit_score = 0
    score += public_transit_score

    # Air conditioning check (if AC is important to the user, full score for having AC)
    if apartment['has_ac']:
        ac_score = weights['ac']
    else:
        ac_score = 0
    score += ac_score

    # Final score calculation scaled to 1-100
    return min(round(score/10, 2), max_score)


def get_apartment_details(request):
    apt_id = request.GET.get("apt_id")

    file_path = settings.BASE_DIR / 'housingapp' / 'apt_data.json'

    with open(file_path, 'r') as file:
        data = json.load(file)

    apt_search = [ apt for apt in data if int(apt['apt_id']) == int(apt_id) ]

    return JsonResponse({"status": "success", "content": apt_search[0]}, safe = False)

    


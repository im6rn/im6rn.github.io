from django.urls import path
from . import views

urlpatterns = [
    path('quiz-submit/', views.submit_quiz, name='submit_quiz'),
    path('get-listings/', views.get_apartment_listings, name='get_apartment_listings'),
    path('get-details/', views.get_apartment_details, name='get_apartment_details'),
    
]
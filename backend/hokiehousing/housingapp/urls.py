from django.urls import path
from . import views

urlpatterns = [
    path('backend/hokiehousing/housingapp/quiz-submit/', views.submit_quiz, name='submit_quiz'),
    
]
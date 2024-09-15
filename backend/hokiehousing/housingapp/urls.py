from django.urls import path
from . import views

urlpatterns = [
    path('quiz-submit/', views.submit_quiz, name='submit_quiz'),
    
]
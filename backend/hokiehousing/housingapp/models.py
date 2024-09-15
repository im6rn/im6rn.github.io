from django.db import models

# Create your models here.

class UserPreferences(models.Model):
    desired_price = models.IntegerField(default=0)
    utilities = models.BooleanField(default=False)
    bedrooms = models.IntegerField(default=1)
    bathrooms = models.IntegerField(default=1)
    amenities = models.JSONField(default=list)
    public_transit = models.BooleanField(default=False)
    


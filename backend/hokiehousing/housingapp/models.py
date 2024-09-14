from django.db import models
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class UserPreferences(models.Model):
    on_campus = models.BooleanField(null=True, blank=True)
    suite_style = models.BooleanField(default = False)
    in_suite_bath = models.BooleanField(default=False)
    desired_price = models.IntegerField()
    utilities_included = models.BooleanField(default=False)

    living_learning_community = ArrayField(models.CharField(max_length=255), default=list)

    ac = models.BooleanField(default=False)
    public_transport = models.BooleanField(default=False)

    desired_amenities = ArrayField(models.CharField(max_length=255), default=list)

    furnished = models.BooleanField(default=False)
    desired_bedrooms = models.IntegerField()
    desired_bathrooms = models.IntegerField()

    desired_distance_from_campus = models.FloatField()
    max_distance_from_campus = models.FloatField()

    importance = models.JSONField()

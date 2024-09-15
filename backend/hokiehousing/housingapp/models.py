from django.db import models

# Create your models here.

class UserPreferences(models.Model):
    on_campus = models.BooleanField(null=True, blank=True)
    suite_style = models.BooleanField(default = False)
    in_suite_bath = models.BooleanField(default=False)
    desired_price = models.IntegerField()
    utilities_included = models.BooleanField(default=False)

    living_learning_community = models.JSONField(default=list)

    ac = models.BooleanField(default=False)
    public_transport = models.BooleanField(default=False)

    desired_amenities = models.JSONField(default=list)

    furnished = models.BooleanField(default=False)
    desired_bedrooms = models.IntegerField()
    desired_bathrooms = models.IntegerField()

    desired_distance_from_campus = models.FloatField()
    max_distance_from_campus = models.FloatField()

    importance = models.JSONField()

from django.db import models

# Create your models here.
class PromotionModel(models.Model):
    name = models.CharField(max_length=100)
    item_name = models.CharField(max_length=100)
    discount_percentage = models.FloatField()
    start = models.DateTimeField()
    end = models.DateTimeField()

    def __str__(self):
        return self.name
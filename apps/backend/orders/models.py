from uuid import uuid4
from django.db import models
from django.utils.timezone import now

# Create your models here.
class OrderModel(models.Model):
    uid = models.UUIDField(default=uuid4, unique=True, editable=False)
    created = models.DateTimeField(default=now)
    paid = models.BooleanField(default=False)
    subtotal = models.FloatField(default=0.0)
    taxes = models.FloatField(default=0.0)
    discounts = models.FloatField(default=0.0)

    def __str__(self):
        return f"Order {self.uid}"
    
    @property
    def items(self):
        """Devuelve todos los RoundItems asociados con esta orden."""
        return RoundItemModel.objects.filter(round__order=self)
    
class RoundModel(models.Model):
    order = models.ForeignKey(OrderModel,related_name="rounds",on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ronda {self.id} - para la ronda {self.order.id}"
    
class RoundItemModel(models.Model):
    round = models.ForeignKey(RoundModel, related_name="items", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"P{self.quantity}*{self.name} en la ronda {self.round.id}"
    

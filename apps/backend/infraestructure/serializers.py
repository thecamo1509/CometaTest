from rest_framework import serializers

class RoundItemSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    quantity = serializers.IntegerField(min_value=1)

class OrderItemSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    price_per_unit = serializers.FloatField()
    quantity = serializers.IntegerField()
    total = serializers.FloatField()

class PromotionSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    item_name = serializers.CharField(max_length=100)
    discount_percentage = serializers.FloatField()
    start = serializers.DateTimeField()
    end = serializers.DateTimeField()
class RoundSerializer(serializers.Serializer):
    created = serializers.DateTimeField()
    items = RoundItemSerializer(many=True)
    promotions = PromotionSerializer(many=True)

class OrderSerializer(serializers.Serializer):
    uid = serializers.UUIDField()
    created = serializers.DateTimeField()
    paid = serializers.BooleanField()
    subtotal = serializers.FloatField()
    taxes = serializers.FloatField()
    discounts = serializers.FloatField()
    items = OrderItemSerializer(many=True)
    rounds = RoundSerializer(many=True)



### Este es un serializer que se usa para la API de agregar stock
class AddStockSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    quantity = serializers.IntegerField(min_value=1)

class BeerSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    price = serializers.IntegerField()
    quantity = serializers.IntegerField()

class StockSerializer(serializers.Serializer):
    beers = BeerSerializer(many=True)
    last_updated = serializers.DateTimeField()

### Estos son Modelos que representan las entidades de negocio (Las ordenes, Las rondas, Los items de la ronda, etc)

from dataclasses import dataclass, field
from datetime import datetime
from typing import List
from uuid import UUID, uuid4
from django.utils.timezone import now
from storage import Inventory

@dataclass
class OrderItem:
    name: str
    price_per_unit: float
    quantity: int
    total: float = field(init=False)

    def __post_init__(self):
        self.calculate_total()

    def calculate_total(self):
        self.total = self.price_per_unit * self.quantity

@dataclass
class RoundItem:
    name: str
    quantity: int

@dataclass
class Promotion:
    name: str
    item_name: str
    discount_percentage: float
    start: datetime
    end: datetime

    def is_active(self,current_date: datetime):
        return self.start <= current_date <= self.end
@dataclass
class Round:
    created: datetime
    items: List[RoundItem]
    promotions: List[Promotion]



@dataclass
class Order:
    created: datetime
    paid: bool
    uid: UUID = field(default_factory=uuid4)
    subtotal: float = 0.00
    taxes: float = 0.00
    discounts: float = 0.00
    items: List[OrderItem] = field(default_factory=list)
    rounds: List[Round] = field(default_factory=list)
    promotions: List[Promotion] = field(default_factory=list)

    def apply_promotions(self, promotions: List[Promotion]):
        """Aplicar descuentos a los items de la orden."""
        inventory = Inventory.get_instance()
        for round_instance in self.rounds:
            for item in round_instance.items:
                for promotion in promotions:
                    if promotion.item_name == item.name:
                        discount = item.quantity * inventory.get_price(item.name) * (promotion.discount_percentage / 100)
                        self.discounts += discount

                        # Aqui asocio la promocion vigente a la orden
                        if not any(promo.name == promotion.name and promo.item_name == promotion.item_name for promo in round_instance.promotions):
                            round_instance.promotions.append(
                                Promotion(
                                    name=promotion.name,
                                    item_name=promotion.item_name,
                                    discount_percentage=promotion.discount_percentage,
                                    start=promotion.start,
                                    end=promotion.end
                                ))

    def calculate_items(self):
        """Consolidar los items de todas las rondas en un resumen con precios."""
        consolidated_items = {}
        inventory = Inventory.get_instance()  # Obtener precios del inventario

        for round_instance in self.rounds:
            for item in round_instance.items:
                if item.name in consolidated_items:
                    consolidated_items[item.name]['quantity'] += item.quantity
                    consolidated_items[item.name]['total'] += item.quantity * inventory.get_price(item.name)
                else:
                    consolidated_items[item.name] = {
                        'name': item.name,
                        'quantity': item.quantity,
                        'price_per_unit': inventory.get_price(item.name),
                        'total': item.quantity * inventory.get_price(item.name),
                    }
        
        self.items = [
            OrderItem(
                name=item_data["name"],  # Cambiar item a item_data
                price_per_unit=item_data['price_per_unit'],  # Cambiar item a item_data
                quantity=item_data['quantity']
            )
            for item_data in consolidated_items.values()
        ]

        return self.items

    def calculate_total(self, promotions=None):
        """Calcular el subtotal, impuestos y descuentos."""
        consolidated_items = self.calculate_items()  # Esto ya devuelve una lista de objetos OrderItem
        self.subtotal = sum(
            item.quantity * Inventory.get_instance().get_price(item.name)
            for item in consolidated_items
        )
        self.taxes = self.subtotal * 0.15  # 15% de impuestos como ejemplo
        self.discounts = 0.0

        if promotions:
            for promotion in promotions:
                if promotion.is_active(now()):
                    self.discounts += self.subtotal * (promotion.discount_percentage / 100)

        return consolidated_items

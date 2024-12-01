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
class Round:
    created: datetime
    items: List[RoundItem]

@dataclass
class Promotion:
    name: str
    discount_percentage: float
    start: datetime
    end: datetime

    def is_active(self,current_date: datetime):
        return self.start <= current_date <= self.end

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
        
        return list(consolidated_items.values())

    def calculate_total(self, promotions=None):
        """Calcular el subtotal, impuestos y descuentos."""
        consolidated_items = self.calculate_items()
        self.subtotal = sum(
            item["quantity"] * Inventory.get_instance().get_price(item["name"])
            for item in consolidated_items
        )
        self.taxes = self.subtotal * 0.15  # 15% de impuestos como ejemplo
        self.discounts = 0.0

        if promotions:
            for promotion in promotions:
                if promotion.is_active(now()):
                    self.discounts += self.subtotal * (promotion.discount_percentage / 100)

        return consolidated_items

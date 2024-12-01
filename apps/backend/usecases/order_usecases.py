from uuid import UUID, uuid4
from storage import Inventory
from domain.models import Order, Round, RoundItem
from domain.repositories import OrderRepository, PromotionRepository
from typing import List, Optional
from django.utils.timezone import now

class GetOrderUseCase:
    def __init__(self, order_repository: OrderRepository):
        self.order_repository = order_repository

    def execute(self) -> Order:
        order = self.order_repository.get_order()
        if not order:
            raise Exception("No hay una orden activa")
        return order
    
class GetAllOrdersUseCase:
    def __init__(self, order_repository: OrderRepository):
        self.order_repository = order_repository

    def execute(self) -> List[Order]:
        orders = self.order_repository.get_all_orders()
        if not orders:
            raise Exception("No hay ordenes activas")
        return orders
    
class CreateOrderUseCase:
    def __init__(self, order_repo: OrderRepository, inventory: Inventory):
        self.order_repo = order_repo
        self.inventory = inventory

    def execute(self, items: List[RoundItem], uid: Optional[UUID] = None) -> Order:
        if uid:
            order = self.order_repo.get_order(uid)
            if order is None:
                raise ValueError(f"Order with UID {uid} not found.")
        else:
            order = Order(uid=uuid4(), created=now(), paid=False)

        for item in items:
            try:
                self.inventory.reduce_stock(item.name, item.quantity)
            except ValueError as e:
                raise ValueError(f"Error al procesar el inventario: {str(e)}")

        new_round = Round(created=now(), items=items)
        order.rounds.append(new_round)
        self.order_repo.save_order(order)
        return order

class AddRoundToOrderUseCase:
    def __init__(self, order_repo: OrderRepository, inventory: Inventory):
        self.order_repo = order_repo
        self.inventory = inventory

    def execute(self, uid: UUID, round_items: List[RoundItem]) -> Order:
        order = self.order_repo.get_order(uid)
        if order is None:
            raise ValueError(f"Order with UID {uid} not found.")

        # Reducir el stock por cada ítem en la nueva ronda
        for item in round_items:
            self.inventory.reduce_stock(item.name, item.quantity)

        # Crear la nueva ronda
        new_round = Round(created=now(), items=round_items)
        order.rounds.append(new_round)  # Solo se agrega la nueva ronda

        # Recalcular ítems y totales basados en todas las rondas
        order.calculate_items()
        order.calculate_total()

        self.order_repo.save_order(order)
        return order

class ApplyPromotionUseCase:
    def __init__(self, promotion_repository: PromotionRepository, order_repository: OrderRepository):
         self.promotion_repository = promotion_repository
         self.order_repository = order_repository

    def execute(self):
        order = self.order_repository.get_order()
        if not order:
            raise Exception("No hay una orden activa para aplicar una promocion")
        
        current_time = now()
        active_promotions = self.promotion_repository.get_active_promotions(current_time)
        order.calculate_total(promotions=active_promotions)
        return order
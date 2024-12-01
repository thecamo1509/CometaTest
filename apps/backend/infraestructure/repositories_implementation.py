from os import name
from typing import Optional,List
from uuid import UUID
from storage import Inventory
from domain.models import Order, RoundItem, Round, OrderItem, Promotion
from domain.repositories import OrderRepository, PromotionRepository
from promotions.models import PromotionModel
from orders.models import OrderModel, RoundModel, RoundItemModel
from datetime import datetime
from django.db import models
from django.utils.timezone import now


class DjangoOrderRepository(OrderRepository):
    def __init__(self):
        self.inventory = Inventory.get_instance()

    def get_order(self, uid:UUID) -> Optional[Order]:
        try:
            order_model = OrderModel.objects.get(uid=uid)
            return self._convert_to_domain(order_model)
        except OrderModel.DoesNotExist:
            return None
        
    def add_round(self, items: List[RoundItem], uid: Optional[UUID] = None) -> Order:
        # Verificar y reducir el stock antes de procesar los items
        for item in items:
            self.inventory.reduce_stock(item.name, item.quantity)

        if uid:
            # Modificar una orden existente
            try:
                order_model = OrderModel.objects.get(uid=uid)
            except OrderModel.DoesNotExist:
                raise Exception(f"No se encontró una orden con UID: {uid}")
        else:
            # Crear una nueva orden si no se envió un UID
            order_model, created = OrderModel.objects.get_or_create(
                paid=False,
                defaults={'created': now()}
            )
        
        # Crear una nueva ronda asociada a la orden
        round_model = RoundModel.objects.create(order=order_model, created=now())
        for item in items:
            RoundItemModel.objects.create(round=round_model, name=item.name, quantity=item.quantity)
        
        # Actualizar totales y devolver la orden
        return self._update_order_totals(order_model)
    
    def mark_as_paid(self) -> Order:
        try:
            order_model = OrderModel.objects.get(paid=False)
            order_model.paid = True
            order_model.save()
            return self._convert_to_domain(order_model)
        except OrderModel.DoesNotExist:
            raise Exception("No hay una ordern activa para marcar como pagada")
    
    def get_all_orders(self) -> List[Order]:
        try:
            orders = OrderModel.objects.all()
            return [self._convert_to_domain(order) for order in orders]
        except OrderModel.DoesNotExist:
            return []

    def _update_order_totals(self, order_model):
        items = RoundItemModel.objects.filter(round__order=order_model).values('name').annotate(
            total_quantity=models.Sum('quantity')
        )
        order = Order(
            uid=order_model.uid,
            created=order_model.created,
            paid=order_model.paid,
            items=[],
            rounds=[]
        )
        for item in items:
            price = self.inventory.get_price(item["name"])
            order_item = OrderItem(
                name=item["name"],
                price_per_unit=price,
                quantity=item["total_quantity"]
            )
            order_item.calculate_total()
            order.items.append(order_item)

        # Agregar las rondas y sus promociones
        rounds = RoundModel.objects.filter(order=order_model)
        for round_model in rounds:
            round_item_models = RoundItemModel.objects.filter(round=round_model)
            round_items = [RoundItem(name=ri.name, quantity=ri.quantity) for ri in round_item_models]

            # Obtener promociones asociadas a esta ronda
            round_promotions = PromotionModel.objects.filter(
                name__in=[ri.name for ri in round_item_models]
            ).values('name', 'item_name', 'discount_percentage', 'start', 'end')

            promotions = [
                Promotion(
                    name=promo["name"],
                    discount_percentage=promo["discount_percentage"],
                    item_name=promo["item_name"],
                    start=promo["start"],
                    end=promo["end"],
                )
                for promo in round_promotions
            ]

            # Asegurarnos de pasar las promociones (pueden ser una lista vacía)
            order.rounds.append(
                Round(
                    created=round_model.created,
                    items=round_items,
                    promotions=promotions
                )
            )

        # Calcular el total sin los descuentos
        order.calculate_total()
        return order

    def save_order(self, order: Order):
        # Convertir el dominio de Order al modelo de Django
        order_model, created = OrderModel.objects.update_or_create(
            uid=order.uid,
            defaults={
                'created': order.created,
                'paid': order.paid,
                'subtotal': order.subtotal,
                'taxes': order.taxes,
                'discounts': order.discounts,  # Guardar descuentos totales
            }
        )

        # Guardar rondas y sus ítems
        for round_instance in order.rounds:
            round_model, round_created = RoundModel.objects.get_or_create(
                order=order_model,
                created=round_instance.created
            )

            # Eliminar ítems previos asociados a esta ronda para evitar duplicación
            RoundItemModel.objects.filter(round=round_model).delete()

            # Crear nuevos ítems para esta ronda
            for item in round_instance.items:
                RoundItemModel.objects.create(
                    round=round_model,
                    name=item.name,
                    quantity=item.quantity
                )

            for promotion in round_instance.promotions:
                PromotionModel.objects.update_or_create(
                    name=promotion.name,
                    defaults={
                        'item_name': promotion.item_name,
                        'discount_percentage': promotion.discount_percentage,
                        'start': promotion.start,
                        'end': promotion.end
                    }
                )

        # Guardar el modelo de orden (aunque no es estrictamente necesario después de update_or_create)
        order_model.save()

    def _convert_to_domain(self, order_model) -> Order:
        items = RoundItemModel.objects.filter(round__order=order_model).values('name').annotate(
            total_quantity=models.Sum('quantity')
        )
        order = Order(
            uid=order_model.uid,
            created=order_model.created,
            paid=order_model.paid,
            items=[],
            rounds=[],
            subtotal=order_model.subtotal,
            taxes=order_model.taxes,
            discounts=order_model.discounts  # Recuperar descuentos totales
        )
        for item in items:
            price = self.inventory.get_price(item["name"])
            order_item = OrderItem(
                name=item["name"],
                price_per_unit=price,
                quantity=item["total_quantity"]
            )
            order_item.calculate_total()
            order.items.append(order_item)

        # Recuperar rondas y sus promociones
        rounds = RoundModel.objects.filter(order=order_model)
        for round_model in rounds:
            round_item_models = RoundItemModel.objects.filter(round=round_model)
            round_items = [RoundItem(name=ri.name, quantity=ri.quantity) for ri in round_item_models]

            # Recuperar promociones asociadas a los ítems de esta ronda
            promotions = []
            for round_item in round_item_models:
                item_promotions = PromotionModel.objects.filter(
                    item_name=round_item.name,
                    start__lte=round_model.created,
                    end__gte=round_model.created
                )
                promotions.extend([
                    Promotion(
                        name=promo.name,
                        discount_percentage=promo.discount_percentage,
                        item_name=promo.item_name,
                        start=promo.start,
                        end=promo.end
                    )
                    for promo in item_promotions
                ])

            # Crear la ronda con las promociones asociadas
            order.rounds.append(
                Round(
                    created=round_model.created,
                    items=round_items,
                    promotions=promotions  # Asociar las promociones correctamente
                )
            )

        return order

class DjangoPromotionRepository(PromotionRepository):
    def get_active_promotions(self,current_time:datetime) -> List[Promotion]:
        promos = PromotionModel.objects.filter(start__lte=current_time,end__gte=current_time)
        promosList = []
        for promo in promos:
            promosList.append(Promotion(
                name=promo.name,
                item_name=promo.item_name,
                discount_percentage=promo.discount_percentage,
                start=promo.start,
                end=promo.end
            ))
        return promosList
    
    def add_promotion(self, promotion: Promotion) -> None:
        PromotionModel.objects.create(
            name=promotion.name,
            item_name=promotion.item_name,
            discount_percentage=promotion.discount_percentage,
            start=promotion.start,
            end=promotion.end
        )
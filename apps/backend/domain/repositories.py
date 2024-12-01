from abc import ABC, abstractmethod
from datetime import datetime
from typing import Optional, List
from uuid import UUID
from domain.models import Order, RoundItem, Promotion

class OrderRepository(ABC):
    @abstractmethod
    def get_order(self, uid:UUID) -> Optional[Order]:
        pass

    @abstractmethod
    def get_all_orders(self) -> List[Order]:
        pass

    @abstractmethod
    def add_round(self, items:List[RoundItem], order_uid:UUID) -> Order:
        pass

    @abstractmethod
    def mark_as_paid(self, uid:UUID) -> Order:
        pass

    @abstractmethod
    def save_order(self, order:Order) -> None:
        pass

class PromotionRepository(ABC):
    @abstractmethod
    def get_active_promotions(self,current_time:datetime) -> List[Promotion]:
        pass

    @abstractmethod
    def add_promotion(self, promotion: Promotion) -> None:
        pass


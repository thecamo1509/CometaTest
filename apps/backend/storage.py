from datetime import datetime
from threading import Lock
from django.utils.timezone import now
import copy

class Inventory:
    _instance = None
    _lock = Lock()

    def __init__(self):
        # Aqui inicializo la instancia de la clase que nos va a servir como un singleton (base de datos global)
        self.data = {
            "last_updated": "2024-09-10 12:00:00",
            "beers": [
                {
                    "name": "Corona",
                    "price": 115,
                    "quantity": 2
                },
                {
                    "name": "Quilmes",
                    "price": 120,
                    "quantity": 0
                },
                {
                    "name": "Club Colombia",
                    "price": 110,
                    "quantity": 3
                }
            ]
        }

    @classmethod
    def get_instance(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = cls()
            return cls._instance
        
    def _update_timestamp(self):
        self.data["last_updated"] = now().strftime("%Y-%m-%d %H:%M:%S")


    def get_price(self, name):
        beer = self._find_beer(name)
        if beer:
            return beer["price"]
        else:
            raise ValueError(f"No tenemos una cerveza llamada {name}")
        
    def get_quantity(self, name):
        beer = self._find_beer(name)
        if beer:
            return beer["quantity"]
        else:
            raise ValueError(f"No nos quedan cervezas disponibles para {name}")
        
    def reduce_stock(self, name,quantity):
        beer = self._find_beer(name)
        if beer:
            if beer["quantity"] >= quantity:
                beer["quantity"] -= quantity
                self._update_timestamp()
            else:
                raise ValueError(f"No tenemos suficiente {name} para reducir el stock")
        else:
            raise ValueError(f"No tenemos una cerveza llamada {name}")
        
    def add_stock(self, name,quantity):
        beer = self._find_beer(name)
        if beer:
            beer["quantity"] += quantity
            self._update_timestamp()
        else:
            raise ValueError(f"No tenemos una cerveza llamada {name}")
        
    def _find_beer(self, name):
        for beer in self.data["beers"]:
            if beer["name"] == name:
                return beer
        return None
    
    def get_inventory_snapshot(self):
        return copy.deepcopy(self.data)
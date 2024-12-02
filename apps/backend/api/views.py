from ast import List
from uuid import UUID
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from storage import Inventory
from domain.models import RoundItem, Order
from usecases.order_usecases import AddRoundToOrderUseCase, GetAllOrdersUseCase, GetOrderUseCase, CreateOrderUseCase, ApplyPromotionUseCase
from domain.repositories import OrderRepository, PromotionRepository
from infraestructure.repositories_implementation import DjangoOrderRepository, DjangoPromotionRepository
from infraestructure.serializers import AddStockSerializer, OrderSerializer, RoundItemSerializer, PromotionSerializer, StockSerializer
from promotions.models import PromotionModel
from datetime import datetime
from django.utils.timezone import now


class OrderView(APIView):
    def get(self,request, uid=None):
        order_repo:OrderRepository = DjangoOrderRepository()
        try:
            get_all_orders = GetAllOrdersUseCase(order_repo)
            orders: List[Order] = get_all_orders.execute()
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def post(self,request):
        # Verifico que el contenido sea correcto
        if not isinstance(request.data,list):
            return Response({
                "error":"El contenido del request debe ser una lista de Rondas",
                "status":status.HTTP_400_BAD_REQUEST
            })

        serializer = RoundItemSerializer(data=request.data, many=True)
        if serializer.is_valid():
            items = serializer.validated_data
            order_repo: OrderRepository = DjangoOrderRepository()
            inventory: Inventory = Inventory.get_instance()
            promo_repo: PromotionRepository = DjangoPromotionRepository()
            create_order = CreateOrderUseCase(order_repo, inventory=inventory, promo_repo=promo_repo)
            try:
                # Creo una nueva ronda y la agrego a la orden
                round_items = [RoundItem(**item) for item in items]
                order = create_order.execute(round_items)
                print("Order",order.__dict__)
                order_serializer = OrderSerializer(order)
                return Response(order_serializer.data, status=status.HTTP_201_CREATED)
            except ValueError as ve:
                return Response({"error":str(ve)},status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderByIdView(APIView):
    def get(self, request, uid):
        order_repo = DjangoOrderRepository()
        order = order_repo.get_order(uid=uid)
        if order is None:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
class AddRoundView(APIView):
    def post(self, request, uid):
        # Validar el contenido del payload
        if not isinstance(request.data, list):
            return Response({
                "error": "El contenido del request debe ser una lista de items.",
                "status": status.HTTP_400_BAD_REQUEST
            })

        serializer = RoundItemSerializer(data=request.data, many=True)
        if serializer.is_valid():
            items = serializer.validated_data
            order_repo: OrderRepository = DjangoOrderRepository()
            inventory: Inventory = Inventory.get_instance()
            promo_repo: PromotionRepository = DjangoPromotionRepository()
            add_round = AddRoundToOrderUseCase(order_repo, inventory, promo_repo)

            try:
                round_items = [RoundItem(**item) for item in items]

                updated_order = add_round.execute(uid=uid, round_items=round_items)

                order_serializer = OrderSerializer(updated_order)
                return Response(order_serializer.data, status=status.HTTP_200_OK)
            except ValueError as ve:
                return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PayOrderView(APIView):
    def post(self, request):
        order_repo: OrderRepository = DjangoOrderRepository()
        order_id = request.data.get("orderId") 

        if not order_id:
            return Response(
                {"error": "El campo 'orderId' es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Marcar la orden como pagada
            order = order_repo.mark_as_paid(order_id)
            order_serializer = OrderSerializer(order)
            return Response(order_serializer.data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PromotionView(APIView):
    def get(self,request):
        promotion_repo: PromotionRepository = DjangoPromotionRepository()
        current_time = now()
        active_promotions = promotion_repo.get_active_promotions(current_time)
        serializer = PromotionSerializer(active_promotions,many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = PromotionSerializer(data=request.data)
        if serializer.is_valid():
            promotion_repo: PromotionRepository = DjangoPromotionRepository()
            promotion_data = serializer.validated_data
            item_name = promotion_data['item_name']
            new_start = promotion_data['start']
            new_end = promotion_data['end']

            # Validar superposición con promociones existentes
            overlapping_promotions = PromotionModel.objects.filter(
                item_name=item_name,
                start__lte=new_end,
                end__gte=new_start
            )
            if overlapping_promotions.exists():
                return Response(
                    {"error": f"Ya hay un promo vigente para {item_name} en este periodo"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Crear la promoción si no hay conflictos
            promotion = PromotionModel(**promotion_data)
            try:
                promotion_repo.add_promotion(promotion)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AddStockView(APIView):
    def post(self,request):
        serializer = AddStockSerializer(data=request.data)
        if serializer.is_valid():
            stock_data = serializer.validated_data
            name = stock_data["name"]
            quantity = stock_data["quantity"]
            inventory = Inventory.get_instance()
            try:
                inventory.add_stock(name,quantity)
                return Response({"details":f"Stock actualizado para {name} con {quantity} unidades"},status=status.HTTP_200_OK)
            except ValueError as ve:
                return Response({"error":str(ve)},status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class GetStockView(APIView):
    def get(self,request):
        inventory = Inventory.get_instance()
        try:
            stock = inventory.get_inventory_snapshot()
            serializer = StockSerializer(stock)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
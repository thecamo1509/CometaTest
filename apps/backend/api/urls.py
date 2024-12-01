from django.urls import path
from .views import OrderView, PayOrderView, PromotionView, AddStockView, GetStockView, AddRoundView

urlpatterns = [
    path('order', OrderView.as_view()),
    path('order/<uuid:uid>/add-round', AddRoundView.as_view()),
    path('order/pay', PayOrderView.as_view()),
    path('promotions', PromotionView.as_view()),
    path('inventory/add', AddStockView.as_view()),
    path('inventory', GetStockView.as_view())
]

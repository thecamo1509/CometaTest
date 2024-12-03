import { OrderApiError, OrderPayload } from "@/adapters/backendApi/OrderApiAdapter.types";
import { Order, RoundItem } from "@/core/entities/Order";

export interface IOrderRepository {

    // Obtener todos las ordenes
    getOrders(): Promise<Order[]>;

    // Crear una orden
    createOrder(order: OrderPayload): Promise<Order | OrderApiError>;

    // Obtener una orden
    getOrder(id: string): Promise<Order>;

    // Agregar una ronda a una orden
    addRound(orderId:string, items: RoundItem[]): Promise<Order | OrderApiError>;

    // Marcar una orden como pagada
    markAsPaid(orderId: string): Promise<Order >;
}
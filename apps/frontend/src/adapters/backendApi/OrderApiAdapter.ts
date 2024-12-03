
import { IOrderRepository } from "@/core/interfaces/repositories/IOrderRepository";
import { OrderApi, OrderApiError, OrderPayload } from "./OrderApiAdapter.types";
import { Order, RoundItem } from "@/core/entities/Order";

export class OrderApiAdapter implements IOrderRepository {
    private readonly apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    async getOrders():Promise<Order[]> {
        const response = await fetch(`${this.apiBaseUrl}/api/order`)
        if(!response.ok){
            throw new Error('Error fetching orders',)
        }
        const data = await response.json()
        return data.map((item: OrderApi) => this.mapToOrder(item));

    }

    async createOrder(order: OrderPayload): Promise<Order | OrderApiError> {
        try {
            const url = this.apiBaseUrl;
    
            const payload = [order]

            const response = await fetch(`${url}/api/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const result = await response.json();
            const status = await response.status
            if (status === 201) {
                return this.mapToOrder(result);
            }
    
            return {
                status: result.status,
                error: result.error,
            };
        } catch (error) {
            return {
                status: 500,
                error: `Error en createOrder: ${(error as Error).message}`,
            };
        }
    }

    async getOrder(id: string): Promise<Order> {
        const response = await fetch(`${this.apiBaseUrl}/api/order/${id}`)
        if(!response.ok){
            throw new Error('Error fetching order')
        }
        const data = await response.json()
        return this.mapToOrder(data);
    }

    async addRound(orderId:string, items: RoundItem[]): Promise<Order> {
        const response = await fetch(`${this.apiBaseUrl}/api/order/${orderId}/add-round`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(items)
        })
        if(!response.ok){
            throw new Error('Error adding round')
        }
        const data = await response.json()
        return this.mapToOrder(data);
    }

    async markAsPaid(orderId: string): Promise<Order> {
        const response = await fetch(`${this.apiBaseUrl}/api/order/pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"orderId":orderId})
        })
        if(!response.ok){
            throw new Error('Error marking order as paid')
        }
        const data = await response.json()
        return this.mapToOrder(data);
    }


    private mapToOrder(data: OrderApi): Order {
        return {
            uid: data.uid,
            created: new Date(data.created),
            paid: data.paid,
            subtotal: data.subtotal,
            taxes: data.taxes,
            discounts: data.discounts,
            items: data.items.map((item) => ({
                name: item.name,
                pricePerUnit: item.price_per_unit, 
                quantity: item.quantity,
                total: item.total,
            })),
            rounds: data.rounds.map((round) => ({
                created: new Date(round.created),
                items: round.items.map((roundItem) => ({
                    name: roundItem.name,
                    quantity: roundItem.quantity,
                })),
                promotions: round.promotions.map((promotion) => ({
                    name: promotion.name,
                    itemName: promotion.item_name, 
                    discountPercentage: promotion.discount_percentage,
                    start: new Date(promotion.start),
                    end: new Date(promotion.end),
                })),
            })),
        };
    }
}
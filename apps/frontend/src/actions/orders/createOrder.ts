import { OrderApiAdapter } from "@/adapters/backendApi/OrderApiAdapter"
import { Order } from "@/core/entities/Order"

export async function createOrder(order:any){
    const orderAdapter = new OrderApiAdapter()
    return await orderAdapter.createOrder(order)
}
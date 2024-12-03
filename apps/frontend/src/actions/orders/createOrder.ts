import { OrderApiAdapter } from "@/adapters/backendApi/OrderApiAdapter"
import { OrderPayload } from "@/adapters/backendApi/OrderApiAdapter.types"

export async function createOrder(order:OrderPayload){
    const orderAdapter = new OrderApiAdapter()
    const result = await orderAdapter.createOrder(order)
    return result
}
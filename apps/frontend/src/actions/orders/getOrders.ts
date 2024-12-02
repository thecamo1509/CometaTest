"use server"

import { OrderApiAdapter } from "@/adapters/backendApi/OrderApiAdapter"

export async function getOrders(){
    const orderAdapter = new OrderApiAdapter()
    return await orderAdapter.getOrders()
}
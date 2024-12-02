"use server"

import { OrderApiAdapter } from "@/adapters/backendApi/OrderApiAdapter"

export async function getOrderById(uid: string){
    const orderAdapter = new OrderApiAdapter()
    return await orderAdapter.getOrder(uid)
}
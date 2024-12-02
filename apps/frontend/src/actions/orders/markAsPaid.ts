"use server"

import { OrderApiAdapter } from "@/adapters/backendApi/OrderApiAdapter"
import { revalidatePath } from "next/cache"

export async function markAsPaid(orderId: string){
    const orderAdapter = new OrderApiAdapter()
    const result = await orderAdapter.markAsPaid(orderId)
    revalidatePath(`/clients/order/${orderId}`)
    return result
}
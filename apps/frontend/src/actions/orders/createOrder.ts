"use server"
import { OrderApiAdapter } from "@/adapters/backendApi/OrderApiAdapter"
import { OrderPayload } from "@/adapters/backendApi/OrderApiAdapter.types"
import { revalidatePath } from "next/cache"

export async function createOrder(order:OrderPayload){
    const orderAdapter = new OrderApiAdapter()
    const result = await orderAdapter.createOrder(order)
    revalidatePath('/manager')
    return result
}
"use server"
import { OrderApiAdapter } from "@/adapters/backendApi/OrderApiAdapter"
import { RoundItem } from "@/core/entities/Order"
import { revalidatePath } from "next/cache"

export async function addRoundToOrder(orderId:string, items: Array<RoundItem>){
    const orderAdapter = new OrderApiAdapter()
    const result = await orderAdapter.addRound(orderId, items)
    console.log("RESULT", result)
    revalidatePath(`/clients/order/${orderId}`)
    return result
}
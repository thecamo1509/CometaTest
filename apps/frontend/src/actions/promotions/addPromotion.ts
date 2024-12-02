"use server"

import { PromotionApiAdapter } from "@/adapters/backendApi/PromotionApiAdapter"
import { AddPromotionPayload } from "@/adapters/backendApi/PromotionApiAdapter.types"
import { revalidatePath } from "next/cache"

export async function addPromotion(data:AddPromotionPayload){
    const promotionAdapter = new PromotionApiAdapter()
    const result = await promotionAdapter.addPromotion(data)
    revalidatePath('/manager')
    return result
}
"use server"

import { PromotionApiAdapter } from "@/adapters/backendApi/PromotionApiAdapter"
import { AddPromotionPayload } from "@/adapters/backendApi/PromotionApiAdapter.types"

export async function addPromotion(data:AddPromotionPayload){
    const promotionAdapter = new PromotionApiAdapter()
    const result = await promotionAdapter.addPromotion(data)
    return result
}
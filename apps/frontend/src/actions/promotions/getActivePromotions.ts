"use server"
import { PromotionApiAdapter } from "@/adapters/backendApi/PromotionApiAdapter"

export async function getActivePromotions(){
    const promotionAdapter = new PromotionApiAdapter()
    return await promotionAdapter.getActivePromotions()
}
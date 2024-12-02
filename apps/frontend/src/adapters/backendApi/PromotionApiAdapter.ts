import { Promotion } from "@/core/entities/Order";
import { IPromotionRepository } from "@/core/interfaces/repositories/IPromotionRepository";
import { AddPromotionPayload, PromotionResponse } from "./PromotionApiAdapter.types";
import { revalidatePath } from "next/cache";

export class PromotionApiAdapter implements IPromotionRepository {
    private readonly apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

    async getActivePromotions(): Promise<Array<Promotion>> {
        const response = await fetch(`${this.apiBaseUrl}/api/promotions`)
        if(!response.ok){
            throw new Error('Error fetching promotions')
        }
        const data = await response.json()
        revalidatePath('/manager')
        return this.mapToPromotions(data);
    }

    async addPromotion(payload: AddPromotionPayload): Promise<Promotion> {
        const response = await fetch(`${this.apiBaseUrl}/api/promotions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        const result = await response.json()
        if("error" in result){
            return result
        }
        return this.mapToPromotion(result);
    }

    private mapToPromotions(data: Array<PromotionResponse>): Array<Promotion> {
        return data.map((promotion) => ({
            name:promotion.name,
            itemName: promotion.item_name,
            discountPercentage: promotion.discount_percentage,
            start: new Date(promotion.start),
            end: new Date(promotion.end)
        }))
    }

    private mapToPromotion(data: PromotionResponse): Promotion {
        return {
            name:data.name,
            itemName: data.item_name,
            discountPercentage: data.discount_percentage,
            start: new Date(data.start),
            end: new Date(data.end)
        }
    }
}
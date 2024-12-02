import { Promotion } from "@/core/entities/Order";

export interface IPromotionRepository {
    getActivePromotions(): Promise<Array<Promotion>>
}
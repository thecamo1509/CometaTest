import { Beer } from "@/core/entities/Stock";

export interface AddStockPayload {
    name: string,
    quantity: number
}

export interface StockResponse {
    beers: Beer[];
    last_updated: string;
}
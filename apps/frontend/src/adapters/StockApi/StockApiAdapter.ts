import { Stock } from "@/core/entities/Stock";
import { IStockRepository } from "@/core/interfaces/repositories/IStockRepository";
import { AddStockPayload, StockResponse } from "./StockApiAdapter.types";
import {  parse } from "date-fns";

export class StockApiAdapter implements IStockRepository {
    private readonly apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    
    async getStock(): Promise<Stock> {
        const response = await fetch(`${this.apiBaseUrl}/api/inventory`)
        if(!response.ok){
            throw new Error('Error fetching stock')
        }
        const data = await response.json()
        return this.mapToStock(data);
    }

    async addStock(payload: AddStockPayload): Promise<Stock> {
        const response = await fetch(`${this.apiBaseUrl}/api/inventory/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })
        if(!response.ok){
            throw new Error('Error adding stock')
        }
        const data = await response.json()
        return data;
    }

    private mapToStock(data: StockResponse): Stock {
        const formattedDate = parse(data.last_updated,"yyyy-MM-dd HH:mm:ss", new Date())
        return {
            beers: data.beers.map((beer) => ({
                name: beer.name,
                quantity: beer.quantity,
                price: beer.price
            })),
            lastUpdated: formattedDate
        }
    }
}
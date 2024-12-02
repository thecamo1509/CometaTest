import { AddStockPayload } from "@/adapters/StockApi/StockApiAdapter.types";
import { Stock } from "@/core/entities/Stock";

export interface IStockRepository {
    getStock(): Promise<Stock>

    addStock(payload: AddStockPayload): Promise<Stock>
}
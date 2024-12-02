import { StockApiAdapter } from "@/adapters/StockApi/StockApiAdapter"

export async function getStock(){
    const stockAdapter = new StockApiAdapter()
    return await stockAdapter.getStock()
}
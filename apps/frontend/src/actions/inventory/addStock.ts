"use server"
import { StockApiAdapter } from "@/adapters/StockApi/StockApiAdapter";
import { AddStockPayload } from "@/adapters/StockApi/StockApiAdapter.types";
import { revalidatePath } from "next/cache";

export async function addStock(data:AddStockPayload){
    const stockAdapter = new StockApiAdapter()
    const result = await stockAdapter.addStock(data)
    revalidatePath('/manager')
    return result
}
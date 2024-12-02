export interface OrderApi {
    uid: string
    created: string
    paid: boolean
    subtotal: number
    taxes: number
    discounts: number
    items: ItemApi[]
    rounds: RoundApi[]
  }
  
  export interface ItemApi {
    name: string
    price_per_unit: number
    quantity: number
    total: number
  }
  
  export interface RoundApi {
    created: string
    items: RoundItemApi[]
    promotions: PromotionApi[]
  }
  
  export interface RoundItemApi {
    name: string
    quantity: number
  }
  
  export interface PromotionApi {
    name: string
    item_name: string
    discount_percentage: number
    start: string
    end: string
  }
  
  export interface OrderPayload {
    name: string
    quantity: number
  }

  export interface OrderApiError {
    error: string,
    status: number
  }
export interface PromotionResponse {
    name: string
    item_name: string
    discount_percentage: number
    start: string
    end: string
  }


  export interface AddPromotionPayload {
    name: string
    item_name: string
    discount_percentage: number
    start: string
    end: string
  }
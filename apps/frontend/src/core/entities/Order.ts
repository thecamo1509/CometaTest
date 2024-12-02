export interface OrderItem{
    name: string;
    pricePerUnit: number;
    quantity: number;
    total: number;
}

export interface RoundItem{
    name: string;
    quantity: number;
}


export interface Round{
    created: Date,
    items: RoundItem[],
    promotions: Promotion[]
}

export interface Promotion{
    name: string,
    itemName: string,
    discountPercentage: number,
    start: Date,
    end: Date
}

export interface Order{
    uid: string,
    created: Date,
    paid: boolean,
    subtotal: number,
    taxes: number,
    discounts: number,
    items: OrderItem[]
    rounds: Round[]

}
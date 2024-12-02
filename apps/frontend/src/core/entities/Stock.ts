export interface Beer{
    name: string,
    quantity: number
    price: number
}

export interface Stock{
    beers: Beer[]
    lastUpdated: Date;
}
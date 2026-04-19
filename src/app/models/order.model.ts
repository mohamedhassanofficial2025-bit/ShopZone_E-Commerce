export interface Order{
    id?: number,
    userId: number,
    total: number,
    status: 'pending' | 'processing' | 'delivered' | 'cancelled',
    date: Date,
    items: OrderItem[]
}

export interface OrderItem{
    productId?: number,
    name: string,
    quantity: number,
    price: number,
}
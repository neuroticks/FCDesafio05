export interface PlaceOrderUseCaseInputDto{
    clientId: string
    products: {
        productId: string
    }[]
}

export interface PlaceOrderUseCaseOutputDto{
    id: string
    invoiceId: string
    status: string
    total: number
    products: {
        productId: string
    }[]
}
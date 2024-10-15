export interface AddProductFacadeInputDto {
    id?: string;
    name: string;
    description: string;
    purchasePrice: number;
    salesPrice?: number;
    stock: number;
}

export interface CheckStockFacadeInputDto {
    productId: string;
}

export interface CheckStockFacadeOutputDto {
    productId: string;
    stock: number;
}

export interface SalesPriceFacadeInputDTO {
    id: string;
    salesPrice: number;
}

export interface SalesPriceFacadeOutputDTO {
    id: string;
    name: string;
    description: string;
    purchasePrice: number;
    salesPrice: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export default interface ProductAdmFacadeInterface {
    addProduct(input: AddProductFacadeInputDto): Promise<void>;
    checkStock(
        input: CheckStockFacadeInputDto
    ): Promise<CheckStockFacadeOutputDto>;
    salesPrice(input: SalesPriceFacadeInputDTO): Promise<SalesPriceFacadeOutputDTO>
}

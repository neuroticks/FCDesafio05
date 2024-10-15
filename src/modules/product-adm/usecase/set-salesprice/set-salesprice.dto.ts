export interface SalesPriceInputDto {
  id: string;
  salesPrice: number;
}

export interface SalesPriceOutputDto {
  id: string;
  name: string;
  description: string;
  purchasePrice: number;
  salesPrice: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

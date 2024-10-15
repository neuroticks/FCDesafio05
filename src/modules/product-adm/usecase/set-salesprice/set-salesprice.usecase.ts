import ProductGateway from "../../gateway/product.gateway";
import { SalesPriceInputDto, SalesPriceOutputDto } from "./set-salesprice.dto";

export default class SalesPriceUseCase {
    private _productRepository: ProductGateway;

    constructor(_productRepository: ProductGateway) {
        this._productRepository = _productRepository;
    }

    async execute(input: SalesPriceInputDto): Promise<SalesPriceOutputDto> {
        const props = {
            id: input.id,
            salesPrice: input.salesPrice,
        };

        const l_product = await this._productRepository.find(props.id);

        l_product.salesPrice = props.salesPrice

        const l_updatedProduct = await this._productRepository.update(l_product)
        
        return {
            id: l_updatedProduct.id.id,
            name: l_updatedProduct.name,
            description: l_updatedProduct.description,
            purchasePrice: l_updatedProduct.purchasePrice,
            salesPrice: l_updatedProduct.salesPrice,
            stock: l_updatedProduct.stock,
            createdAt: l_updatedProduct.createdAt,
            updatedAt: l_updatedProduct.updatedAt,
        };
    }
}

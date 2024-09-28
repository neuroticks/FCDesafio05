import ProductAdmFacade from "../facade/product-adm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";

export default class ProductAdmFacadeFactory{
    static create(){
        const l_productRepository = new ProductRepository
        const l_addProductUseCase = new AddProductUseCase(l_productRepository)
        const l_productFacade = new ProductAdmFacade({addUseCase: l_addProductUseCase, stockUseCase: undefined})

        return l_productFacade
    }
}
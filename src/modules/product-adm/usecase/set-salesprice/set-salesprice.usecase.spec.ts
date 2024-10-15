import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import AddProductUseCase from "../add-product/add-product.usecase";
import SalesPriceUseCase from "./set-salesprice.usecase";

const l_inputProduct = new Product({
  id: new Id("1"),
  name: "Product",
  description: "Product description",
  purchasePrice: 100,
  stock: 10,
});

const l_updatedProduct = new Product({
  id: l_inputProduct.id,
  name: l_inputProduct.name,
  description: l_inputProduct.description,
  purchasePrice: l_inputProduct.purchasePrice,
  salesPrice: 15,
  stock: l_inputProduct.stock,
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(l_inputProduct)),
    update: jest.fn().mockReturnValue(Promise.resolve(l_updatedProduct)),
  };
};

describe("Set SalesPrice usecase unit test", () => {
  it("should set sales price for an existing product", async () => {
    const productRepository = MockRepository();
    const l_setSalesPriceUseCase = new SalesPriceUseCase(productRepository)

    const l_updateInput = {
      id: l_inputProduct.id.id,
      salesPrice: 15
    }
    const l_updateResult = await l_setSalesPriceUseCase.execute(l_updateInput)

    expect(productRepository.find).toHaveBeenCalled();
    expect(l_updateResult.id).toBe(l_updateInput.id);
    expect(l_updateResult.salesPrice).toBe(l_updateInput.salesPrice);
  });

});

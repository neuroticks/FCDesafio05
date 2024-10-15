import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import { ProductModel } from "./product.model";

export default class ProductRepository implements ProductGateway {
  async add(product: Product): Promise<void> {
    await ProductModel.create({
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      salesPrice: product.salesPrice || 0,
      stock: product.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async find(id: string): Promise<Product> {
    const product = await ProductModel.findOne({
      where: { id },
    });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      salesPrice: product.salesPrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  async update(par_product: Product): Promise<Product> {

    const result = await ProductModel.update({ salesPrice: par_product.salesPrice }, { where: { id: par_product.id.id } })
    
    return new Product({
      id: par_product.id,
      name: par_product.name,
      description: par_product.description,
      purchasePrice: par_product.purchasePrice,
      salesPrice: par_product.salesPrice,
      stock: par_product.stock,
      createdAt: par_product.createdAt,
      updatedAt: par_product.updatedAt,
    });
  }
}

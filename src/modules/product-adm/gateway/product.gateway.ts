import Product from "../domain/product.entity";

export default interface ProductGateway {
  add(product: Product): Promise<void>;
  find(id: string): Promise<Product>;
  update(par_product: Product): Promise<Product>;
}

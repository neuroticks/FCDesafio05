import { Sequelize } from "sequelize-typescript";
import ProductModel from "../repository/product.model";
import StoreCatalogFacadeFactory from "../factory/factory.facade";

describe("StoreCatalogFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a product", async () => {
    const facade = StoreCatalogFacadeFactory.create();
    await ProductModel.create({
      id: "101",
      name: "Product 101",
      description: "Description 101",
      salesPrice: 100,
    });

    const result = await facade.find({ id: "101" });

    expect(result.id).toBe("101");
    expect(result.name).toBe("Product 101");
    expect(result.description).toBe("Description 101");
    expect(result.salesPrice).toBe(100);
  });

  it("should find all products", async () => {
    const facade = StoreCatalogFacadeFactory.create();
    await ProductModel.create({
      id: "101",
      name: "Product 101",
      description: "Description 101",
      salesPrice: 100,
    });
    await ProductModel.create({
      id: "202",
      name: "Product 202",
      description: "Description 202",
      salesPrice: 200,
    });

    const result = await facade.findAll();

    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe("101");
    expect(result.products[0].name).toBe("Product 101");
    expect(result.products[0].description).toBe("Description 101");
    expect(result.products[0].salesPrice).toBe(100);
    expect(result.products[1].id).toBe("202");
    expect(result.products[1].name).toBe("Product 202");
    expect(result.products[1].description).toBe("Description 202");
    expect(result.products[1].salesPrice).toBe(200);
  });
});

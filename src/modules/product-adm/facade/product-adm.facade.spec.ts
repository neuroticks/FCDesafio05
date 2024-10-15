import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../repository/product.model";
import ProductAdmFacadeFactory from "../factory/facade.factory";

describe("ProductAdmFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const l_productFacade = ProductAdmFacadeFactory.create()

        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 10,
            stock: 10,
        };

        await l_productFacade.addProduct(input);

        const product = await ProductModel.findOne({ where: { id: "1" } });
        expect(product).toBeDefined();
        expect(product.id).toBe(input.id);
        expect(product.name).toBe(input.name);
        expect(product.description).toBe(input.description);
        expect(product.purchasePrice).toBe(input.purchasePrice);
        expect(product.stock).toBe(input.stock);
    });

    it("should check product stock", async () => {
        const productFacade = ProductAdmFacadeFactory.create()

        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 10,
            stock: 10,
        }

        await productFacade.addProduct(input)

        const result = await productFacade.checkStock({ productId: "1" })

        expect(result.productId).toBe(input.id)
        expect(result.stock).toBe(input.stock)
    });

    it("should update sales price of an existing product", async () => {
        const productFacade = ProductAdmFacadeFactory.create()

        const input = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 10,
            stock: 10,
        }

        await productFacade.addProduct(input)

        const l_updateInput = {
            id: input.id,
            salesPrice: 19
        }
        const l_updatedProduct = await productFacade.salesPrice(l_updateInput)

        expect(l_updatedProduct.id).toBe(l_updateInput.id)
        expect(l_updatedProduct.salesPrice).toBe(l_updateInput.salesPrice)
    });
});

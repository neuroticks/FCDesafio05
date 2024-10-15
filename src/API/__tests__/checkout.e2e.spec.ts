import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for checkout", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a checkout", async () => {

    // Customer create
    const customerCreateResponse = await request(app)
      .post("/customer")
      .send({
        name: 'John Doe',
        email: 'john.doe@email.com',
        document: '111.222.333-44',
        address: {
          street: 'Main St',
          number: '00',
          complement: 'apt 11',
          city: 'New York',
          state: 'NY',
          zipCode: '10011',
        },
      });
    expect(customerCreateResponse.status).toBe(200);
    expect(customerCreateResponse.body.id).toBeDefined();
    expect(customerCreateResponse.body.name).toBe("John Doe");
    expect(customerCreateResponse.body.address._street).toBe("Main St");
    expect(customerCreateResponse.body.address._zipCode).toBe("10011");

    // Add Product One
    const productOneAddResponse = await request(app)
      .post("/product")
      .send({
        name: 'Produto Uno',
        description: 'Produto um para teste',
        purchasePrice: 11,
        salesPrice: 17,
        stock: 1,
      });
    expect(productOneAddResponse.status).toBe(200);
    expect(productOneAddResponse.body.name).toBe("Produto Uno");
    expect(productOneAddResponse.body.purchasePrice).toBe(11);
    // Add Product Two
    const productTwoAddResponse = await request(app)
      .post("/product")
      .send({
        name: 'Produto Due',
        description: 'Produto dois para teste',
        purchasePrice: 22,
        salesPrice: 33,
        stock: 2,
      });
    expect(productTwoAddResponse.status).toBe(200);
    expect(productTwoAddResponse.body.name).toBe("Produto Due");
    expect(productTwoAddResponse.body.purchasePrice).toBe(22);
    expect(productTwoAddResponse.body.salesPrice).toBe(33);

    // Checkout purchase
    const checkoutResponse = await request(app)
      .post("/shop")
      .send({
        clientId: customerCreateResponse.body.id,
        products: [
          { productId: productOneAddResponse.body.id },
          { productId: productTwoAddResponse.body.id }
        ]
      });
    expect(checkoutResponse.status).toBe(200);
    expect(checkoutResponse.body.invoiceId).toBeDefined();
    expect(checkoutResponse.body.total).toBe(50);

  });
});

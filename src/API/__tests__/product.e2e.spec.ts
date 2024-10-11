import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for Product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should add a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: 'Produto Uno',
        description: 'Produto um para teste',
        purchasePrice: 11,
        stock: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Produto Uno");
    expect(response.body.purchasePrice).toBe(11);
  });
});

import { Sequelize } from "sequelize-typescript";
import { app } from "../express";
import request from "supertest";
import { ClientModel } from "../../modules/client-adm/repository/client.model";

describe("E2E test for customer", () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })

    sequelize.addModels([ClientModel])

    await sequelize.sync({ force: true });
  })

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const response = await request(app)
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

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("John Doe");
    expect(response.body.address._street).toBe("Main St");
    expect(response.body.address._city).toBe("New York");
    expect(response.body.address._number).toBe("00");
    expect(response.body.address._zipCode).toBe("10011");
  });

  it("should not create a customer", async () => {
    const response = await request(app).post("/customer").send({
      name: "john",
    });
    expect(response.status).toBe(500);
  });
});

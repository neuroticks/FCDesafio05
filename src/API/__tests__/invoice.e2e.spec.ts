import { Sequelize } from "sequelize-typescript";
import { app } from "../express";
import request from "supertest";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";
import { Umzug } from "umzug";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import ProductModel from "../../modules/store-catalog/repository/product.model";
import { ProductAdmModel } from "../../modules/product-adm/repository/product.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import { migrator } from "../../migrate/config/migrator";

describe("E2E test for customer", () => {
  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })

    sequelize.addModels([ClientModel, ProductModel,
      ProductAdmModel,
      TransactionModel, InvoiceModel,
      InvoiceItemModel])

    migration = migrator(sequelize)
    await migration.up()
    await sequelize.sync()
  })

  afterEach(async () => {
    if (!migration || !sequelize) {
      return
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  it("should get an existing invoice", async () => {

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
        salesPrice: 100,
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
        salesPrice: 200,
        stock: 2,
      });
    expect(productTwoAddResponse.status).toBe(200);
    expect(productTwoAddResponse.body.name).toBe("Produto Due");
    expect(productTwoAddResponse.body.purchasePrice).toBe(22);
    expect(productTwoAddResponse.body.salesPrice).toBe(200);

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
    expect(checkoutResponse.body.total).toBe(300);

    const invoiceResponse = await request(app)
      .get("/invoice/:id")
      .send({
        id: checkoutResponse.body.invoiceId
      });

    expect(invoiceResponse.status).toBe(200);
    expect(invoiceResponse.body.name).toBe("John Doe");
    expect(invoiceResponse.body.address.street).toBe("Main St");
    expect(invoiceResponse.body.address.city).toBe("New York");
    expect(invoiceResponse.body.address.number).toBe("00");
    expect(invoiceResponse.body.address.zipCode).toBe("10011");

    expect(invoiceResponse.body.items[0].id).toBe(productOneAddResponse.body.id)
    expect(invoiceResponse.body.items[1].id).toBe(productTwoAddResponse.body.id)

    expect(invoiceResponse.body.total).toBe(300);

  });

});

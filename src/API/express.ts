import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { ProductModel } from "../modules/product-adm/repository/product.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import { InvoiceModel } from "../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../modules/invoice/repository/invoice-item.model";
import { customerRoute } from "./routes/customer.route";
import { productRoute } from "./routes/product.route";
import { checkoutRoute } from "./routes/checkout.route";


export const app: Express = express();
app.use(express.json());
app.use("/customer", customerRoute); //Post
app.use("/product", productRoute); //Post
app.use("/shop", checkoutRoute) //Post
//app.use("/invoice", invoiceRoute) //Get:id

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([ClientModel]);
  await sequelize.addModels([ProductModel]);
  await sequelize.addModels([TransactionModel]);
  await sequelize.addModels([InvoiceItemModel]);
  await sequelize.addModels([InvoiceModel]);

  await sequelize.sync();
}
setupDb();


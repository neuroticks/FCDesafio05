import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory";
import { PlaceOrderUseCaseInputDto } from "../../modules/checkout/usecase/place-order/place-order.usecase.dto";
import PlaceOrderUseCase from "../../modules/checkout/usecase/place-order/place-order.usecase";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../modules/store-catalog/factory/factory.facade";
import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../modules/payment/factory/payment.facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
  // 
  const clientFacade = ClientAdmFacadeFactory.create()
  const productFacade = ProductAdmFacadeFactory.create()
  const catalogFacade = StoreCatalogFacadeFactory.create()
  const invoiceFacade = InvoiceFacadeFactory.create()
  const paymentFacade = PaymentFacadeFactory.create()

  const usecase = new PlaceOrderUseCase(clientFacade, 
                                        productFacade, 
                                        catalogFacade, 
                                        null, 
                                        invoiceFacade, 
                                        paymentFacade)

  try {
    const placeOrderDTO: PlaceOrderUseCaseInputDto = {
      clientId: req.body.clientId,
      products: req.body.products.map((p: any) => {
        return {
          productId: p.productId,
        }
      })
    }
    const output = await usecase.execute(placeOrderDTO);
    res.send(output);
  } catch (error) {
    res.status(500).send(error)
  }

});

import express, { Request, Response } from "express";
import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.facade.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get("/", async (req: Request, res: Response) => {
  // 
  const l_invoiceFacade = InvoiceFacadeFactory.create()

  try {
    const l_invoiceFound = await l_invoiceFacade.findInvoice({id: req.body.id})

    res.send(l_invoiceFound);
  } catch (error) {
    res.status(500).send(error)
  }

});

import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel } from "./invoice-item.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

    async generate(par_invoiceEntity: Invoice): Promise<void> {
        await InvoiceModel.create({
            id: par_invoiceEntity.id.id,
            name: par_invoiceEntity.name,
            document: par_invoiceEntity.document,
            street: par_invoiceEntity.address.street,
            number: par_invoiceEntity.address.number,
            complement: par_invoiceEntity.address.complement,
            city: par_invoiceEntity.address.city,
            state: par_invoiceEntity.address.state,
            zipcode: par_invoiceEntity.address.zipCode,
            items: par_invoiceEntity.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: par_invoiceEntity.total(),
            createdAt: par_invoiceEntity.createdAt,
            updatedAt: par_invoiceEntity.updatedAt
        },
            {
                include: [{ model: InvoiceItemModel }]
            }
        )
    }

    find(id: string): Promise<Invoice> {
        throw new Error("Method not implemented.");
    }

}

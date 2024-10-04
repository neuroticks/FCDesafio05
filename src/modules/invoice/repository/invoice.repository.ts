import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
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

    async find(id: string): Promise<Invoice> {
        const l_invoiceFound = await InvoiceModel.findOne({
            where: { id },
            include: ["items"]
        })

        if (!l_invoiceFound) {
            throw new Error("Invoice not found")
        }

        return new Invoice({
            id: new Id(l_invoiceFound.id),
            name: l_invoiceFound.name,
            document: l_invoiceFound.document,
            address: new Address(
                l_invoiceFound.street,
                l_invoiceFound.number,
                l_invoiceFound.complement,
                l_invoiceFound.city,
                l_invoiceFound.state,
                l_invoiceFound.zipcode
            ),
            items: l_invoiceFound.items.map((item) => {
                return new InvoiceItem({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price
                })
            }),
            createdAt: l_invoiceFound.createdAt,
            updatedAt: l_invoiceFound.updatedAt,
        })
    }

}

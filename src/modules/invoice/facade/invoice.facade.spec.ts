import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model"
import { InvoiceItemModel } from "../repository/invoice-item.model"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import { where } from "sequelize"

describe("InvoiceFacade UnitTest", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should Generate an Invoice", async () => {
        const l_invoiceFacade = InvoiceFacadeFactory.create()

        const l_inputInvoice = {
            name: "Cliente One - invoice facade generate",
            document: "012.345.678-9",
            street: "Rua do cliente invoice 1",
            number: "111",
            complement: "apto 111",
            city: "Cidade invoice 1",
            state: "Estado 1",
            zipCode: "11.222-333",
            items: [
                {
                    id: "111",
                    name: "Item 111 - invoice 1",
                    price: 100
                },
                {
                    id: "222",
                    name: "Item 222 - invoice 1",
                    price: 200
                },
                {
                    id: "333",
                    name: "Item 333 - invoice 1",
                    price: 300
                },
            ]
        }

        const l_generatedInvoice = await l_invoiceFacade.generateInvoice(l_inputInvoice)

        expect(l_generatedInvoice.id).toBeDefined()
        expect(l_generatedInvoice.name).toEqual(l_inputInvoice.name)
        expect(l_generatedInvoice.total).toBe(600)

    })

    it("should Find an existing Invoice", async () => {
        const l_invoiceFacade = InvoiceFacadeFactory.create()

        const l_invoiceModel = await InvoiceModel.create({
            id: "2",
            name: "Cliente Two - invoice facade Find",
            document: "012.345.678-9",
            street: "Rua do cliente invoice 2",
            number: "2",
            complement: "apto 2",
            city: "Cidade invoice 2",
            state: "Estado 2",
            zipcode: "22.222-333",
            items: [
                {
                    id: "it9-inv2",
                    name: "Item 9 - invoice 2",
                    price: 9
                },
                {
                    id: "it8-inv2",
                    name: "Item 8 - invoice 2",
                    price: 8
                },
                {
                    id: "it7-inv2",
                    name: "Item 7 - invoice 2",
                    price: 13
                },
            ],
            total: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
            {
                include: [{ model: InvoiceItemModel }]
            }
        )

        const l_invoiceFound = await l_invoiceFacade.findInvoice({id: l_invoiceModel.id})

        expect(l_invoiceFound.id).toBe(l_invoiceModel.id)
        expect(l_invoiceFound.name).toBe(l_invoiceModel.name)
        expect(l_invoiceFound.total).toBe(l_invoiceModel.total)
        expect(l_invoiceFound.createdAt).toStrictEqual(l_invoiceModel.createdAt)
    })
})

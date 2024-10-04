import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "./invoice.model"
import { InvoiceItemModel } from "./invoice-item.model"
import InvoiceRepository from "./invoice.repository"
import Invoice from "../domain/invoice.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import InvoiceItem from "../domain/invoice-item.entity"

describe("Invoice Repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([InvoiceModel, InvoiceItemModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create an Invoice", async () => {

        const l_invoiceItem1 = new InvoiceItem({
            id: new Id("10"),
            name: "Item Uno[10] - invoice 1",
            price: 10
        })
        const l_invoiceItem2 = new InvoiceItem({
            id: new Id("20"),
            name: "Item Due[20] - invoice 1",
            price: 20
        })
        const l_inputInvoice = new Invoice({
            id: new Id("1"),
            name: "Cliente Invoice 1 - RepositoryUnitTest",
            document: "012.345.678-9",
            address: new Address(
                "Rua do cliente invoice 1",
                "111",
                "apto 111",
                "Cidade invoice 1",
                "Estado 1",
                "11.222-333",
            ),
            items: [l_invoiceItem1, l_invoiceItem2],
        })

        const l_inputInvoiceItemsTotalPrice = l_inputInvoice.items.reduce(
            (ac, it) => ac + it.price, 0)

        const l_invoiceRepository = new InvoiceRepository()

        await l_invoiceRepository.generate(l_inputInvoice)

        const l_invoiceDB = await InvoiceModel.findOne({ where: { id: "1" } })

        expect(l_invoiceDB).toBeDefined()
        expect(l_invoiceDB.id).toEqual(l_inputInvoice.id.id)
        expect(l_invoiceDB.total).toEqual(l_inputInvoiceItemsTotalPrice)
    })

    it("should find an existing Invoice", async () => {

        const l_invoiceModel = await InvoiceModel.create({
            id: "55",
            name: "Cliente Invoice 55",
            document: "Doc 55",
            street: "Street 55",
            number: "55",
            complement: "Apt 5",
            city: "Cinque",
            state: "FV",
            zipcode: "55.555",
            items: [
                {
                    id: "1-55",
                    name: "item 1 - invoice 55",
                    price: 55
                },
                {
                    id: "2-55",
                    name: "item 2 - invoice 55",
                    price: 110
                },
            ],
            total: 165,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
            {
                include: [{ model: InvoiceItemModel }]
            }
        )

        const l_invoiceRepository = new InvoiceRepository()
        const l_invoiceFound = await l_invoiceRepository.find(l_invoiceModel.id)

        expect(l_invoiceFound.id.id).toEqual(l_invoiceModel.id)
        expect(l_invoiceFound.name).toEqual(l_invoiceModel.name)
        expect(l_invoiceFound.total()).toEqual(l_invoiceModel.total)
        expect(l_invoiceFound.createdAt).toStrictEqual(l_invoiceModel.createdAt)
    })
})

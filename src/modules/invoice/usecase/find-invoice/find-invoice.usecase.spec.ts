import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import InvoiceItem from "../../domain/invoice-item.entity"
import Invoice from "../../domain/invoice.entity"
import FindInvoiceUseCase from "./find-invoice.usecase"

const l_invoiceItem1 = new InvoiceItem({
    id: new Id("10"),
    name: "Item Uno[10] - invoice 9",
    price: 800
})
const l_invoiceItem2 = new InvoiceItem({
    id: new Id("20"),
    name: "Item Due[20] - invoice 9",
    price: 200
})
const l_inputInvoice = new Invoice({
    id: new Id("9"),
    name: "Cliente Invoice 9 - UseCase UnitTest",
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

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(l_inputInvoice))
    }
}

describe("Find Invoice use case unit test", () => {

    it("should find an Invoice", async () => {

        const repository = MockRepository()
        const usecase = new FindInvoiceUseCase(repository)

        const l_searchInput = {id: '9'}

        const result = await usecase.execute(l_searchInput)

        expect(repository.find).toHaveBeenCalled()
        expect(result.id).toEqual("9")
        expect(result.name).toEqual(l_inputInvoice.name)
        expect(result.total).toEqual(l_inputInvoice.total())
    })
})
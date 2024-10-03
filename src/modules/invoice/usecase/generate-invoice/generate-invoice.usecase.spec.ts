import GenerateInvoiceUseCase from "./generate-invoice.usecase"

// same as DTO_Input
const g_inputInvoice = {
    name: "Cliente Invoice 1",
    document: "012.345.678-9",
    street: "Rua do cliente invoice 1",
    number: "111",
    complement: "apto 111",
    city: "Cidade invoice 1",
    state: "Estado 1",
    zipCode: "11.222-333",
    items: [
        {
            id: "1",
            name: "Item 1 - invoice 1",
            price: 10
        },
        {
            id: "2",
            name: "Item 2 - invoice 1",
            price: 20
        },
        {
            id: "3",
            name: "Item 3 - invoice 1",
            price: 30
        },
        {
            id: "4",
            name: "Item 4 - invoice 1",
            price: 40
        },
    ]
}

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn(),
    }
}

describe("Generate Invoice UseCase UnitTest", () => {

    it("should generate an invoice", async () => {

        const l_repository = MockRepository()
        const l_usecase = new GenerateInvoiceUseCase(l_repository)

        const g_inputInvoiceItemsTotalPrice = g_inputInvoice.items.reduce(
                                                    (ac, it) => ac + it.price, 0)

        const l_retorno = await l_usecase.execute(g_inputInvoice)

        expect(l_repository.generate).toHaveBeenCalled()
        expect(l_retorno.id).toBeDefined()
        expect(l_retorno.name).toEqual(g_inputInvoice.name)
        expect(l_retorno.total).toEqual(g_inputInvoiceItemsTotalPrice)
    })
})
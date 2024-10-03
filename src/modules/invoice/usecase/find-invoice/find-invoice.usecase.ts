import InvoiceGateway from "../../gateway/invoice.gateway";
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.dto";

export default class FindInvoiceUseCase {

    constructor(private readonly _invoiceRepository: InvoiceGateway) { }

    async execute(par_input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        const l_resultFind = await this._invoiceRepository.find(par_input.id)

        return {
            id: l_resultFind.id.id,
            name: l_resultFind.name,
            document: l_resultFind.document,
            address: {
                street: l_resultFind.address.street,
                number: l_resultFind.address.number,
                complement: l_resultFind.address.complement,
                city: l_resultFind.address.city,
                state: l_resultFind.address.state,
                zipCode: l_resultFind.address.zipCode,
            },
            items: l_resultFind.items.map((item) => ({
                id: item.id.id,
                name: item.name,
                price: item.price
            })),
            total: l_resultFind.total(),
            createdAt: l_resultFind.createdAt
        }
    }
}
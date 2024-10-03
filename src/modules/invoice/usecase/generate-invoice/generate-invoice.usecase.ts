import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase {

    constructor(private readonly _GenerateInvoiceRepository: InvoiceGateway) { }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {

        const l_items = input.items.map((item) => {
            return new InvoiceItem({
                id: new Id(item.id),
                name: item.name,
                price: item.price,
            })
        })

        const props = {
            id: new Id(),
            name: input.name,
            document: input.document,
            address: new Address(
                input.street,
                input.number,
                input.complement,
                input.city,
                input.state,
                input.zipCode
            ),
            items: l_items,
        }

        const l_invoice = new Invoice(props)

        await this._GenerateInvoiceRepository.generate(l_invoice)

        return {
            id: l_invoice.id.id,
            name: l_invoice.name,
            document: l_invoice.document,
            street: l_invoice.address.street,
            number: l_invoice.address.number,
            complement: l_invoice.address.complement,
            city: l_invoice.address.city,
            state: l_invoice.address.state,
            zipCode: l_invoice.address.zipCode,
            items: input.items,
            total: l_invoice.total(),
        }
    }
}
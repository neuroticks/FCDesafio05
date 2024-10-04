import InvoiceFacade from "../facade/invoice.facade"
import InvoiceRepository from "../repository/invoice.repository"
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"

export default class InvoiceFacadeFactory {
    static create() {
        const l_invoiceRepository = new InvoiceRepository

        const l_generateInvoiceUseCase = new GenerateInvoiceUseCase(l_invoiceRepository)
        const l_findInvoiceUseCase = new FindInvoiceUseCase(l_invoiceRepository)

        const l_invoiceFacade = new InvoiceFacade({
            generateUseCase: l_generateInvoiceUseCase,
            findUseCase: l_findInvoiceUseCase
        })

        return l_invoiceFacade
    }
}
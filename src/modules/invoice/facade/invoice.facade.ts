import UseCaseInterface from "../../@shared/usecase/usecase.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCasesProps {
    generateUseCase: UseCaseInterface;
    findUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {

    private _generateUsecase: UseCaseInterface;
    private _findUsecase: UseCaseInterface;

    constructor(usecasesProps: UseCasesProps) {
        this._generateUsecase = usecasesProps.generateUseCase;
        this._findUsecase = usecasesProps.findUseCase;
    }

    // se o DTO do UseCase for diferente do DTO da Façade, 
    // precisa converter o DTO_Façade para o DTO_UseCase
    generateInvoice(input: GenerateInvoiceFacadeInputDto):
        Promise<GenerateInvoiceFacadeOutputDto> {

        return this._generateUsecase.execute(input)
    }

    findInvoice(input: FindInvoiceFacadeInputDto):
        Promise<FindInvoiceFacadeOutputDto> {

        return this._findUsecase.execute(input)
    }
}
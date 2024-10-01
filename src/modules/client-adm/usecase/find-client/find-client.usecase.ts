import ClientGateway from "../../gateway/cliente.gateway";
import { FindClientUseCaseInputDTO, FindClientUseCaseOutputDTO } from "./find-client.usecase.dto";

export default class FindClienteUseCase {
    private _clientRepository: ClientGateway

    constructor(par_input: ClientGateway) {
        this._clientRepository = par_input
    }

    async execute(par_input: FindClientUseCaseInputDTO): Promise<FindClientUseCaseOutputDTO> {
        const l_resultFind = await this._clientRepository.find(par_input.id)

        return {
            id: l_resultFind.id.id,
            name: l_resultFind.name,
            email: l_resultFind.email,
            document: l_resultFind.document,
            address: l_resultFind.address,
            createdAt: l_resultFind.createdAt,
            updatedAt: l_resultFind.updatedAt
        }
    }
}
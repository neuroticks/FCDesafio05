import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Client from "../../domain/client.entity"
import FindClienteUseCase from "./find-client.usecase"

const l_client = new Client({
    id: new Id('1'),
    name: 'Nome cliente1',
    email: 'Email cliente1',
    document: '1a2b3c',
    address: new Address('Rua Cliente 1', '1010', 'Apto 11', 'Cidade cliente1', 'PR', '11222-333')
})

const MockRepository = () => {
    return {

        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(l_client))
    }
}

describe("Find Client use case unit test", () => {

    it("should find a client", async () => {

        const repository = MockRepository()
        const usecase = new FindClienteUseCase(repository)

        const l_searchInput = {id: '1'}

        const result = await usecase.execute(l_searchInput)

        expect(repository.find).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(l_client.name)
        expect(result.email).toEqual(l_client.email)
        expect(result.address).toEqual(l_client.address)

    })
})
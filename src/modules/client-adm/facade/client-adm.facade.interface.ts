import Address from "../../@shared/domain/value-object/address"

export interface AddClientFacadeInputDto {
  id?: string
  name: string
  email: string
  document: string
  address: {
    street: string
    number: string
    complement: string
    city: string
    state: string
    zipCode: string
  }
}

export interface AddClientFacadeOutputDto {
  clientId: string
}

export interface FindClientFacadeInputDto {
  id: string
}

export interface FindClientFacadeOutputDto {
  id: string
  name: string
  email: string
  document: string
  address: Address
  createdAt: Date
  updatedAt: Date
}

export default interface ClientAdmFacadeInterface {
  add(input: AddClientFacadeInputDto): Promise<AddClientFacadeOutputDto>;
  find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>;
}

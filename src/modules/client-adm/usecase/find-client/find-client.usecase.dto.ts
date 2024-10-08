import Address from "../../../@shared/domain/value-object/address"

export interface FindClientUseCaseInputDTO {
    id: string
}

export interface FindClientUseCaseOutputDTO {
    id: string
    name: string
    email: string
    document: string
    address: Address
    createdAt: Date
    updatedAt: Date
}
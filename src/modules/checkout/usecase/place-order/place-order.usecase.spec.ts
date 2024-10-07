import Id from "../../../@shared/domain/value-object/id.value-object"
import Product from "../../domain/product.entity"
import PlaceOrderUseCase from "./place-order.usecase"
import { PlaceOrderUseCaseInputDto } from "./place-order.usecase.dto"

describe("PlaceOrder UseCase UnitTest", () => {

    const mockDate = new Date(2000, 1, 1)

    describe("ValidateProducts process", () => {

        //@ts-expect-error - no params in constructor
        const l_placeOrderUseCase = new PlaceOrderUseCase()

        it("should throw error if no Products selected", async () => {
            const l_input: PlaceOrderUseCaseInputDto = {
                clientId: "0",
                products: []
            }

            await expect(
                l_placeOrderUseCase["validateProducts"](l_input)
            ).rejects.toThrow(new Error("No products selected"))
        })

        it("should throw error if product is out fo stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({ productId }: { productId: string }) =>
                    Promise.resolve({
                        productId,
                        stock: productId === "1" ? 0 : 1
                    })
                )
            }

            //@ts-expect-error - force set productFacade
            l_placeOrderUseCase["_productFacade"] = mockProductFacade

            let l_input: PlaceOrderUseCaseInputDto = {
                clientId: "0",
                products: [{ productId: "1" }]
            }

            await expect(l_placeOrderUseCase["validateProducts"](l_input)
            ).rejects.toThrow(new Error("Product 1 is not available in stock"))

            // testando com 2 produtos, sendo um com stock outro sem
            l_input = {
                clientId: "0",
                products: [{ productId: "2" }, { productId: "1" }]
            }

            await expect(
                l_placeOrderUseCase["validateProducts"](l_input)
            ).rejects.toThrow(new Error("Product 1 is not available in stock"))

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3) // 1x la acima com 1 prod + 2x aqui com 2 prods

            // testando com 3 produtos, sendo dois com stock e um sem
            l_input = {
                clientId: "0",
                products: [{ productId: "8" }, { productId: "9" }, { productId: "1" }]
            }

            await expect(
                l_placeOrderUseCase["validateProducts"](l_input)
            ).rejects.toThrow(new Error("Product 1 is not available in stock"))

            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(6) // as 3x chamadas acima + 3 chamadas aqui
        })
    })

    describe("getProducts Process", () => {

        beforeAll(() => {
            jest.useFakeTimers("modern")
            jest.setSystemTime(mockDate)
        })

        afterAll(() => {
            jest.useRealTimers()
        })

        //@ts-expect-error - no params in constructor
        const l_placeOrderUseCase = new PlaceOrderUseCase()

        it("should throw erro when product not found", async () => {

            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null)
            }

            //@ts-expect-error - force set catalogFacade
            l_placeOrderUseCase["_catalogFacade"] = mockCatalogFacade

            await expect(l_placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
                new Error("Product not found")
            )

        })

        it("should return existing Product", async () => {

            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    name: "product 0",
                    description: "description 0",
                    salesPrice: 0
                })
            }

            //@ts-expect-error - force set catalogFacade
            l_placeOrderUseCase["_catalogFacade"] = mockCatalogFacade

            await expect(l_placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
                new Product({
                    id: new Id("0"),
                    name: "product 0",
                    description: "description 0",
                    salesPrice: 0
                })
            )

            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1)
        })
    })

    describe("Execute", () => {

        beforeAll(() => {
            jest.useFakeTimers("modern")
            jest.setSystemTime(mockDate)
        })

        afterAll(() => {
            jest.useRealTimers()
        })

        it("should throw an error when Client not found", async () => {

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            }
            //@ts-expect-error - no params in constructor
            const l_placeOrderUseCase = new PlaceOrderUseCase()
            //@ts-expect-error - force set clientFacade
            l_placeOrderUseCase["_clientFacade"] = mockClientFacade
            const input: PlaceOrderUseCaseInputDto = { clientId: "0", products: [] }
            await expect(l_placeOrderUseCase.execute(input)).rejects.toThrow(new Error("Client not found"))
        })

        it("should throw an error when no Product selected", async () => {

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
            }
            //@ts-expect-error - no params in constructor
            const l_placeOrderUseCase = new PlaceOrderUseCase()

            const mockValidateProducts = jest
                //@ts-expect-error - spy on private method
                .spyOn(l_placeOrderUseCase, "validateProducts")
                //@ts-expect-error - not return never
                .mockRejectedValue(new Error("No products selected"))

            //@ts-expect-error - force set clientFacade
            l_placeOrderUseCase["_clientFacade"] = mockClientFacade

            const input: PlaceOrderUseCaseInputDto = { clientId: "1", products: [] }
            await expect(l_placeOrderUseCase.execute(input)).rejects.toThrow(new Error("No products selected"))

            expect(mockValidateProducts).toHaveBeenCalledTimes(1)
        })

        describe("place an Order", () => {

            const l_clientProps = {
                id: "Cli-1",
                name: "Cli Uno - PlaceOrder UnitTest",
                email: "cli.uno@email.com",
                document: "doc cli 1",
                address: {
                    street: "1st Avenue",
                    number: "11",
                    complement: "apt 111",
                    city: "New York",
                    state: "NY",
                    zipCode: "10011"
                }
            }

            const mockClientFacade = {
                add: jest.fn(),
                find: jest.fn().mockResolvedValue(l_clientProps)
            }

            const mockPaymentFacade = {
                process: jest.fn()
            }

            const mockCheckoutPurchase = {
                addOrder: jest.fn(),
                findOrder: jest.fn()
            }

            const mockInvoiceFacade = {
                generateInvoice: jest.fn().mockResolvedValue({ id: "1" }),
                findInvoice: jest.fn()
            }

            const l_placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade,
                null,
                null,
                mockCheckoutPurchase,
                mockInvoiceFacade,
                mockPaymentFacade
            )

            const l_products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "product 1",
                    description: "description 1",
                    salesPrice: 10
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "product 2",
                    description: "description 2",
                    salesPrice: 20
                })
            }

            const mockValidateProduct = jest
                //@ts-expect-error - spy on private method
                .spyOn(l_placeOrderUseCase, "validateProducts")
                //@ts-expect-error - spy on private method
                .mockResolvedValue(null)

            const mockGetProduct = jest
                //@ts-expect-error - spy on private method
                .spyOn(l_placeOrderUseCase, "getProduct")
                //@ts-expect-error - not return never
                .mockImplementation((productId: keyof typeof l_products) => {
                    return l_products[productId]
                })

            it("should not be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "Transaction-1",
                    orderId: "OrderId-1",
                    amount: 20,
                    status: "error",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })

                const input: PlaceOrderUseCaseInputDto = {
                    clientId: "Cli-1",
                    products: [{ productId: "1" }, { productId: "2" }]
                }

                let output = await l_placeOrderUseCase.execute(input)

                expect(output.invoiceId).toBeNull()
                expect(output.total).toBe(30)
                expect(output.products).toStrictEqual([
                    { productId: "1" },
                    { productId: "2" }
                ])
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "Cli-1" })
                expect(mockValidateProduct).toHaveBeenCalledTimes(1)
                expect(mockValidateProduct).toHaveBeenCalledWith({ clientId: input.clientId, products: input.products })
                expect(mockGetProduct).toHaveBeenCalledTimes(2)
                expect(mockCheckoutPurchase.addOrder).toHaveBeenCalledTimes(1)
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1)
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                })

                expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledTimes(0)
            })

            it("should be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "Transaction-2",
                    orderId: "OrderId-2",
                    amount: 30,
                    status: "approved",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })

                const input: PlaceOrderUseCaseInputDto = {
                    clientId: "Cli-1",
                    products: [{ productId: "1" }, { productId: "2" }]
                }

                let output = await l_placeOrderUseCase.execute(input)

                expect(output.invoiceId).toBe("1")
                expect(output.total).toBe(30)
                expect(output.products).toStrictEqual([
                    { productId: "1" },
                    { productId: "2" }
                ])
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "Cli-1" })
                expect(mockValidateProduct).toHaveBeenCalledTimes(1)
                //expect(mockValidateProduct).toHaveBeenCalledWith({clientId:input.clientId, products:input.products})
                expect(mockGetProduct).toHaveBeenCalledTimes(2)
                expect(mockCheckoutPurchase.addOrder).toHaveBeenCalledTimes(1)
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1)
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total
                })

                expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledTimes(1)
                expect(mockInvoiceFacade.generateInvoice).toHaveBeenCalledWith(
                    {
                        name: l_clientProps.name,
                        document: l_clientProps.document,

                        street: l_clientProps.address.street,
                        number: l_clientProps.address.number,
                        complement: l_clientProps.address.complement,
                        city: l_clientProps.address.city,
                        state: l_clientProps.address.state,
                        zipCode: l_clientProps.address.zipCode,

                        items: [
                            {
                                id: l_products["1"].id.id,
                                name: l_products["1"].name,
                                price: l_products["1"].salesPrice
                            },
                            {
                                id: l_products["2"].id.id,
                                name: l_products["2"].name,
                                price: l_products["2"].salesPrice
                            }
                        ],
                    }
                )
            })
        })
    })
})
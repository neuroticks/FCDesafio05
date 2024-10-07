import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/usecase.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import Invoice from "../../../invoice/domain/invoice.entity";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderUseCaseInputDto, PlaceOrderUseCaseOutputDto } from "./place-order.usecase.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {

    constructor(
        private readonly _clientFacade: ClientAdmFacadeInterface,
        private readonly _productFacade: ProductAdmFacadeInterface,
        private readonly _catalogFacade: StoreCatalogFacadeInterface,
        private readonly _checkout: CheckoutGateway,
        private readonly _invoiceFacade: InvoiceFacadeInterface,
        private readonly _paymentFacade: PaymentFacadeInterface,
    ) { }

    async execute(input: PlaceOrderUseCaseInputDto): Promise<PlaceOrderUseCaseOutputDto> {

        // CLIENTE -- CLIENTE -- CLIENTE
        // buscar cliente - caso nao encontre retorna ClientNotFound
        const l_clientFound = await this._clientFacade.find({ id: input.clientId })
        if (!l_clientFound) {
            throw new Error("Client not found")
        }
        // criar o obj cliente
        const l_orderClient = new Client({
            id: new Id(l_clientFound.id),
            name: l_clientFound.name,
            email: l_clientFound.email,
            document: l_clientFound.document,
            address: l_clientFound.address
        })

        // PRODUCTS -- PRODUCTS -- PRODUCTS
        // validar produto
        await this.validateProducts(input)
        // criar produtos
        const l_orderProducts = await Promise.all(
            input.products.map((p) => this.getProduct(p.productId))
        )

        // ORDER -- ORDER -- ORDER
        //criar o obj order (client, products)
        const l_order = new Order({
            client: l_orderClient,
            products: l_orderProducts
        })

        // process payment -> façade (order, amout)
        const l_orderPayment = await this._paymentFacade.process({
            orderId: l_order.id.id,
            amount: l_order.total()
        })

        //se pgto aprovado -> gerar invoice
        const l_orderInvoice = l_orderPayment.status === "approved" ?
            await this._invoiceFacade.generateInvoice({
                name: l_orderClient.name,
                document: l_orderClient.document,
                street: l_orderClient.address.street,
                number: l_orderClient.address.number,
                complement: l_orderClient.address.complement,
                city: l_orderClient.address.city,
                state: l_orderClient.address.state,
                zipCode: l_orderClient.address.zipCode,
                items: l_orderProducts.map((p) => {
                    return {
                        id: p.id.id,
                        name: p.name,
                        price: p.salesPrice
                    }
                })
            })
            : null

        // mudar status order -> approuved
        if (l_orderPayment.status === "approved"){
            l_order.approve()
        }
        this._checkout.addOrder(l_order)

        return {
            id: l_order.id.id,
            invoiceId: l_orderPayment.status === "approved" ? l_orderInvoice.id : null,
            status: l_order.status,
            total: l_order.total(),
            products: l_order.products.map((p) => {
                return {
                    productId: p.id.id
                }
            }),
        }
    }

    private async validateProducts(input: PlaceOrderUseCaseInputDto): Promise<void> {
        if (input.products.length === 0) {
            throw new Error("No products selected")
        }

        for (const p of input.products) {
            const l_prod = await this._productFacade.checkStock({
                productId: p.productId
            })
            if (l_prod.stock <= 0) {
                throw new Error(`Product ${l_prod.productId} is not available in stock`)
            }
        }
    }

    private async getProduct(par_prodId: string): Promise<Product> {
        const l_prodFound = await this._catalogFacade.find({ id: par_prodId })

        if (!l_prodFound) {
            throw new Error("Product not found")
        }

        const prodProps = {
            id: new Id(l_prodFound.id),
            name: l_prodFound.name,
            description: l_prodFound.description,
            salesPrice: l_prodFound.salesPrice,
        }

        return new Product(prodProps)
    }
}
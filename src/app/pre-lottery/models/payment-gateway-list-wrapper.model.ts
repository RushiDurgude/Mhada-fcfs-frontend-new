export class PaymentGatewayListWrapperModel {
    constructor(
        public paymentGateways: {[key: string]: string},
        public status: string,
        public errorMessage: string
    ) { }
}
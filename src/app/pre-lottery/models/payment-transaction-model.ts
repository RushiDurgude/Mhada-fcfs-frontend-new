export class PaymentTransactionResponseModel {
    constructor(
        public transactionId: string,
        public status: string,
        public errorMessage: string
    ) { }
}
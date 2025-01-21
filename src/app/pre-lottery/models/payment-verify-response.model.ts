export class PaymentVerifyResponseModel {

    constructor(
        public applicationKey: number,
        public applicationNo: string,
        public schemeCode: string,
        public schemeName: string,
        public categoryCode: string,
        public categoryName: string,
        public transactionId: string,
        public status: string,
        public amount: number,
        public errorMessage: string,
        public paymentType: string,
        public installmentType: string
    ) { }
}
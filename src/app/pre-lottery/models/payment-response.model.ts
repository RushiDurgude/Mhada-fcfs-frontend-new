export class PaymentResponseModel {
    constructor(
        public BANKNAME: string, public BANKTXNID: string, 
        public CHECKSUMHASH: string, public CURRENCY: string, 
        public GATEWAYNAME: string, public MID: string, 
        public ORDERID: string, public PAYMENTMODE: string, 
        public RESPCODE: string, public RESPMSG: string, 
        public STATUS: string, public TXNAMOUNT: string, 
        public TXNDATE: string, public TXNID: string, 
    ) { }
}
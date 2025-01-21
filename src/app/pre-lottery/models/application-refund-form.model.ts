export class ApplicationRefundFormModel {
    constructor(
        public applicationKey: number,
        public applicationNo: string,
        public schemeCode: string,
        public schemeName: string,
        public categoryCode: string,
        public categoryName: string,
        public refundMode: string,
        public nameAsOnBank: string,
        public bankAccountNo: string,
        public confirmBankAccountNo: string,
        public ifsc: string,
        public bankName: string,
        public branchName: string,
        public bankVerification: string,
        public showChequePassbookUpload: boolean,
        public status: string,
        public errorMessage: string,        
    ) { }
}
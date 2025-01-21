export class NocViewDetailsFormModel {
    constructor(

        public applicationNo: string,
        public applicantName: string,
        public scheme: string,
        public tenement: string,
        public category: string,
        public lottery: string,
        public lotteryCode: string,
        public bankName: string,
        public branchName: string,
        public nocDate: string,
        public tenureYear: number,
        public tenureMonths: number,
        public loanAmount: number,
        public rateOfIntrest: number,
        public applicationKey: number,
        public nocStatus: string,
        public nocApplicationFile: string,
        public sanctionLetterFile: string,
        public cancelLetterFile: string,
        public mortKey: number,
        public nocLetterFile: string,
 
        public rejectReason: string,
        public status: string,
        public errorMessage: string,  

        public nocPaymentStatus: string,
        public haveCancelledNocEntry: boolean,
        public cancelNocRejectReason: string,
    ) { }
}
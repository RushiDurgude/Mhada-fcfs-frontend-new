export class NocEditRequestModel {
    constructor(
        
        public bankName: string,
        public branchName: string,
        // public nocDate: string,
        public tenureYear: number,
        public tenureMonths: number,
        public loanAmount: number,
        public rateOfIntrest: number,
        public applicationKey: number,
        public nocApplicationFile: string | ArrayBuffer,
        public sanctionLetterFile: string | ArrayBuffer,
        public cancelNocLetterFile: string | ArrayBuffer,
        public mortKey: number

        
        ) { }
}

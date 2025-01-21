export class NocRequestModel {
    constructor(
        
        public bankName: string,
        public branchName: string,
        // public nocDate: string,
        public tenureYear: number,
        public tenureMonths: number,
        public loanAmount: number,
        public rateOfInterest: number,
        public applicationKey: number,
        public nocApplicationFile: string | ArrayBuffer,
        public sanctionLetterFile: string | ArrayBuffer,
        public cancelNocLetterFile: string | ArrayBuffer

        
        ) { }
}

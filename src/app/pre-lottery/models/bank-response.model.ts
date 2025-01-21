export class BankResponseModel {
    constructor(
        public ifsc: string,
        public bankName: string,
        public branchName: string,
        public status: string,
        public errorMessage: string
    ) { }
}
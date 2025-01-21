export class EmailMobileResponse {
    constructor(
        public answer: string,
        public questionId: number,
        public email: string,
        public mobileNo: string,
        public registrationId: number,
        public verificationStatus: string
    ) { }
}
export class IncomeCertResponse {
    constructor(
        public verificationStatus: string,
        public rejectReason: string
    ) { }
}
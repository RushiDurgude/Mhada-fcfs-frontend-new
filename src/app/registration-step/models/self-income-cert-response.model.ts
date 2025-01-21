export class SelfIncomeCertResponse {
    constructor(
        public verificationStatus: string,
        public rejectReason: string
    ) { }
}
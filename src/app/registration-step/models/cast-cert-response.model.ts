export class CastCertResponse {
    constructor(
        public verificationStatus: string,
        public rejectReason: string
    ) { }
}
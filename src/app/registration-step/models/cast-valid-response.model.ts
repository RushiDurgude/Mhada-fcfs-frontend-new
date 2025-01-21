export class CastValidResponse {
    constructor(
        public answer: string,
        public verificationStatus: string,
        public rejectReason: string
    ) { }
}
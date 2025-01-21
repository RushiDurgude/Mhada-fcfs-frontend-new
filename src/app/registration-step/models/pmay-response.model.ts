export class PmayResponse {
    constructor(
        public answer: string,
        public verificationStatus: string,
        public rejectReason: string
    ) { }
}
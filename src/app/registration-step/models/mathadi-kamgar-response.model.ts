export class MathadiKamgarResponse {
    constructor(
        public answer: string,
        public verificationStatus: string,
        public rejectReason: string
    ) { }
}
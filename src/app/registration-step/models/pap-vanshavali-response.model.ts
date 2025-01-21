export class PAPVanshavaliResponse {
    constructor(
        public answer: string,
        public verificationStatus: string,
        public rejectReason: string
    ) { }
}
export class PAPAwardCopyResponse {
    constructor(
        public answer: string,
        public verificationStatus: string,
        public rejectReason: string
    ) { }
}
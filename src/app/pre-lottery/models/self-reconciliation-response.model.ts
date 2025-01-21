export class SelfReconciliationResponse {
    constructor(
        public applicationId: number,
        public paymentStatus: string,
        public paymentStatusIcon: string,
        public status: string,
        public errorMessage: string
    ) { }
}
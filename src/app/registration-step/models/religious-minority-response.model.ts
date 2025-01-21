export class ReligiousMinorityResponse {
    constructor(
        public answer: string,
        public verificationStatus: string,
        public rejectReason: string,
        public religion: string,
    ) { }
}
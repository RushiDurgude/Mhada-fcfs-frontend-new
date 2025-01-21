export class WorkStatusRequest {
    constructor(
        public financialYear: number,
        public selfIncome: number,
        public spouseIncome: number,
    ) { }
}
export class WorkStatusResponse {
    constructor(
        public financialYear: number,
        public selfIncome: number,
        public spouseIncome: number,
        public answer: string
    ) { }
}
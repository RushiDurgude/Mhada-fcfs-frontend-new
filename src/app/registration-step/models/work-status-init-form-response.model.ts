export class WorkStatusInitFormResponse {
    constructor(
        public financialYears: {[key: number]: string},
        public showSpouseIncome: boolean
    ) { }
}
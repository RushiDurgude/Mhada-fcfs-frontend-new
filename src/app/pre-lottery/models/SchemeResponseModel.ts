export class SchemeResponseModel {
    constructor(
        public key: string,
        public schemeCode: string,
        public schemeName: string,
        public incomeGroupCode: string,
        public incomeGroupName: string,
        public emdAmount: number,
        public displaySequence: number,
        public lotteryCode: string,
        public lotteryName: string
        ) {}
}
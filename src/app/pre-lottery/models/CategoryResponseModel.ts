export class CategoryResponseModel {
    constructor(
        public key: number,
        public categoryCode: string,
        public categoryName: string,
        public displaySequence: number,
        public lotteryKey: number,
        public lotteryCode: string,
        public lotteryName:string,
        public schemeCode: string,
        public schemeName: string

    ) { }
}
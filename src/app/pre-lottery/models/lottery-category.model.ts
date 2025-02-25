export class LotteryCategoryModel {
    constructor(
        public key: number, 
        public categoryCode: string, 
        public categoryName: string, 
        public displaySequence: number,
        public categoryGroup: any,
        public lotteryKey: number) { }
}
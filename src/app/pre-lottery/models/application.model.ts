import { LotteryCategoryModel } from "./lottery-category.model";
import { LotteryMDRModel } from "./lottery-md.model";

export class ApplicationModel {
    constructor(public key: number,
        public applicationNo: string,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public schemeCode: string,
        public schemeName: string,
        public categoryCode: string,
        public categoryName: string,
        public emdAmount: number,
        public applicationFee: number,
        public paymentDetails: string,
        public status: string,
        public errorMessage: string,
        public successMsg: string,
        public lotterMdrlst: LotteryMDRModel[]
    ) { }
}
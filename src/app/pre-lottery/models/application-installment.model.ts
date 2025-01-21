import { LotteryMDRModel } from "./lottery-md.model";

export class ApplicationInsModel {
    constructor(public key: number, 
        public applicationNo: string,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public schemeCode: string,
        public schemeName: string,
        public categoryCode: string,
        public categoryName: string,
        public installmentAmount: number,
        public installmentType: string,
        public previousPaidInstallmentAmount: number,
        public balanceInstallmentAmount: number,
        public interestAmount: number,
        public status: string,
        public errorMessage: string,
        public allowPartialPayment: boolean,
        public lotterMdrlst: LotteryMDRModel[]
        ) { }
}
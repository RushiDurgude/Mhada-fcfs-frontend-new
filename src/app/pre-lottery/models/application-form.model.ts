import { LotteryCategoryModel } from "./lottery-category.model";

export class ApplicationFormModel {
    constructor(public schemeKey: number, public schemeCode: string,
        public schemeName: string, public address: string, public lotteryCategories: LotteryCategoryModel[],
        public status: string, public errorMessage: string,
        public bankVerification: string, public showNomineeEntry: boolean,
        public stopForMCGMYes: boolean, public applicantName: string,
        public showChequePassbookUpload: boolean, public lotteryCode: string,
        public lotteryName: string, public buildingImages: string[], public drawWinner: boolean,
        public drawSpouseWinner: boolean, public alreadyApplied: boolean, public agencyTypes: string[], public isAgencyAllowed: string) { }
}
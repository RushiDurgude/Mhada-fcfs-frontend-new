import { CategoryResponseModel } from "./CategoryResponseModel";
import { Page } from "./Page";

export class CategoryWrapperForAcceptedApplications {
    constructor(
        public lotteryCode: string,
        public lotteryName: string,
        public schemeCode: string,
        public schemeName: string,
        public status: string,
        public errorMessage: string,
        public page: Page<CategoryResponseModel>
    ) { }
}
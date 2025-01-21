import { Page } from "./Page";
import { SchemeResponseModel } from "./SchemeResponseModel";

export class SchemeWrapperForAcceptedApplications {
    constructor(
        public lotteryCode: string,
        public lotteryName: string,
        public status: string,
        public errorMessage: string,
        public page: Page<SchemeResponseModel>
    ) { }
}
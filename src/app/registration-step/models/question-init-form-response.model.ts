import { IncomeTypeInitFormResponse } from "./income-type-init-form-response.model";
import { WorkStatusInitFormResponse } from "./work-status-init-form-response.model";

export class QuestionInitFormResponse {
    constructor(
        public workStatusInitFormResponse: WorkStatusInitFormResponse,
        public incomeTypeInitFormResponse: IncomeTypeInitFormResponse,
        public status: string,
        public errorMessage: string
    ) { }
}
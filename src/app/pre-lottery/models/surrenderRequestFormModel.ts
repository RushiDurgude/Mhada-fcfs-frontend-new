import { Page } from "./Page";
import { RequestToSurrenderModel } from "./requestToSurrenderModel";

export class SurrenderRequestWrapperFormModel {
    constructor(
        public applicationNo : string,
        public applicantName : string,
        public schemeName : string,
        public schemeCode : string,
        public categoryCode : string,
        public buildingNo : string,
        public wing : string,
        public floor : number,
        public flatNo : number,
        public lotteryCode : string,
        public lotteryName : string,
        public status : string,
        public errorMessage : string,
        public requestToSurrenderModel : Page<RequestToSurrenderModel>,
        public ableToMakeRequest : boolean
    ) { }
}
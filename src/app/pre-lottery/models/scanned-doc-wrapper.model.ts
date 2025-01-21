import { ScannedDocParamModel } from "./scanned-doc-param.model";

export class ScannedDocWrapperResponseModel {
    constructor(
        public scannedDocParamList: ScannedDocParamModel[],
        public documentType: string,
        public status: string,
        public errorMessage: string
    ) { }
}
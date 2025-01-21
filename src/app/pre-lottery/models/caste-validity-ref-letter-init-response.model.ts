export class CasteValidityRefLetterInitResponseModel {
    constructor(
        public applicationNo: string,
        public applicantName: string,
        public categoryCode: string,
        public categoryName: string,
        public districts: string[],
        public status: string,
        public errorMessage: string,
        public maritalStatus: string,
    	public gender: string
    ) { }
}
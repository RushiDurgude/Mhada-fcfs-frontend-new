import { ProfileDocumentModel } from "./profile-document.model";

export class ProfileResponse {
    constructor(
        public name: string,
        public maskedMobileNumber: string,
        public panNumber: string,
        public dob: string,
        public address: string,
        public permanentAddress: string,
        public esigned: boolean,
        public profileDocuments: ProfileDocumentModel[],
        public status: string,
        public errorMessage: string
    ) { }
}
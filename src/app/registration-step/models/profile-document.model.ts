export class ProfileDocumentModel {
    constructor(
        public displayOnProfile: string,
        public answer: string,
        public verificationStatus: string,
        public questionCode: string,
        public displaySequence: number,
        public rejectRemarks: string,
        public editable: string
    ) { }
}
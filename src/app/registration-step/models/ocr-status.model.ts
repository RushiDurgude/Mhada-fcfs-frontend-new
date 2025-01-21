export class OcrStatus {
    constructor(
        public ocrStatus: string,
        public ocrEntryKey: number,
        public ocrData: string,
        public ocrEntryStatus: string,
        public octEntryErrorMessage: string,
        public status: string,
        public errorMessage: string,
        public ocrSuccessMessage :string
    ) { }
}
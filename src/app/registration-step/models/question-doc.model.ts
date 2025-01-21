export class QuestionDoc {
    constructor(
        public fileBase64: string,
        public fileType: string,
        public status: string,
        public errorMessage: string
    ) { }
}
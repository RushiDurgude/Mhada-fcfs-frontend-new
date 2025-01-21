export class QuestionProceedWithoutSaveResponse {
    constructor(
        public questionCode: string,
        public status: string,
        public errorMessage: string
    ) { }
}
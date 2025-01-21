export class ProfileQuestionEditResponse {
    constructor(
        public questionCode: string,
        public status: string,
        public errorMessage: string
    ) { }
}
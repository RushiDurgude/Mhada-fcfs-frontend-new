export class ApplicationDetailsForNocFormModel {
    constructor(

        public applicantName: string,
        public scheme: string,
        public category: string,
        public tenement: string,
        public lottery: string,
        
        public status: string,
        public errorMessage: string,  
    ) { }
}
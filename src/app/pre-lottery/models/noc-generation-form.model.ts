export class NocGenerationFormModel {
    constructor(

        public applications: {[key:number]:string},   
        public bankName: string,
        public branchName: string,
        public loanAmount: number,
        public rateOfIntrest: number,
        public tenureYear: number,
        public tenureMonth: number,
        public isSecondNoc: boolean,

        
        public status: string,
        public errorMessage: string,  
    ) { }
}
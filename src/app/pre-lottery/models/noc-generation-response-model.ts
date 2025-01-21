export class NocGenerationResponseModel {
    constructor(
 
        public applications: {[key:number]:string},   
        
        public status: string,
        public errorMessage: string,  
        ) {}
}
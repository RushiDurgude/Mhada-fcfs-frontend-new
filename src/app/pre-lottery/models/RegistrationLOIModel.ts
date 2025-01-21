export class RegistrationLOIModel {
    constructor(
        public registrationLetterKey: number, 
	    public lotteryCode: string,
	    public lotteryName: string,
        public applicationNos: string
    ) { }
}
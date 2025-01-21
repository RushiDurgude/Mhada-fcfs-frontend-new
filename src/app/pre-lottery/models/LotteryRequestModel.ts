export class LotteryRequestModel {
    constructor(
        public lotteryCode: string,
        public lotteryName: string,
        public activeFlag: string,

        public applicationFee: string,
        
        public lotteryStage: string,
            
        public draftPublishApplication: string,
            
        public finalPublishApplication: string,
            
        public publishResult: string,

        public boardKey: number,

            
        public displaySequence: number,
            
        public applicationStartDate: Date,
    
        public applicationEndDate: Date,
    
        public onlinePaymentStartDate: Date,
    
        public onlinePaymentEndDate: Date,
    
        public rtgsNeftEndDate: Date,
            
        public onlinePaymentEndDateUpdate: Date,
    
        public draftPublishApplicationDate: Date,
    
        public finalPublishApplicationDate: Date,
    
        public lotteryRunDate: Date,
    
        public refundStartDate: Date
    ) { }
}

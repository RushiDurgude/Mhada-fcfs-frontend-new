import { BoardModel } from "./board.model";

export class LotteryModel {
    constructor(public key: number, public lotteryCode: string,
        public lotteryName: string, public applicationStartDate: Date,
        public applicationEndDate: Date, public onlinePaymentStartDate: Date,
        public onlinePaymentEndDate: Date, public rtgsNeftEndDate: Date, 
        public draftPublishApplicationDate: Date, public finalPublishApplicationDate: Date,
        public lotteryRunDate: Date, public refundStartDate: Date,
        public boardModel: BoardModel, 
        
        public applicationStartDateLbl: string,
        public applicationEndDateLbl: string, public onlinePaymentStartDateLbl: string,
        public onlinePaymentEndDateLbl: string, public rtgsNeftEndDateLbl: string, 
        public draftPublishApplicationDateLbl: string, public finalPublishApplicationDateLbl: string,
        public lotteryRunDateLbl: string, public refundStartDateLbl: string,

        public applicationStartDateStatus: string,
        public applicationEndDateStatus: string, public onlinePaymentStartDateStatus: string,
        public onlinePaymentEndDateStatus: string, public rtgsNeftEndDateStatus: string, 
        public draftPublishApplicationDateStatus: string, public finalPublishApplicationDateStatus: string,
        public lotteryRunDateStatus: string, public refundStartDateStatus: string,

        public applicationStartDateFullTime: string,
        public applicationEndDateFullTime: string, public onlinePaymentStartDateFullTime: string,
        public onlinePaymentEndDateFullTime: string, public rtgsNeftEndDateFullTime: string, 
        public draftPublishApplicationDateFullTime: string, public finalPublishApplicationDateFullTime: string,
        public lotteryRunDateFullTime: string, public refundStartDateFullTime: string,
        ) { }    
}
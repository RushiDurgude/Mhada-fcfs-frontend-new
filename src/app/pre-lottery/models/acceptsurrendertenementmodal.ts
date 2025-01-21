export class AcceptSurrenderTenementModal {
    constructor(
        public acceptAppKey : number,
        public surrenderAppKey : number,
        public lotteryCode : string,
        public lotteryName : string,
        public schemeCode : string,
        public schemeName : string,
        public buildingNo : string,
        public wing : string,
        public floor : number,
        public flatNo : number,
        public applicationNo: string,
        public category: string
        
    ) { }
}
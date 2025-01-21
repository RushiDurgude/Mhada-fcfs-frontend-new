export class BoardResponseModel {
    constructor(
        public key: number,
        public boardCode: string,
        public boardName: string,
        public boardLogoResource: string,
        public activeFlag: string,
        public boardList: string,
        public orgName:string,
        public orgKey:number,
        public boardReportName: string,
        public boardReportNameMr: string
    ) { }
}
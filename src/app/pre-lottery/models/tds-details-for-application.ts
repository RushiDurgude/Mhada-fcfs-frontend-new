export class TDSDetailsForApplicationModel {
    constructor(

        public key: number,
        public applicationNo: string,
        public tenementCost: number,
        public qbFile: string,
        public asFile: string,
        public form16BFile: string,
        public challanFile: string,
        public verificationStatus: string,
        public tdsRejectRemark: string
        // TODO add
    ) { }
}
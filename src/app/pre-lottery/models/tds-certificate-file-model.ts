export class TDSCertificateFileModel {

    constructor(
        public key: number,// as ApplicationId
        public base6426QBfile: string,
        public base6426ASFile: string,
        public base64Form16BFile: string,
        public base64ChallanFile: string,
    ) { }
}
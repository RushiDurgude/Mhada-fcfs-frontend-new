export class BoardDocumentModel {
    constructor(
        public key: number,
        public boardKey: number,
        public boardCode: string,
        public headerLabelEn: string,
        public headerLabelMr: string,
        public displayOrder: number,
        public fileType: string,
        public urlEn: string,
        public urlMr: string
    ) { }
}
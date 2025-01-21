export class ReligiousMinorityRequest {
    constructor(
        public answer: string,
        public fileBase64: string | ArrayBuffer,
        public religion:string,
    ) { }
}
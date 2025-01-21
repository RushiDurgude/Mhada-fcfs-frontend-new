export class PmayRequest {
    constructor(
        public answer: string,
        public fileBase64: string | ArrayBuffer
    ) { }
}
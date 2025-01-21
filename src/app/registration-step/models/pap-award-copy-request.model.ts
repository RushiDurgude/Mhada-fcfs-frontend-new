export class PAPAwardCopyRequest {
    constructor(
        public answer: string,
        public fileBase64: string | ArrayBuffer
    ) { }
}
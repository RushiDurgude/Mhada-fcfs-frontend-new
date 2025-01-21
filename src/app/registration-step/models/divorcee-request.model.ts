export class DivorceeRequest {
    constructor(
        public answer: string,
        public fileBase64: string | ArrayBuffer
    ) { }
}
export class PAPVanshavaliRequest {
    constructor(
        public answer: string,
        public fileBase64: string | ArrayBuffer
    ) { }
}
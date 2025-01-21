export class RequestToSurrenderModel {
    constructor(
        public key : string,
        public reqLtrFile : any,
        public requestType : any,
        public status : any,
        public application : any,
        public requestReason : string,
        public rejectReason : string
    ) { }
}
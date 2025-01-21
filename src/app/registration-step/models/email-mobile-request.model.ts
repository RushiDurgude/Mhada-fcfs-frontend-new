export class EmailMobileRequest {
    constructor(
        public fkRegid: number,
        public fkQsid: number,
        public prevEmail: string,
        public reEmail: string,
        public emailOtp: string,
        public prevMobileNo: string,
        public reMobileNo: string,
        public mobileOtp: string,
    ) { }
}
export class LotteryMDRModel {
    constructor(
        public key: number,
        public paymentModeEn: string,
        public paymentModeMr: string,
        public mdrRateEn: string,
        public mdrRateMr: string,
        public displayOrder: number
    ) { }
}
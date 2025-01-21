export class InstallmentListItemModel {

    constructor(
        public key: number,
        public installmentType: string,
        public actualInstallmentType: string,
        public installmentAmount: number,
        public paidAmount: number,
        public interestAmount: number,
        public balanceAmount: number,
        public installmentPaymentStatus: string,
        public instPaymentStartDate: string,
	    public instPaymentEndDate: string,
	    public instPaymentEndDateWithInterest: string,
        public instPaymentInterestRate: number,
        public showAfterDueDatePast: boolean,
        public showInstallmentButton: boolean,
        public showInstallmentReceipt: boolean,
        public interestDelayDays: number,
        public status: string,
        public errorMessage: string,
        
    ) { }
}
import { InstallmentListItemModel } from "./installment-list-item.model";
import { Page } from "./Page";

export class InstallmentListWrapper {
    constructor(
        public page: Page<InstallmentListItemModel>,
        public status: string,
        public cost: number,
        public fileUploadStatus : string,
        public allowForTds: boolean,
        public tdsUploadEndDate: string,
        public errorMessage: string
        /* public verificationstatus: string */
    ) { }
}
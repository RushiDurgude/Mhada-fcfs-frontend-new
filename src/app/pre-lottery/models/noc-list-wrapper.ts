import { ApplicationListItemModel } from "./application-list-item.model";
import { ApplicationNocListModel } from "./application-noc-list-model";
import { Page } from "./Page";
import { PostLotteryApplicationListItemModel } from "./post-lottery-application-list";

export class NocListWrapper {
    constructor(
        public allowedForApply: boolean,
        public showCancelNoc: boolean,
        public stopApplyAtAlmntPoss: boolean,
        public errorMessage: string,
        public status: string,
        public page: Page<ApplicationNocListModel>,
    ) { }
}
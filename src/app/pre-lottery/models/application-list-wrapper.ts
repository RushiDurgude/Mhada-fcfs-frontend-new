import { ApplicationListItemModel } from "./application-list-item.model";
import { Page } from "./Page";
import { PostLotteryApplicationListItemModel } from "./post-lottery-application-list";

export class ApplicationListWrapper {
  constructor(
    public allowedForLOI: boolean,
    public page: Page<ApplicationListItemModel>,
    public pagePostLottery: Page<PostLotteryApplicationListItemModel>,
    public allowedForSurrenderAll: boolean,
    public allowedForAcceptence: boolean,
    public spouseErrorMsg: string,
    public allowedForHelpFile: boolean,
  ) {}
}

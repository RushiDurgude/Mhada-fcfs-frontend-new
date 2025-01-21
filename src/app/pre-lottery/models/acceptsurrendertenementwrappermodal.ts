import { AcceptSurrenderTenementModal } from "./acceptsurrendertenementmodal";

export class AcceptSurrenderTenementWrapperModal {
    constructor(
       public acceptTenement :  AcceptSurrenderTenementModal,
       public surrenderTenement :  AcceptSurrenderTenementModal[],
       public singleSurrenderTenement : AcceptSurrenderTenementModal
    ) { }
}
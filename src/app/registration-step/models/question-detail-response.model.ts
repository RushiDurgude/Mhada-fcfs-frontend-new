import { CentralGovernmentDetailResponse } from "./central-government-detail-response.model";
import { MhadaEmployeeDetailResponse } from "./mhada-employee-detail-response.model";
import { StateGovernmentDetailResponse } from "./state-government-detail-response.model";
import { DivorceeDetailResponse } from "./divorcee-detail-response.model";
import { MaritalStatusDetailResponse } from "./marital-status-detail-response.model";
import { WorkStatusResponse } from "./work-status-response.model";
import { ItrInccertResponse } from "./itr-inccert-response.model";

import { DomicileResponse } from "./domicile-response.model";
import { SelfItrResponse } from "./self-itr-response.model";
import { SpouseItrResponse } from "./spouse-itr-response.model";
import { IncomeCertResponse } from "./income-cert-response.model";
import { SelfIncomeCertResponse } from "./self-income-cert-response.model";
import { SpouseIncomeCertResponse } from "./spouse-income-cert-response.model";
import { CasteResponse } from "./caste-response.model";
import { CastCertResponse } from "./cast-cert-response.model";
import { CastValidResponse } from "./cast-valid-response.model";
import { ProjectAffectedPeopleResponse } from "./project-affected-people-response.model";
import { PAPVanshavaliResponse } from "./pap-vanshavali-response.model";
import { PAPAwardCopyResponse } from "./pap-award-copy-response.model";
import { PAPMetroCityDocumentResponse } from "./pap-metro-city-document-response.model";
import { MathadiKamgarResponse } from "./mathadi-kamgar-response.model";
import { ReligiousMinorityResponse } from "./religious-minority-response.model";
import { SpouseAadhaarResponse } from "./spouse-aadhaar-response.model";
import { SpousePanResponse } from "./spouse-pan-response.model";
import { ExServiceManDetailResponse } from "./ex-service-man-detail-response.model";
import { PmayResponse } from "./pmay-response.model";
import { HandicappedResponse } from "./handicapped-response.mode";
import { AddressResponse } from "./address-response.model";
import { JournalistResponse } from "./journalist-response.model";
import { EmailMobileResponse } from "./email-mobile-response.model";
import { FreedomfighterResponse } from "./freedomfighter-response.model";

export class QuestionDetailResponse {
    constructor(
        public centralGovernmentResponse: CentralGovernmentDetailResponse,
        public stateGovernmentResponse: StateGovernmentDetailResponse,
        public mhadaEmployeeResponse: MhadaEmployeeDetailResponse,
        public maritalStatusResponse: MaritalStatusDetailResponse,
        public casteResponse: CasteResponse,
        public divorceeResponse: DivorceeDetailResponse,
        public workStatusResponse: WorkStatusResponse,
        public itrInccertResponse: ItrInccertResponse,
        public exServiceManResponse: ExServiceManDetailResponse,
        public domicileResponse: DomicileResponse,
        public selfItrResponse: SelfItrResponse,
        public spouseItrResponse: SpouseItrResponse,
        public incomeCertResponse: IncomeCertResponse,
        public selfIncomeCertResponse: SelfIncomeCertResponse,
        public spouseIncomeCertResponse: SpouseIncomeCertResponse,
        public castCertResponse: CastCertResponse,
        public castValidResponse: CastValidResponse,
        public projectAffectedPeopleResponse: ProjectAffectedPeopleResponse,
        public papVanshavaliResponse: PAPVanshavaliResponse,
        public papAwardCopyResponse: PAPAwardCopyResponse,
        public papMetroCityDocumentResponse: PAPMetroCityDocumentResponse,
        public mathadiKamgarResponse: MathadiKamgarResponse,
        public religiousMinorityResponse: ReligiousMinorityResponse,
        public spouseAadhaarResponse: SpouseAadhaarResponse,
        public spousePanResponse: SpousePanResponse,
        public pmayResponse: PmayResponse,
        public handicappedResponse: HandicappedResponse,
        public addressResponse: AddressResponse,
        public journalistResponse: JournalistResponse,
        public emailMobileResponse: EmailMobileResponse,

        public freedomfighterResponse: FreedomfighterResponse,

        public status: string,
        public errorMessage: string
    ) { }
}
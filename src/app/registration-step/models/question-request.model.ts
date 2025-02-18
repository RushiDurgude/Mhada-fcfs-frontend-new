import { CastCertRequest } from "./cast-cert-request.model";
import { CastValidRequest } from "./cast-valid-request.model";
import { CasteRequest } from "./caste-request.model";
import { CentralGovernmentRequest } from "./central-government-request.model";
import { ConsentRequest } from "./consent-request.model";
import { DeathCertRequest } from "./death-cert-request.model";
import { DivorceeRequest } from "./divorcee-request.model";
import { ExServiceManRequest } from "./ex-service-man-request.model";
import { DomicileRequest } from "./domicile-request.model";
import { IncomeCertRequest } from "./income-cert-request.model";
import { ItrInccertRequest } from "./itr-inccert-request.model";
import { MathadiKamgarRequest } from "./mahadi-kamgar-request.model";
import { MaritalStatusRequest } from "./marital-status-request.model";
import { MhadaEmployeeRequest } from "./mhada-employee-request.model";
import { PAPAwardCopyRequest } from "./pap-award-copy-request.model";
import { PAPMetroCityDocumentRequest } from "./pap-metro-city-document-request.model";
import { PAPVanshavaliRequest } from "./pap-vanshavali-request.model";
import { ProjectAffectedPeopleRequest } from "./project-affected-people-request.model";
import { ReligiousMinorityRequest } from "./religious-minority-request.model";
import { SelfIncomeCertRequest } from "./self-income-cert-request.model";
import { SpouseIncomeCertRequest } from "./spouse-income-cert-request.model";
import { StateGovernmentRequest } from "./state-government-request.model";
import { WorkStatusRequest } from "./work-status-request.model";
import { PmayRequest } from "./pmay-request.model";
import { HandicappedRequest } from "./handicapped-request.model";
import { AddressRequest } from "./address-request.model";
import { JournalistRequest } from "./journalist-request.model";
import { OldWinnerRequest } from "./old-winner-request.model";
import { EmailMobileRequest } from "./email-mobile-request.model";
import { FreedomfighterRequest } from "./freedomfighter-request.model";

export class QuestionRequest {
    constructor(
        public consentRequest?: ConsentRequest,
        public centralGovernmentRequest?: CentralGovernmentRequest,
        public maritalStatusRequest?: MaritalStatusRequest,
        public casteRequest?: CasteRequest,
        public stateGovernmentRequest?: StateGovernmentRequest,
        public mhadaEmployeeRequest?: MhadaEmployeeRequest,
        public divorceeRequest?: DivorceeRequest,
        public deathCertRequest?: DeathCertRequest,
        public workStatusRequest?: WorkStatusRequest,
        public itrInccertRequest?: ItrInccertRequest,
        public exServiceManRequest?: ExServiceManRequest,
        public domicileRequest?: DomicileRequest,
        public incomeCertRequest?: IncomeCertRequest,
        public selfIncomeCertRequest?: SelfIncomeCertRequest,
        public spouseIncomeCertRequest?: SpouseIncomeCertRequest,
        public castCertRequest?: CastCertRequest,
        public castValidRequest?: CastValidRequest,
        public projectAffectedPeopleRequest?: ProjectAffectedPeopleRequest,
        public papVanshavaliRequest?: PAPVanshavaliRequest,
        public papAwardCopyRequest?: PAPAwardCopyRequest,
        public papMetroCityDocumentRequest?: PAPMetroCityDocumentRequest,
        public mathadiKamgarRequest?: MathadiKamgarRequest,
        public religiousMinorityRequest?: ReligiousMinorityRequest,
        public pmayRequest?: PmayRequest,
        public handicappedRequest?: HandicappedRequest,
        public addressRequest?: AddressRequest,
        public journalistRequest?: JournalistRequest,
        public oldWinnerRequest?: OldWinnerRequest,
        public emailMobileRequest?: EmailMobileRequest,
        public freedomfighterRequest?: FreedomfighterRequest,
    ) { }
}
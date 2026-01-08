import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { ESignSelfDeclarationComponent } from "./e-sign-self-declaration/e-sign-self-declaration.component";
import { CancelledComponent } from "./external-apis/cancelled/cancelled.component";
import { ExternalApisComponent } from "./external-apis/external-apis.component";
import { FailureComponent } from "./external-apis/failure/failure.component";
import { SuccessComponent } from "./external-apis/success/success.component";
import { LandingComponent } from "./landing/landing.component";
import { EMudraComponent } from "./profile/e-mudra/e-mudra.component";
import { ProfileComponent } from "./profile/profile.component";
import { QuestionAnswerComponent } from "./question-answer/question-answer.component";

import { SelectBoardComponent } from "./pre-lottery/select-board/select-board.component";
import { SelectLotteryComponent } from "./pre-lottery/select-lottery/select-lottery.component";
import { SelectSchemeDetailComponent } from "./pre-lottery/select-scheme-detail/select-scheme-detail.component";
import { SelectSchemeComponent } from "./pre-lottery/select-scheme/select-scheme.component";
import { ApplicationComponent } from "./pre-lottery/application/application.component";
import { PaymentComponent } from "./pre-lottery/payment/payment.component";
import { PaymentVerificationComponent } from "./pre-lottery/payment-verification/payment-verification.component";
import { NocPaymentVerificationComponent } from "./pre-lottery/noc-payment-verification/noc-payment-verification.component";
import { InstallmentPaymentVerificationComponent } from "./pre-lottery/installment-payment-verification/installment-payment-verification.component";
import { NewsComponent } from "./pre-lottery/news/news.component";
import { HelpComponent } from "./pre-lottery/help/help.component";
import { ApplicationListComponent } from "./pre-lottery/application-list/application-list.component";
import { ApplicationDetailListComponent } from "./pre-lottery/application-detail-list/application-detail-list.component";
import { ApplicationDetailComponent } from "./pre-lottery/application-detail/application-detail.component";
import { AuthGuardService } from "./auth-guard/auth-guard.service";
import { NotificationsComponent } from "./notifications/notifications.component";
import { NocListComponent } from "./pre-lottery/noc/noc-list/noc-list.component";

import { MyGrievancesComponent } from "./grievance/lottory-user/my-grievances/my-grievances.component";
import { ViewGrievanceComponent } from "./grievance/lottory-user/view-grievance/view-grievance.component";
import { CreateGrievanceComponent } from "./grievance/lottory-user/create-grievance/create-grievance.component";
import { CreateObjectionSuggestionComponent } from "./grievance/lottory-user/objsuggestion/create-objection-suggestion/create-objection-suggestion.component";
import { MyObjectionSuggestionComponent } from "./grievance/lottory-user/objsuggestion/my-objection-suggestion/my-objection-suggestion.component";
import { ViewObjectionSuggestionComponent } from "./grievance/lottory-user/objsuggestion/view-objection-suggestion/view-objection-suggestion.component";
import { CertEntryPanValidateComponent } from "./cert-entry/pan-validation/cert-entry-pan-validate.component";
import { CertEntryEmailEntryComponent } from "./cert-entry/email-entry/cert-entry-email-entry.component";
import { CertEntryCategoryDashboardComponent } from "./cert-entry/category-dashboard/cert-entry-category-dashboard.component";
import { CertEntryCategoryAUVComponent } from "./cert-entry/category/auv/cert-entry-cat-auv.component";
import { LoginComponent } from "./authentication/login/login.component";
import { SignupComponent } from "./authentication/signup/signup.component";
import { ForgotPasswordComponent } from "./authentication/forgot-password/forgot-password.component";
import { QuickLinksComponent } from "./pre-lottery/quick-links/quick-links.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { DocumentsComponent } from "./documents/documents.component";
import { EditRefundDetailComponent } from "./pre-lottery/edit-refund-detail/edit-refund-detail.component";
import { AcceptedApplicationsComponent } from "./pre-lottery/accepted-applications/accepted-applications-lottery/accepted-applications-lottery.component";
import { AcceptedApplicationsSchemeComponent } from "./pre-lottery/accepted-applications/accepted-applications-scheme/accepted-applications-scheme.component";
import { AcceptedApplicationsCategoryComponent } from "./pre-lottery/accepted-applications/accepted-applications-category/accepted-applications-category.component";
import { DrawResultComponent } from "./pre-lottery/draw-result/draw-result.component";
import { ConfirmTenementComponent } from "./pre-lottery/confirm-tenement/confirm-tenement.component";
import { EsignVerifyComponent } from "./pre-lottery/e-sign-document/esign-verify.component";
import { InstallmentPaymentComponent } from "./pre-lottery/installment-payment/installment-payment.component";
import { SurrenderTenementComponent } from "./pre-lottery/surrender-tenement/surrender-tenement.component";
import { OldLotteryComponent } from "./pre-lottery/old-lottery/old-lottery.component";
import { DigiMultipleNameCheckComponent } from "./question-answer/digi-multiple-name-check/digi-multiple-name-check.component";
import { NocFormComponent } from "./pre-lottery/noc/noc-form/noc-form.component";
import { NocFormViewComponent } from "./pre-lottery/noc/noc-form-view/noc-form-view.component";
import { MyInstallmentsComponent } from "./pre-lottery/my-installments/my-installments.component";
import { NocFormEditComponent } from "./pre-lottery/noc/noc-form-edit/noc-form-edit.component";
import { NOCPaymentComponent } from "./pre-lottery/noc-payment/noc-payment.component";
import { TDSFileUploadComponent } from "./tds-file-upload/tds-file-upload.component";
import { VerifyDocumentScanComponent } from "./pre-lottery/verify-document/verify-document-scan.component";
import { ApplicantDetailComponent } from "./pre-lottery/applicant-detail-editing/applicant-editing.component";
import { CasteValidityRefLetterComponent } from "./pre-lottery/caste-validity-ref-letter/caste-validity-ref-letter.component";
import { PendingApplicantComponent } from "./pre-lottery/applicant-detail-editing/pending-applicant/pending-applicant-table.component";
import { BoardDocumentsComponent } from "./pre-lottery/board-documents/board-documents.component";
import { PossessionDetailsComponent } from "./pre-lottery/possession-details-entry/possession-details.component";
import { ApplicantHearingComponent } from "./pre-lottery/appeal-hearing/applicant-hearing.component";
import { ApplicantHearingViewComponent } from "./pre-lottery/appeal-hearing/appeal-hearing-view/applicant-hearing-view.component";
import { AppealHearingListComponent } from "./pre-lottery/appeal-hearing/appeal-hearing-list/appeal-hearing-list.component";
import { ApplicationOtherDocumentComponent } from "./pre-lottery/application-other-documents/application-other-document.component";
import { NocCancelRequestFormComponent } from "./pre-lottery/noc/noc-cancel-request-form/noc-cancel-request-form.component";
import { ApplicantRequestsComponent } from "./pre-lottery/requests/requests.component";
import { SurrenderRequestFormComponent } from "./pre-lottery/surrender-request-form/surrender-request-form.component";
import { ImportantListComponent } from "./pre-lottery/important-links/important-links.component";
import { RegistrationStepComponent } from "./registration-step/registration-step.component";
import { ProfileNewComponent } from "./profile-new/profile-new.component";
import { ApplicationDetailListComponents } from "./pre-lottery/application-detail-lists/application-detail-lists.component";
import { ApplicationBookHomeComponent } from "./pre-lottery/application-bookHome/application-bookHome.component";

const routes: Routes = [
  { path: "", component: LandingComponent },
 // { path: "", component: DocumentsComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "signIn", component: LoginComponent },
  { path: "signUp", component: SignupComponent },
  { path: "landing", component: LandingComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "contact-us", component: ContactUsComponent },
  // { path: "", component: LandingComponent },
  { path: "important-links", component: ImportantListComponent },
  { path: "newuser", component: SignupComponent },
  { 
    path: "registration-step", 
    component: RegistrationStepComponent,
    canActivate: [AuthGuardService]
  },

  {
    path: "question-answer",
    component: QuestionAnswerComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "multiple-name-check",
    component: DigiMultipleNameCheckComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "profile",
    component: ProfileNewComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "notifications",
    component: NotificationsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "my-grievances",
    component: MyGrievancesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "noc/noc-list",
    component: NocListComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "view-grievance/:myid",
    component: ViewGrievanceComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "raise-grievance",
    component: CreateGrievanceComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "create-objection-suggestion",
    component: CreateObjectionSuggestionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "my-objection-suggestion",
    component: MyObjectionSuggestionComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: "view-objection-suggestion/:myid",
    component: ViewObjectionSuggestionComponent,
    canActivate: [AuthGuardService],
  },
  // { path: "externalApis", component: ExternalApisComponent },
  // { path: "successStatus", component: SuccessComponent },
  // { path: "failureStatus", component: FailureComponent },
  // { path: "cancelledStatus", component: CancelledComponent },
  // { path: "eMudra", component: EMudraComponent },
  {
    path: "app",
    children: [
      {
        path: "select-board",
        component: SelectBoardComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "board-documents/:boardKey/:mode",
        component: BoardDocumentsComponent,
      },
      {
        path: "select-board/:mode",
        component: SelectBoardComponent,
      },
      {
        path: "select-lottery/:boardKey",
        component: SelectLotteryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "select-lottery/:boardKey/:mode",
        component: SelectLotteryComponent,
      },
      {
        path: "select-lottery",
        component: SelectLotteryComponent,
      },
      {
        path: "old-lottery",
        component: OldLotteryComponent,
      },
      {
        path: "quick-links",
        component: QuickLinksComponent,
      },
      {
        path: "select-scheme/:boardKey/:lotteryKey/:viewMode",
        component: SelectSchemeComponent,
      },
      {
        path: "scheme-detail/:boardKey/:lotteryKey/:schemeKey/:viewMode",
        component: SelectSchemeDetailComponent,
      },
      {
        path: "application/:boardKey/:lotteryKey/:schemeKey",
        component: ApplicationComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "payment/:applicationKey",
        component: PaymentComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: ":applicationKey/installments",
        component: MyInstallmentsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "installment-payment/:applicationKey/:installmentType",
        component: InstallmentPaymentComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "payment-verify/:transactionId",
        component: PaymentVerificationComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "noc-payment-verify/:transactionId",
        component: NocPaymentVerificationComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "installment-payment-verify/:transactionId",
        component: InstallmentPaymentVerificationComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "news",
        component: NewsComponent,
      },
      {
        path: "help",
        component: HelpComponent,
      },
      {
        path: "application-list",
        component: ApplicationListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "application-detail-list",
        component: ApplicationDetailListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "application-detail-list/:post",
        component: ApplicationDetailListComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "application-detail-lists",
        component: ApplicationDetailListComponents,
        canActivate: [AuthGuardService],
      },
      {
        path: "application-bookHome/:applicationKey",
        component: ApplicationBookHomeComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "application-detail-lists/:post",
        component: ApplicationDetailListComponents,
        canActivate: [AuthGuardService],
      },
      {
        path: "application-detail/:applicationKey",
        component: ApplicationDetailComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "application-detail/:applicationKey/:refund",
        component: ApplicationDetailComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "applicant-requests",
        component: ApplicantRequestsComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "surrender-request-form/:selectedRequestType/:applicationNo", 
        component: SurrenderRequestFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "edit-refund-detail/:applicationKey",
        component: EditRefundDetailComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "draw-result",
        component: DrawResultComponent,
      },
      {
        path: "noc/noc-form",
        component: NocFormComponent,
      },
      {
        path: "noc/noc-form-view/:mortNocKey",
        component: NocFormViewComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "noc/noc-cancel-request-form/:mortNocKey",
        component: NocCancelRequestFormComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "noc/noc-form-edit/:mortNocKey/EDIT",
        component: NocFormEditComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "noc-payment/:applicationKey",
        component: NOCPaymentComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: "tds-certificate/:applicationKey",
        component: TDSFileUploadComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "tds-certificate/:applicationKey/fetch",
        component: TDSFileUploadComponent,
        canActivate: [AuthGuardService],
      },

      {
        path: "accepted-applications",
        children: [
          {
            path: "accepted-applications-lottery",
            component: AcceptedApplicationsComponent,
          },
          {
            path: "accepted-applications-scheme/:lotteryKey",
            component: AcceptedApplicationsSchemeComponent,
          },
          {
            path: "accepted-applications-category/:lotteryKey/:schemeKey",
            component: AcceptedApplicationsCategoryComponent,
          },
        ],
      },
      {
        path: "confirm-tenement/:type",
        component: ConfirmTenementComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "confirm-tenement/:type/:applicationKey",
        component: ConfirmTenementComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "surrender-tenement/:type/:applicationKey",
        component: SurrenderTenementComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "esign-verify",
        component: EsignVerifyComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: "verify-scanned-qr",
        component: VerifyDocumentScanComponent,
      },
      {
        path: "applicant-detail-editing/:applicationNo",
        component: ApplicantDetailComponent,
      },
      {
        path: "pending-applicant/:applicationKey",
        component: PendingApplicantComponent,
      },
      {
        path: "applicant-detail-editing/:applicationNo/:selectedType/:status",
        component: ApplicantDetailComponent,
      },
      {
        path: "apply-for-caste-validity-ref-letter/:applicationKey",
        component: CasteValidityRefLetterComponent,
      },

      {
        path: "possession-details-entry/:applicationNo/:registrationKey",
        component: PossessionDetailsComponent,
      },
      {
        path: "apply-for-applicant-hearing/:type/:applicationKey",
        component: ApplicantHearingComponent,
      },
      {
        path: "appeal-hearing/applicant-hearing-view/:applicationKey/:appealType",
        component: ApplicantHearingViewComponent,
      },
      {
        path: "appeal-hearing/appeal-hearing-list/:appealType/:applicationKey",
        component: AppealHearingListComponent,
      },
      {
        path: "application-other-documents/:key",
        component: ApplicationOtherDocumentComponent,
      },
    ],
  },
  {
    path: "cert-entry",
    children: [
      {
        path: "pan-validation",
        component: CertEntryPanValidateComponent,
      },
      {
        path: "email-entry/:pan",
        component: CertEntryEmailEntryComponent,
      },
      {
        path: "category-dashboard/:pan",
        component: CertEntryCategoryDashboardComponent,
      },
      {
        path: "category/:pan/:category",
        component: CertEntryCategoryAUVComponent,
      },
    ],
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

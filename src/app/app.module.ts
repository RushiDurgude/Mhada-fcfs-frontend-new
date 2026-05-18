import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { LandingComponent } from "./landing/landing.component";
import { QuestionAnswerComponent } from "./question-answer/question-answer.component";
import { ProfileComponent } from "./profile/profile.component";
import { LoaderComponent } from "./loader/loader.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import { ESignSelfDeclarationComponent } from "./e-sign-self-declaration/e-sign-self-declaration.component";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { ExternalApisComponent } from "./external-apis/external-apis.component";
import { SuccessComponent } from "./external-apis/success/success.component";
import { FailureComponent } from "./external-apis/failure/failure.component";
import { CancelledComponent } from "./external-apis/cancelled/cancelled.component";
import { ViewDocumentComponent } from "./profile/view-document/view-document.component";
import { TranslocoRootModule } from "./transloco-root.module";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";

import { EMudraComponent } from "./profile/e-mudra/e-mudra.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { SelectBoardComponent } from "./pre-lottery/select-board/select-board.component";
import { SelectLotteryComponent } from "./pre-lottery/select-lottery/select-lottery.component";
import { SelectSchemeComponent } from "./pre-lottery/select-scheme/select-scheme.component";
import { SelectSchemeDetailComponent } from "./pre-lottery/select-scheme-detail/select-scheme-detail.component";
import { ApplicationComponent } from "./pre-lottery/application/application.component";
import { PaymentComponent } from "./pre-lottery/payment/payment.component";
import { PaymentVerificationComponent } from "./pre-lottery/payment-verification/payment-verification.component";
import { NewsComponent } from "./pre-lottery/news/news.component";
import { HelpComponent } from "./pre-lottery/help/help.component";
import { ImportantDatesComponent } from "./pre-lottery/important-dates/important-dates.component";
import { SwiperModule } from "swiper/angular";
import { NetworkInterface } from "@awesome-cordova-plugins/network-interface/ngx";
import { ViewESignedDocumentComponent } from "./profile/view-e-signed-document/view-e-signed-document.component";
import { LandingPopupComponent } from "./landing/landing-popup/landing-popup.component";
import { CustomSnackbarComponent } from "./question-answer/custom-snackbar/custom-snackbar.component";
import { CheckMhadaLotteryWinnerComponent } from "./question-answer/check-mhada-lottery-winner/check-mhada-lottery-winner.component";
import { InterceptorService } from "./interceptor.service";
import { MultipleNamesComponent } from "./question-answer/multiple-names/multiple-names.component";
import { ApplicationListComponent } from "./pre-lottery/application-list/application-list.component";
import { ApplicationStatusComponent } from "./pre-lottery/application-status/application-status.component";
import { FilterListComponent } from "./pre-lottery/filter-list/filter-list.component";
import { ApplicationDetailComponent } from "./pre-lottery/application-detail/application-detail.component";
import { ViewPdfComponent } from "./pre-lottery/view-pdf/view-pdf.component";
import { TermsAndConditionsComponent } from "./pre-lottery/terms-and-conditions/terms-and-conditions.component";
import { ChatbotComponent } from "./chatbot/chatbot.component";
import { DocumentManuallyRejectedComponent } from "./profile/document-manually-rejected/document-manually-rejected.component";
import { CropImageComponent } from "./question-answer/crop-image/crop-image.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { YoutubeHelpVideoComponent } from "./question-answer/youtube-help-video/youtube-help-video.component";
import { NotificationsComponent } from "./notifications/notifications.component";

import { NocListComponent } from "./pre-lottery/noc/noc-list/noc-list.component";
import { CreateGrievanceComponent } from "./grievance/lottory-user/create-grievance/create-grievance.component";
import { MyGrievancesComponent } from "./grievance/lottory-user/my-grievances/my-grievances.component";
import { ViewGrievanceComponent } from "./grievance/lottory-user/view-grievance/view-grievance.component";
import { DatePipe } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatSelectModule } from "@angular/material/select";
import { GrievanceDialogComponent } from "./grievance/grievance-dialog/grievance-dialog.component";
import { OtpDialogComponent } from "./grievance/otp-dialog/otp-dialog.component";
import { NgOtpInputModule } from "ng-otp-input";
import { DataTablesModule } from "angular-datatables";
import { ViewattachmentComponent } from "./grievance/viewattachment/viewattachment.component";
import { CreateObjectionSuggestionComponent } from "./grievance/lottory-user/objsuggestion/create-objection-suggestion/create-objection-suggestion.component";
import { MyObjectionSuggestionComponent } from "./grievance/lottory-user/objsuggestion/my-objection-suggestion/my-objection-suggestion.component";
import { ViewObjectionSuggestionComponent } from "./grievance/lottory-user/objsuggestion/view-objection-suggestion/view-objection-suggestion.component";
import { AttachmentErrorDialogComponent } from "./grievance/attachment-error-dialog/attachment-error-dialog.component";
import { GrievanceExistDialogComponent } from "./grievance/grievance-exist-dialog/grievance-exist-dialog.component";
import { CloseGrievanceDialogComponent } from "./grievance/close-grievance-dialog/close-grievance-dialog.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ObjectionSuccessDialogComponent } from "./grievance/objection-success-dialog/objection-success-dialog.component";
import { OsOtpDialogComponent } from "./grievance/os-otp-dialog/os-otp-dialog.component";
import { ImageModalComponent } from "./pre-lottery/select-scheme-detail/image-modal/image-modal.component";
import { FieldErrorComponent } from "./pre-lottery/field-error/field-error.component";
import { SignaturePadComponent } from "./pre-lottery/application/signature-pad/signature-pad.component";
import { ScreenOrientation } from "@awesome-cordova-plugins/screen-orientation/ngx";
import { CertEntryPanValidateComponent } from "./cert-entry/pan-validation/cert-entry-pan-validate.component";
import { CertEntryEmailEntryComponent } from "./cert-entry/email-entry/cert-entry-email-entry.component";
import { CertEntryCategoryDashboardComponent } from "./cert-entry/category-dashboard/cert-entry-category-dashboard.component";
import { CertEntryCategoryAUVComponent } from "./cert-entry/category/auv/cert-entry-cat-auv.component";
import { RecaptchaModule } from "ng-recaptcha";
import { InputCmpComponent } from "./cert-entry/category/auv/input-cmp/input-cmp.component";
import { SelectCmpComponent } from "./cert-entry/category/auv/select-cmp/select-cmp.component";
import { DatePickerCmpComponent } from "./cert-entry/category/auv/date-cmp/datepicker-cmp.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { TextareaCmpComponent } from "./cert-entry/category/auv/textarea-cmp/textarea-cmp.component";
import { FaqDialogComponent } from "../app/grievance/faq-dialog/faq-dialog.component";
import { AadharIntroVideoComponent } from "./question-answer/aadhar-intro-video/aadhar-intro-video.component";
import { AuthenticationComponent } from "./authentication/authentication/authentication.component";
import { LoginComponent } from "./authentication/login/login.component";
import { SignupComponent } from "./authentication/signup/signup.component";
import { ForgotPasswordComponent } from "./authentication/forgot-password/forgot-password.component";
import { GoogleAnalyticsService } from "./toolbar/google-analytics.service";
import { QuickLinksComponent } from "./pre-lottery/quick-links/quick-links.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { EnterItrDetailsComponent } from "./question-answer/enter-itr-details/enter-itr-details.component";
import { CertIssuingAuthorityComponent } from "./cert-entry/cert-issuing-authority/cert-issuing-authority.component";
import { BottomNavigationBarComponent } from "./bottom-navigation-bar/bottom-navigation-bar.component";
import { DocumentsComponent } from "./documents/documents.component";
import { EditRefundDetailComponent } from "./pre-lottery/edit-refund-detail/edit-refund-detail.component";
import { AcceptedApplicationsComponent } from "./pre-lottery/accepted-applications/accepted-applications-lottery/accepted-applications-lottery.component";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { AcceptedApplicationsSchemeComponent } from "./pre-lottery/accepted-applications/accepted-applications-scheme/accepted-applications-scheme.component";
import { AcceptedApplicationsCategoryComponent } from "./pre-lottery/accepted-applications/accepted-applications-category/accepted-applications-category.component";
import { ApplicationDetailListComponent } from "./pre-lottery/application-detail-list/application-detail-list.component";
import { DrawResultComponent } from "./pre-lottery/draw-result/draw-result.component";
import { LetterOfIntimationComponent } from "./pre-lottery/letter-of-intimation/letter-of-intimation.component";
//import { FileCmpComponent } from "./cert-entry/category/auv/file-cmp/file-cmp.component";
//import { RadioCmpComponent } from "./cert-entry/category/auv/radio-cmp/radio-cmp.component";
import { ConfirmTenementComponent } from "./pre-lottery/confirm-tenement/confirm-tenement.component";
import { EsignVerifyComponent } from "./pre-lottery/e-sign-document/esign-verify.component";
import { InstallmentPaymentComponent } from "./pre-lottery/installment-payment/installment-payment.component";
import { InstallmentPaymentVerificationComponent } from "./pre-lottery/installment-payment-verification/installment-payment-verification.component";
import { HasMultipleNamesComponent } from "./authentication/signup/has-multiple-names/has-multiple-names.component";
import { RefundDetailComponent } from "./pre-lottery/refund-detail/refund-detail.component";
import { SurrenderTenementComponent } from "./pre-lottery/surrender-tenement/surrender-tenement.component";
import { FileCmpComponent } from "./cert-entry/category/auv/file-cmp/file-cmp.component";
import { RadioCmpComponent } from "./cert-entry/category/auv/radio-cmp/radio-cmp.component";
import { OldLotteryComponent } from "./pre-lottery/old-lottery/old-lottery.component";
import { NocFormComponent } from "./pre-lottery/noc/noc-form/noc-form.component";
import { NocFormViewComponent } from "./pre-lottery/noc/noc-form-view/noc-form-view.component";
import { MyInstallmentsComponent } from "./pre-lottery/my-installments/my-installments.component";
import { DigiMultipleNameCheckComponent } from "./question-answer/digi-multiple-name-check/digi-multiple-name-check.component";
import { CurrencyINRPipe } from "./pre-lottery/pipes/currencyINR.pipe";
import { NocFormEditComponent } from "./pre-lottery/noc/noc-form-edit/noc-form-edit.component";
import { NOCPaymentComponent } from "./pre-lottery/noc-payment/noc-payment.component";
import { NocPaymentVerificationComponent } from "./pre-lottery/noc-payment-verification/noc-payment-verification.component";
import { SurrenderRemarkComponent } from "./pre-lottery/surrender-remark/surrender-remark.component";
import { FileUploadModalComponent } from "./pre-lottery/file-upload/file-upload-modal.component";
import { TDSFileUploadComponent } from "./tds-file-upload/tds-file-upload.component";
import { CorrigendumModalComponent } from "./pre-lottery/corrigendum-modal/corrigendum-modal.component";
import { VerifyDocumentScanComponent } from "./pre-lottery/verify-document/verify-document-scan.component";
import { VerifyScannedDocumentComponent } from "./pre-lottery/verify-document/scanned-doc/verify-scanned-document.component";
import { BlockCopyPasteDirective } from "./pre-lottery/util/block-copy-paste.directive";
import { ApplicantDetailComponent } from "./pre-lottery/applicant-detail-editing/applicant-editing.component";
import { PhotoUploadComponent } from "./pre-lottery/applicant-detail-editing/photo_upload/photo-upload.component";
import { MatRadioModule } from "@angular/material/radio";
import { MarriageStatusComponent } from "./pre-lottery/applicant-detail-editing/marriage-status/marriage-status.component";
import { CasteValidityRefLetterComponent } from "./pre-lottery/caste-validity-ref-letter/caste-validity-ref-letter.component";
import { ApplicantHearingComponent } from "./pre-lottery/appeal-hearing/applicant-hearing.component";
import { AppealHearingListComponent } from "./pre-lottery/appeal-hearing/appeal-hearing-list/appeal-hearing-list.component";
import { ApplicantHearingViewComponent } from "./pre-lottery/appeal-hearing/appeal-hearing-view/applicant-hearing-view.component";
import { NumbersOnlyDirective } from "./pre-lottery/util/number-only";
import { PendingApplicantComponent } from "./pre-lottery/applicant-detail-editing/pending-applicant/pending-applicant-table.component";
import { NumbersWithFloatOnlyDirective } from "./pre-lottery/util/number-only-with-float";
import { NumberTwoDigitUptoTwelveOnlyDirective } from "./pre-lottery/util/number-two-digit-upto-twelve-only";
import { NumberTwoDigitOnlyDirective } from "./pre-lottery/util/number-two-digit-only";
import { FloatOnlyDirective } from "./pre-lottery/util/float-only";
import { BoardDocumentsComponent } from "./pre-lottery/board-documents/board-documents.component";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { PossessionDetailsComponent } from "./pre-lottery/possession-details-entry/possession-details.component";
import { MatCardModule } from "@angular/material/card";
import { ApplicationOtherDocumentComponent } from "./pre-lottery/application-other-documents/application-other-document.component";
import { NocCancelRequestFormComponent } from "./pre-lottery/noc/noc-cancel-request-form/noc-cancel-request-form.component";
import { FileUploadWithRemarkModalComponent } from "./pre-lottery/file-upload-with-remark/file-upload-with-remark-modal.component";
import { ViewPossessionPdfComponent } from "./pre-lottery/possession-details-entry/view-possession-pdf/view-pdf.component";
import { ApplicantRequestsComponent } from "./pre-lottery/requests/requests.component";
import { SurrenderRequestFormComponent } from "./pre-lottery/surrender-request-form/surrender-request-form.component";
import { ImportantListComponent } from "./pre-lottery/important-links/important-links.component";
import { MatDividerModule } from "@angular/material/divider"; // Import MatDividerModule
import { RegistrationStepComponent } from "./registration-step/registration-step.component";
import { QsConsentComponent } from "./registration-step/qs-consent/qs-consent.component";
import { YoutubeHelpVideoNewComponent } from "./registration-step/youtube-help-video-new/youtube-help-video-new.component";
import { QsCentralComponent } from "./registration-step/qs-central/qs-central.component";
import { FileUploadCmp } from "./registration-step/file-upload-cmp/file-upload-cmp.component";
import { QsMaritalComponent } from "./registration-step/qs-marital/qs-marital.component";
import { QsStateComponent } from "./registration-step/qs-state/qs-state.component";
import { QsMhadaComponent } from "./registration-step/qs-mhada/qs-mhada.component";
import { QsDivorceeComponent } from "./registration-step/qs-divorcee/qs-divorcee.component";
import { QsDeathCertComponent } from "./registration-step/qs-death-cert/qs-death-cert.component";
import { QsWorkStatusComponent } from "./registration-step/qs-work-status/qs-work-status.component";
import { QsItrInccertComponent } from "./registration-step/qs-itr-inccert/qs-itr-inccert.component";
import { QsExServiceManComponent } from "./registration-step/qs-ex-service-man/qs-ex-service-man.component";
import { QsDomcileComponent } from "./registration-step/qs-domicle/qs-domicle.component";
import { QsSelfItrComponent } from "./registration-step/qs-self-itr/qs-self-itr.component";
import { QsSpouseItrComponent } from "./registration-step/qs-spouse-itr/qs-spouse-itr.component";
import { QsIncomeCertComponent } from "./registration-step/qs-income-cert/qs-income-cert.component";
import { QsSelfIncomeCertComponent } from "./registration-step/qs-self-income-cert/qs-self-income-cert.component";
import { QsSpouseIncomeCertComponent } from "./registration-step/qs-spouse-income-cert/qs-spouse-income-cert.component";
import { QsCasteComponent } from "./registration-step/qs-caste/qs-caste.component";
import { QsCastCertComponent } from "./registration-step/qs-cast-cert/qs-cast-cert.component";
import { QsCastValidityComponent } from "./registration-step/qs-cast-valid/qs-cast-valid.component";
import { ProfileNewComponent } from "./profile-new/profile-new.component";
import { QsAadhaarPanComponent } from "./registration-step/qs-aadhaar-pan/qs-aadhaar-pan.component";
import { QsMultiNameComponent } from "./registration-step/qs-multi-name/qs-multi-name.component";
import { QsSpouseAadhaarComponent } from "./registration-step/qs-spouse-aadhaar/qs-spouse-aadhaar.component";
import { QsSpousePanComponent } from "./registration-step/qs-spouse-pan/qs-spouse-pan.component";
import { PdfUploadCmp } from "./registration-step/pdf-upload-cmp/pdf-upload-cmp.component";
import { QsAddressComponent } from "./registration-step/qs-address/qs-address.component";
import { QsJournalistComponent } from "./registration-step/qs-journalist/qs-journalist.component";
import { QsPmayComponent } from "./registration-step/qs-pmay/qs-pmay.component";
import { ViewDocumentNewComponent } from "./profile/view-document-new/view-document-new.component";
import { QsRMComponent } from "./registration-step/qs-rm/qs-rm.component";
import { QsMHComponent } from "./registration-step/qs-mh/qs-mh.component";
import { QsPAPComponent } from "./registration-step/qs-pap/qs-pap.component";
import { QsPAPMetroCityDocumentComponent } from "./registration-step/qs-pap-metro-city-document/qs-pap-metro-city-document.component";
import { QsPAPAwardCopyComponent } from "./registration-step/qs-pap-award-copy/qs-pap-award-copy.component";
import { QsPAPVanshavaliComponent } from "./registration-step/qs-pap-vanshavali/qs-pap-vanshavali.component";
import { QsHandicappedComponent } from "./registration-step/qs-handicapped/qs-handicapped.component";
import { QsOldWinnerComponent } from "./registration-step/qs-old-winner/qs-old-winner.component";
import { QsEmailMobileComponent } from "./registration-step/qs-email-mobile/qs-email-mobile.component";
import { QsSpouseOldWinnerComponent } from "./registration-step/qs-spouse-old-winner/qs-spouse-old-winner.component";
import { ZoomedImageModalComponent } from "./zoom-image/zoomed.component";
import { ApplicationDetailListComponents } from "./pre-lottery/application-detail-lists/application-detail-lists.component";
import { ApplicationBookHomeComponent } from "./pre-lottery/application-bookHome/application-bookHome.component";
import { NocOtpComponent } from "./pre-lottery/noc-otp/noc-otp.component";
import { ApplicationBookPlotComponent } from "./pre-lottery/application-bookPlot/application-bookPlot.component";

// import { HTTP } from "@ionic-native/http/ngx";
@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LandingComponent,
    QuestionAnswerComponent,
    ProfileComponent,
    LoaderComponent,
    ESignSelfDeclarationComponent,
    ExternalApisComponent,
    SuccessComponent,
    FailureComponent,
    CancelledComponent,
    ViewDocumentComponent,
    EMudraComponent,

    SelectBoardComponent,
    SelectLotteryComponent,
    SelectSchemeComponent,
    SelectSchemeDetailComponent,
    ApplicationComponent,
    PaymentComponent,
    PaymentVerificationComponent,
    NewsComponent,
    HelpComponent,
    ImportantDatesComponent,
    ViewESignedDocumentComponent,
    LandingPopupComponent,
    CustomSnackbarComponent,
    CheckMhadaLotteryWinnerComponent,
    MultipleNamesComponent,
    ApplicationListComponent,
    ApplicationStatusComponent,
    FilterListComponent,
    ApplicationDetailComponent,
    ViewPdfComponent,
    TermsAndConditionsComponent,
    ChatbotComponent,
    DocumentManuallyRejectedComponent,
    CropImageComponent,
    YoutubeHelpVideoComponent,
    NotificationsComponent,
    ViewattachmentComponent,
    MyGrievancesComponent,
    ViewGrievanceComponent,
    CreateGrievanceComponent,
    GrievanceDialogComponent,
    TDSFileUploadComponent,
    OtpDialogComponent,
    CreateObjectionSuggestionComponent,
    MyObjectionSuggestionComponent,
    ViewObjectionSuggestionComponent,
    GrievanceExistDialogComponent,
    CloseGrievanceDialogComponent,
    AttachmentErrorDialogComponent,
    ObjectionSuccessDialogComponent,
    OsOtpDialogComponent,
    FileUploadModalComponent,
    ImageModalComponent,
    FieldErrorComponent,
    SignaturePadComponent,
    CertEntryPanValidateComponent,
    CertEntryEmailEntryComponent,
    CertEntryCategoryDashboardComponent,
    CertEntryCategoryAUVComponent,
    InputCmpComponent,
    SelectCmpComponent,
    DatePickerCmpComponent,
    TextareaCmpComponent,
    FaqDialogComponent,
    AadharIntroVideoComponent,
    AuthenticationComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    QuickLinksComponent,
    ContactUsComponent,
    PrivacyPolicyComponent,
    EnterItrDetailsComponent,
    CertIssuingAuthorityComponent,
    BottomNavigationBarComponent,
    DocumentsComponent,
    EditRefundDetailComponent,
    AcceptedApplicationsComponent,
    AcceptedApplicationsSchemeComponent,
    AcceptedApplicationsCategoryComponent,
    ApplicationDetailListComponent,
    DrawResultComponent,
    LetterOfIntimationComponent,
    //FileCmpComponent,
    //RadioCmpComponent,
    ConfirmTenementComponent,
    EsignVerifyComponent,
    InstallmentPaymentComponent,
    InstallmentPaymentVerificationComponent,
    HasMultipleNamesComponent,
    RefundDetailComponent,
    SurrenderTenementComponent,
    FileCmpComponent,
    RadioCmpComponent,
    OldLotteryComponent,
    NocListComponent,
    NocFormComponent,
    NocFormViewComponent,
    MyInstallmentsComponent,
    DigiMultipleNameCheckComponent,
    CurrencyINRPipe,
    NocFormEditComponent,
    SurrenderRemarkComponent,
    NOCPaymentComponent,
    NocPaymentVerificationComponent,
    CorrigendumModalComponent,
    VerifyDocumentScanComponent,
    VerifyScannedDocumentComponent,
    BlockCopyPasteDirective,
    ApplicantDetailComponent,
    PhotoUploadComponent,
    MarriageStatusComponent,
    CasteValidityRefLetterComponent,
    ApplicantHearingComponent,
    AppealHearingListComponent,
    ApplicantHearingViewComponent,
    CasteValidityRefLetterComponent,
    PendingApplicantComponent,
    NumbersOnlyDirective,
    NumbersWithFloatOnlyDirective,
    NumberTwoDigitUptoTwelveOnlyDirective,
    NumberTwoDigitOnlyDirective,
    FloatOnlyDirective,
    BoardDocumentsComponent,
    PossessionDetailsComponent,
    ViewPossessionPdfComponent,
    ApplicationOtherDocumentComponent,
    NocCancelRequestFormComponent,
    FileUploadWithRemarkModalComponent,
    ApplicantRequestsComponent,
    SurrenderRequestFormComponent,
    ImportantListComponent,
    RegistrationStepComponent,
    YoutubeHelpVideoNewComponent,
    QsConsentComponent,
    QsCentralComponent,
    FileUploadCmp, 
    PdfUploadCmp, 
    QsMaritalComponent,
    QsStateComponent,
    QsMhadaComponent,
    QsDivorceeComponent,
    QsDeathCertComponent,
    QsWorkStatusComponent,
    QsItrInccertComponent,
    QsExServiceManComponent,
    QsDomcileComponent,
    QsSelfItrComponent,
    QsSpouseItrComponent,
    QsIncomeCertComponent,
    QsSelfIncomeCertComponent,
    QsSpouseIncomeCertComponent,
    QsCasteComponent,
    QsCastCertComponent,
    QsCastValidityComponent,
    ProfileNewComponent,
    QsAadhaarPanComponent,
    QsMultiNameComponent,
    QsSpouseAadhaarComponent,
    QsSpousePanComponent,
    QsAddressComponent,
    QsJournalistComponent,
    QsPmayComponent,
    ViewDocumentNewComponent,
    QsRMComponent,
    QsMHComponent,
    QsPAPComponent,
    QsPAPMetroCityDocumentComponent,
    QsPAPAwardCopyComponent,
    QsPAPVanshavaliComponent,
    QsHandicappedComponent,
    QsOldWinnerComponent,
    QsEmailMobileComponent,
    QsSpouseOldWinnerComponent,
    ZoomedImageModalComponent,
    ApplicationDetailListComponents,
    ApplicationBookHomeComponent,
    ApplicationBookPlotComponent,
    NocOtpComponent,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    HttpClientModule,
    MatExpansionModule,
    MatButtonModule,
    PdfViewerModule,
    ReactiveFormsModule,
    FormsModule,
    TranslocoRootModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule,
    ImageCropperModule,
    SwiperModule,

    MatInputModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    NgOtpInputModule,
    DataTablesModule,
    MatCheckboxModule,
    RecaptchaModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DragDropModule,
    MatTabsModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatRadioModule,
    MatCardModule,
    MatDividerModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    BarcodeScanner,
    FileOpener,
    DatePipe,
    MyGrievancesComponent,
    MyObjectionSuggestionComponent,
    InAppBrowser,
    ScreenOrientation,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    NetworkInterface,
    // HTTP,
    GoogleAnalyticsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

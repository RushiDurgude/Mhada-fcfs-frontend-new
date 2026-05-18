import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { ProfileService } from "src/app/profile/profile.service";
import { SharedService } from "src/app/toolbar/shared.service";
import { AcceptSurrenderTenementWrapperModal } from "../models/acceptsurrendertenementwrappermodal";
import { AnnouncementModel } from "../models/announcment.model";
import { ApplicationFormModel } from "../models/application-form.model";
import { ApplicationInsModel } from "../models/application-installment.model";
import { ApplicationListItemModel } from "../models/application-list-item.model";
import { ApplicationListWrapper } from "../models/application-list-wrapper";
import { ApplicationRefundFormModel } from "../models/application-refund-form.model";
// import { ApplicationListItemModel } from "../models/application-list-item.model";
import { ApplicationModel } from "../models/application.model";
import { BankResponseModel } from "../models/bank-response.model";
import { BoardModel } from "../models/board.model";
import { CategoryWrapperForAcceptedApplications } from "../models/category-wrapper-for-accepted-applications";
import { CategoryResponseModel } from "../models/CategoryResponseModel";
import { LotteryCategoryModel } from "../models/lottery-category.model";
import { LotteryModel } from "../models/lottery.model";
import { LotteryResponseModel } from "../models/LotteryResponseModel";
import { Page } from "../models/Page";
import { PaymentGatewayListWrapperModel } from "../models/payment-gateway-list-wrapper.model";
import { PaymentTransactionResponseModel } from "../models/payment-transaction-model";
import { PaymentVerifyResponseModel } from "../models/payment-verify-response.model";
import { RegistrationLOIModel } from "../models/RegistrationLOIModel";
import { SchemeWrapperForAcceptedApplications } from "../models/scheme-wrapper-for-accepted-applications";
import { SchemeModel } from "../models/scheme.model";
import { SchemeResponseModel } from "../models/SchemeResponseModel";
import { SelfReconciliationResponse } from "../models/self-reconciliation-response.model";
import { NocGenerationFormModel } from "../models/noc-generation-form.model";
import { ApplicationDetailsForNocFormModel } from "../models/application-details-for-noc-form-model";
import { NocRequestModel } from "../models/NocRequestModel";
import { ApplicationNocListModel } from "../models/application-noc-list-model";
import { NocListWrapper } from "../models/noc-list-wrapper";
import { NocViewDetailsFormModel } from "../models/noc-view-details-form.model";
import { InstallmentListWrapper } from "../models/installment-list-wrapper";
import { NocEditRequestModel } from "../models/NocEditRequestModel";
import { TDSDetailsForApplicationModel } from "../models/tds-details-for-application";
import { ScannedDocWrapperResponseModel } from "../models/scanned-doc-wrapper.model";
import { CorrigendumRequestModal } from "../models/CorrigendumRequestModel";
import { CasteValidityRefLetterInitResponseModel } from "../models/caste-validity-ref-letter-init-response.model";
import { AppealApplicationFormModel } from "../models/appeal-application-form.model";
import { ApplicantEditingDetailModel } from "../models/ApplicantEditingDetailModel";
import { ApplicantMarriageStatusModel } from "../models/ApplicantMarriageStatusModel";
import { BoardDocumentModel } from "../models/board-document-model";
import { PossessionDetailModel } from "../models/PossessionDetailModel";
import { ApplicationOtherDocumentModel } from "../models/applicationOtherDocumentModel";
import { SystemConfigModal } from "../models/systemConfigModel";
import { SurrenderRequestWrapperFormModel } from "../models/surrenderRequestFormModel";
import { importantLinkModal } from "../models/importantLinks.modal";
import { SelfandSpouseNameModel } from "../models/SelfandSpouseNameModel";
import { FloorTenementModel } from "../models/FloorTenementModel";
import { BuildingListModel } from "../models/BuildingListModel";
import { environment } from "src/environments/environment";

//export const api_url = "https://demoilmsservice1.mhada.gov.in";
//export const api_url = "https://appro.mhada.gov.in";
export const api_url = environment.APPLICATION_URL;
//export const api_url = "http://103.11.152.158:7020";


@Injectable({
  providedIn: "root",
})
export class PreLotteryApplicationService {
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private translocoService: TranslocoService,
    private router: Router,
    private profileService: ProfileService,
    private sharedService: SharedService,
    private _snackBar: MatSnackBar
  ) {}

  fetchBoardsForApplying() {
    return this.http.get<{
      boards: BoardModel[];
      status: string;
      errorMessage: string;
    }>(api_url + "/apply");
  }

  fetchBoardDocumentsForBoard(boardKey: number) {
    return this.http.get<{
      boardDocuments: BoardDocumentModel[];
      status: string;
      errorMessage: string;
    }>(api_url + "/guest/fetch-board-documents/" + boardKey);
  }

  fetchActiveBoards() {
    return this.http.get<{
      boards: BoardModel[];
      status: string;
      errorMessage: string;
    }>(api_url + "/guest/fetch-active-boards");
  }

  fetchActiveNews() {
    return this.http.get<AnnouncementModel[]>(
      api_url + "/guest/announcements/news"
    );
  }

  fetchActiveHelp() {
    return this.http.get<AnnouncementModel[]>(
      api_url + "/guest/announcements/help"
    );
  }

  fetchActiveHelpCidco() {
    return this.http.get<AnnouncementModel[]>(
      api_url + "/guest/announcements/help/mhada"
    );
  }

  // fetchActiveHelpPmrda() {
  //   return this.http.get<AnnouncementModel[]>(
  //     api_url + "/guest/announcements/help/pmrda"
  //   );
  // }

  // fetchActiveHelpMumbai() {
  //   return this.http.get<AnnouncementModel[]>(
  //     api_url + "/guest/announcements/help/mumbai"
  //   );
  // }

  // fetchActiveHelpKonkan() {
  //   return this.http.get<AnnouncementModel[]>(
  //     api_url + "/guest/announcements/help/konkan"
  //   );
  // }

  // fetchActiveHelpPune() {
  //   return this.http.get<AnnouncementModel[]>(
  //     api_url + "/guest/announcements/help/pune"
  //   );
  // }

  // fetchActiveHelpAurangabad() {
  //   return this.http.get<AnnouncementModel[]>(
  //     api_url + "/guest/announcements/help/aurangabad"
  //   );
  // }

  // fetchActiveHelpNashik() {
  //   return this.http.get<AnnouncementModel[]>(
  //     api_url + "/guest/announcements/help/nashik"
  //   );
  // }

  // fetchActiveHelpNagpur() {
  //   return this.http.get<AnnouncementModel[]>(
  //     api_url + "/guest/announcements/help/nagpur"
  //   );
  // }

  // fetchActiveHelpMhada_CDP() {
  //   return this.http.get<AnnouncementModel[]>(
  //     api_url + "/guest/announcements/help/mhada_CDP"
  //   );
  // } 

  fetchQuickLinkWithFilter(data : string) {
    return this.http.get<AnnouncementModel[]>(
      api_url + "/guest/announcements/help/common/" + data
    );
  } 

  fetchLotteriesForBoardForApplying(boardKey: number) {
    return this.http.get<{
      lotteryList: LotteryModel[];
      status: string;
      errorMessage: string;
    }>(api_url + "/apply/board/" + boardKey);
  }

  fetchSchemesForLotteryForApplying(lotteryKey: number) {
    return this.http.get<{
      schemeList: SchemeModel[];
      status: string;
      errorMessage: string;
    }>(api_url + "/apply/lottery/" + lotteryKey);
  }

  fetchGuestSchemesForLotteryForApplying(lotteryKey: number) {
    return this.http.get<{
      schemeList: SchemeModel[];
      status: string;
      errorMessage: string;
    }>(api_url + "/guest/apply/lottery/" + lotteryKey);
  }

  fetchSchemeForLotterySchemeForApplying(schemeKey: number) {
    return this.http.get<SchemeModel>(
      api_url + "/apply/scheme-detail/" + schemeKey
    );
  }

  fetchSchemeForLotterySchemeForGuest(schemeKey: number) {
    return this.http.get<SchemeModel>(
      api_url + "/guest/apply/scheme-detail/" + schemeKey
    );
  }

  fetchApplicationFormInit(schemeKey: number) {
    return this.http.get<ApplicationFormModel>(
      api_url + "/apply/scheme/" + schemeKey
    );
  }

  fetchApplicationForEditRefund(applicationKey: number) {
    return this.http.get<ApplicationRefundFormModel>(
      api_url + "/apply/fetch-application-refund/" + applicationKey
    );
  }

  fetchBankDetailsForIFSC(ifsc: string) {
    return this.http.get<BankResponseModel>(
      api_url + "/apply/fetch-bank/" + ifsc
    );
  }

  fetchAcceptSurrenderTenementList(appKey: number) {
    return this.http.get<AcceptSurrenderTenementWrapperModal>(
      api_url + "/confirm/accept/" + appKey
    );
  }

  fetchSurrenderTenementDetails(appKey: number) {
    return this.http.get<AcceptSurrenderTenementWrapperModal>(
      api_url + "/confirm/surrenders/" + appKey
    );
  }
  saveConfirmTenementOld(type: string, acceptAppKey: number) {
    let reqParams = acceptAppKey ? `?acceptAppKey=${acceptAppKey}` : "";

    return this.http.get<{ status: string; errorMessage: string; url: string }>(
      api_url + "/confirmAcceptSurrenderScreen/" + type + reqParams
    );
  }
  
  saveConfirmTenement(type: string, acceptAppKey: number, selfAadhaarPanData : any) {
    let reqParams = acceptAppKey ? `?acceptAppKey=${acceptAppKey}` : "";

    return this.http.post<{ status: string; errorMessage: string; url: string }>(
      api_url + "/confirmAcceptSurrenderScreen/" + type + reqParams,selfAadhaarPanData
    );
  }

  sendOtpForSurrender(appKey: number) {
    return this.http.get<{
      otpSentMessage: string;
      authEncryped: string;
      status: string;
      errorMessage: string;
    }>(api_url + "/confirm/surrenders-sendotp/" + appKey);
  }

  regenerateOtpForSurrender(appKey: number, authEncryped: string) {
    return this.http.post<{
      otpSentMessage: string;
      authEncryped: string;
      status: string;
      errorMessage: string;
    }>(api_url + "/confirm/surrenders-regenotp/" + appKey, authEncryped);
  }

  saveSurrenderTenement(
    type: string,
    surrenderAppKey: number,
    remark: string,
    enteredOtp: string,
    authEncrypted: string
  ) {
    console.log(surrenderAppKey);
    let reqParams = `?surrenderAppKey=${surrenderAppKey}`;
    return this.http.post<{
      status: string;
      errorMessage: string;
      url: string;
    }>(api_url + "/confirmSurrenderTenementScreen/surrender" + reqParams, {
      remark,
      enteredOtp,
      authEncrypted,
    });
  }

  saveRevertSurrenderTenement(key: number, remark: string) {
    console.log(key);
    let reqParams = `?key=${key}`;
    return this.http.post<{
      status: string;
      errorMessage: string;
      url: string;
    }>(api_url + "/revert-surrendered-tenement/" + reqParams, remark);
  }

  saveApplicationForm(
    schemeKey: number,
    lotteryCategoryKey: number,
    havingMCGMArea: string,
    mcgmAreaDtl: string,
    refundMode: string,
    nameAsOnBank: string,
    bankAccountNo: string,
    ifsc: string,
    // nomineeDetailArray: {nomineePriority: number, nomineeName: string, nomineeRelationship: string}[],
    nomineeName: string,
    nomineeRelationship: string,
    nomineeMobileNumber: string,
    nomineeEmailId: string,
    signature: string,
    isTenementAllotted: string,
    isTenementSurrender: string,
    uploadedBankChequePassbookFile: string | ArrayBuffer,
    selectedAgency: string,
    couponCode: string
  ) {
    return this.http.post<ApplicationModel>(
      api_url + "/apply/scheme/" + schemeKey,
      {
        lotteryCategoryKey,
        havingMCGMArea,
        mcgmAreaDtl,
        //    mcgmAreaDtl: havingMCGMArea === "Y" ? mcgmAreaDtl : null,
        refundMode,
        nameAsOnBank,
        bankAccountNo,
        ifsc,
        // nomineeDetailArray,
        nomineeName,
        nomineeRelationship,
        nomineeMobileNumber,
        nomineeEmailId,
        signature,
        isTenementAllotted,
        isTenementSurrender,
        uploadedBankChequePassbookFile,
        selectedAgency,
        couponCode
      }
    );
  }

  saveApplicationRefundDetail(
    applicationKey: number,
    refundMode: string,
    nameAsOnBank: string,
    bankAccountNo: string,
    ifsc: string,
    uploadedBankChequePassbookFile: string | ArrayBuffer
  ) {
    return this.http.post<ApplicationModel>(
      api_url + "/apply/fetch-application-refund/" + applicationKey,
      {
        refundMode,
        nameAsOnBank,
        bankAccountNo,
        ifsc,
        uploadedBankChequePassbookFile,
      }
    );
  }

  fetchInitForCasteValidityRefLetter(applicationKey: number) {
    return this.http.get<CasteValidityRefLetterInitResponseModel>(
      api_url + "/init-caste-validty-ref-letter/" + applicationKey
    );
  }

  applyForCasteValidityRefLetter(
    applicationKey: number,
    districtName: string,
    nameBfrMarrg: string,
    nameAftrMarrg: string,
    mrriageNameChangeFile: string | ArrayBuffer
  ) {
    return this.http.post<{ status: string; errorMessage: string }>(
      api_url + "/caste-validty-ref-letter/" + applicationKey,
      {
        districtName,
        nameBfrMarrg,
        nameAftrMarrg,
        mrriageNameChangeFile,
      }
    );
  }

  downloadCasteValidityRefLetter(applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/download-caste-validity-ref-letter/" + applicationKey);
  }

  payForApplicationInitForm(applicationKey: number) {
    return this.http.get<ApplicationModel>(
      api_url + "/apply/pay/" + applicationKey
    );
  }

  payForNocForm(applicationKey: number) {
    return this.http.get<ApplicationModel>(
      api_url + "/apply/payForNoc/" + applicationKey
    );
  }

  showPaymentGateway(applicationKey: number) {
    return this.http.get<PaymentGatewayListWrapperModel>(
      api_url + "/apply/pay/" + applicationKey + "/show-pg"
    );
  }

  showNocPaymentGateway(applicationKey: number) {
    return this.http.get<PaymentGatewayListWrapperModel>(
      api_url + "/apply/pay/" + applicationKey + "/show-noc-pg"
    );
  }

  //Paytm
  // payForApplication(applicationKey: number) {
  //   return this.http.get<PaymentIntentModel>(api_url + "/apply/payment-request/" + applicationKey);
  // }

  payForApplication(applicationKey: number, pg: string) {
    return this.http.get<PaymentTransactionResponseModel>(
      api_url + "/apply/create-transaction/" + applicationKey + "/" + pg
    );
  }

  payForNocApplication(applicationKey: number, pg: string) {
    return this.http.get<PaymentTransactionResponseModel>(
      api_url + "/apply/create-noc-transaction/" + applicationKey + "/" + pg
    );
  }

  getPaymentUrl(res: PaymentTransactionResponseModel) {
    return api_url + "/pg/payment-request/" + res.transactionId;
  }

  getNocPaymentUrl(res: PaymentTransactionResponseModel) {
    return api_url + "/pg/noc-payment-request/" + res.transactionId;
  }

  getInstallmentPaymentUrl(res: PaymentTransactionResponseModel) {
    return api_url + "/pg/ins-payment-request/" + res.transactionId;
  }

  verifyPayment(transactionId: string) {
    return this.http.get<PaymentVerifyResponseModel>(
      api_url + "/apply/pay-verify/" + transactionId
    );
  }

  verifyNocPayment(transactionId: string) {
    return this.http.get<PaymentVerifyResponseModel>(
      api_url + "/apply/noc-pay-verify/" + transactionId
    );
  }

  verifyInstallmentPayment(transactionId: string) {
    return this.http.get<PaymentVerifyResponseModel>(
      api_url + "/apply/ins-pay-verify/" + transactionId
    );
  }

  fetchApplicationList() {
    return this.http.get<ApplicationListItemModel[]>(api_url + "/applications");
  }

  searchDrawResult(applicationNo: any) {
    return this.http.post<ApplicationListItemModel>(
      api_url + "/guest/draw-result/" + applicationNo,
      null
    );
  }

  uploadTDSCertificateFile(
    applicationKey: number,
    qbFile: string | ArrayBuffer,
    asFile: string | ArrayBuffer,
    form16BFile: string | ArrayBuffer,
    challanFile: string | ArrayBuffer
  ) {
    return this.http.post<{ status: string; errorMessage: string }>(
      api_url + "/application/uploadTDSCertificate/" + applicationKey,
      {
        qbFile,
        asFile,
        form16BFile,
        challanFile,
      }
    );
  }
  uploadAppealDetails(
    applicationKey: number,
    appealLetterFile: string | ArrayBuffer,
    additionalDocumentFile: string | ArrayBuffer,
    applicationNo: string,
    applicantName: string,
    remark: string,
    additionalDocument: string,
    appealLetter: string,
    appealType: string
  ) {
    return this.http.post<{ status: string; errorMessage: string }>(
      api_url + "/apply/save/" + applicationKey,
      {
        appealLetterFile,
        additionalDocumentFile,
        remark,
        applicationNo,
        applicantName,
        additionalDocument,
        appealLetter,
        appealType,
      }
    );
  }
  fetchApplicationDetailsList() {
    return this.http.get<ApplicationListItemModel[]>(
      api_url + "/applications/applicationList"
    );
  }

  fetchLOIs(page: number, size: number) {
    let reqParams = `?page=${page}&size=${size}`;
    return this.http.get<Page<RegistrationLOIModel>>(
      api_url + "/applications/applicationListForLoi" + reqParams
    );
  }

  fetchApplicationDetailsLists(page: number, size: number, filterText: any) {
    let reqParams =
      `?page=${page}&size=${size}` +
      (filterText ? `&filterText=${filterText}` : "");
    return this.http.get<ApplicationListWrapper>(
      api_url + "/applications/applicationList" + reqParams
    );
  }

  fetchInstallmentsForApplication(key: number, page: number, size: number) {
    let reqParams = `?page=${page}&size=${size}`;
    return this.http.get<InstallmentListWrapper>(
      api_url + "/applications/" + key + "/installments" + reqParams
    );
  }

  fetchApplicationDetail(applicationKey: number) {
    return this.http.get<ApplicationListItemModel>(
      api_url + "/applications/" + applicationKey
    );
  }

  fetchActiveLotteries() {
    return this.http.get<LotteryModel[]>(
      api_url + "/guest/fetch-active-lotteries"
    );
  }

  fetchOldLotteries() {
    return this.http.get<LotteryModel[]>(
      api_url + "/guest/fetch-old-lotteries"
    );
  }

  fetchLotteryListForAcceptedApplications(
    page: number,
    size: number,
    filterText?: string
  ) {
    let reqParams =
      `?page=${page}&size=${size}` +
      (filterText ? `&filterText=${filterText}` : "");
    console.log(reqParams, page, size);
    return this.http.get<Page<LotteryResponseModel>>(
      api_url + "/guest/accepted-applications" + reqParams
    );
  }

  fetchSchemeListForAcceptedApplications(
    lotteryKey: number,
    page: number,
    size: number,
    filterText?: string
  ) {
    let reqParams =
      `?page=${page}&size=${size}` +
      (filterText ? `&filterText=${filterText}` : "");
    console.log(reqParams, page, size);
    return this.http.get<SchemeWrapperForAcceptedApplications>(
      api_url + "/guest/accepted-applications/" + lotteryKey + "/" + reqParams
    );
  }

  fetchCategoryListForAcceptedApplications(
    lotteryKey: number,
    schemeKey: number,
    page: number,
    size: number,
    filterText?: string
  ) {
    let reqParams =
      `?page=${page}&size=${size}` +
      (filterText ? `&filterText=${filterText}` : "");
    console.log(reqParams, page, size);
    return this.http.get<CategoryWrapperForAcceptedApplications>(
      api_url +
        "/guest/accepted-applications/" +
        lotteryKey +
        "/" +
        schemeKey +
        "/" +
        reqParams
    );
  }

  payForApplicationInsInitForm(
    applicationKey: number,
    installmentType: string
  ) {
    return this.http.get<ApplicationInsModel>(
      api_url +
        "/apply/payForInstallment/" +
        applicationKey +
        "/" +
        installmentType
    );
  }

  showInsPaymentGateway(applicationKey: number, installmentType: string) {
    return this.http.get<PaymentGatewayListWrapperModel>(
      api_url +
        "/apply/payForInstallment/" +
        applicationKey +
        "/" +
        installmentType +
        "/show-pg"
    );
  }

  payForApplicationIns(
    applicationKey: number,
    installmentType: string,
    pg: string,
    paymentAmount: number
  ) {
    return this.http.get<PaymentTransactionResponseModel>(
      api_url +
        "/apply/create-ins-transaction/" +
        applicationKey +
        "/" +
        installmentType +
        "/" +
        pg +
        "?paymentAmount=" +
        paymentAmount
    );
  }

  fetchAcceptedApplicationsPdf(
    lotteryKey: number,
    schemeKey: number,
    categoryKey: number
  ) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(
      api_url +
        "/guest/accepted-applications/" +
        lotteryKey +
        "/" +
        schemeKey +
        "/" +
        categoryKey
    );
  }

  fetchPublishedApplicationsPdf(lotteryKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/guest/published-applications-file/" + lotteryKey);
  }

  fetchRejectedApplicationsPdf(lotteryKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/guest/rejected-applications-file/" + lotteryKey);
  }

  fetchPOL(applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/applications/polLetter/" + applicationKey);
  }

  fetchAllotmentLetter(applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/applications/allotmentLetter/" + applicationKey);
  }

  fetchDraftAllotmentLetter(applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/applications/draftAllotmentLetter/" + applicationKey);
  }

  fetchPossessionLetter(applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/applications/possessionLetter/" + applicationKey);
  }

  verifyPaymentAgainstApplication(applicationKey: number) {
    return this.http.get<SelfReconciliationResponse>(
      api_url + "/apply/self-reconciliation/" + applicationKey
    );
  }

  fetchAcknowledgement(applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/applications/" + applicationKey + "/acknowledgement");
  }

  validateCoupon(couponCode: string,schemeKey: number) {
    return this.http.get<{ errorMessage: string }>(
      api_url + "/"+couponCode+"/validateCoupon/" +schemeKey 
    );
  }

  fetchRefundDetail(applicationKey: number) {
    return this.http.get<{
      refundDate: string;
      refundMessage: string;
      status: string;
      errorMessage: string;
    }>(api_url + "/applications/" + applicationKey + "/refund-detail");
  }

  fetchEMDReceipt(applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/applications/" + applicationKey + "/emd-receipt");
  }

  fetchNocReceipt(applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/applications/" + applicationKey + "/noc-receipt");
  }

  fetchInstallmentReceipt(applicationKey: number, installmentType: string) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(
      api_url +
        "/applications/" +
        applicationKey +
        "/installment-receipt/" +
        installmentType
    );
  }

  fetchScceptSurrenderEsignReceipt() {
    return this.http.get<{
      type: String;
      status: string;
      errorMessage: string;
    }>(api_url + "/successFullEsignForAcceptance/");
  }

  fetchApplicationLoi(regKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/applications/letter-of-initimation/" + regKey);
  }

  fetchEsignAcceptSurrenderTenementPdf(appKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/fetch-esign-doc/" + appKey);
  }

  fetchPostLotteryHelpFile() {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/fetch-post-lottery-help-file");
  }

  fetchFinalScrutinyLetterPdf(appKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/fetch-final-scrutiny-letter/" + appKey);
  }

  fetchFinalIneligibleLetterPdf(appKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/fetch-final-ineligible-letter/" + appKey);
  }

  async checkErrorForExpiredToken(error: any, errorMessae: string) {
    console.log(error?.error?.message, error?.error, error?.message);
    if (
      error?.error?.message?.includes("JWT expired") ||
      error?.error?.status === 400
    ) {
      const platform = localStorage.getItem("platform");
      if (platform == "browser" || platform == "browser-local") {
        this.showErrorToast(
          this.translocoService.translate("error-login-expired")
        );
        this.sharedService.setAuthentication(false);
        localStorage.clear();
        this.router.navigate(["/"]);
        window.location.reload();
      } else {
        const response: any = await this.profileService.refreshtoken();
        console.log("new token", response);
        localStorage.setItem("token", response.token);
        this.sharedService.setAuthentication(true);
      }
    } else {
      this.showErrorToast(this.translocoService.translate(errorMessae));
    }
  }

  async showErrorToast(errorMessage: string) {
    const toast = await this.toastController.create({
      message: errorMessage,
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 4000,
    });
    toast.present();
  }

  async successToast(msg) {
    await this._snackBar.open(msg, "Close", {
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: "success-toast1",
      duration: 3 * 1000,
    });
  }

  //for NOC
  fetchApplicationForNocGeneration() {
    return this.http.get<NocGenerationFormModel>(
      api_url + "/apply/fetch-application-for-noc-generation"
    );
  }

  getFindApplicationForNoc(applicationKey: number) {
    return this.http.get<ApplicationDetailsForNocFormModel>(
      api_url + "/apply/find-application-for-noc/" + applicationKey
    );
  }

  saveNoc(lottery: NocRequestModel) {
    console.log(
      "this is comming ",
      lottery.nocApplicationFile,
      "sanctionLetterFile",
      lottery.sanctionLetterFile
    );
    return this.http.post<{ status: string; errorMessage: string }>(
      api_url + "/apply/save-noc/",
      lottery
    );
  }

  fetchqbfile(qbfile: string, applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/qbfile-Certificate/" + qbfile + "/" + applicationKey);
  }
  fetchasfile(asfile: string, applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/asfile-Certificate/" + asfile + "/" + applicationKey);
  }
  fetchform16Bfile(form16Bfile: string, applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(
      api_url + "/form16Bfile-Certificate/" + form16Bfile + "/" + applicationKey
    );
  }

  fetchChallanFile(challan: string, applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/challanFile-Certificate/" + challan + "/" + applicationKey);
  }

  updateNoc(lottery: NocEditRequestModel) {
    console.log(
      "this is comming ",
      lottery.nocApplicationFile,
      "sanctionLetterFile",
      lottery.sanctionLetterFile
    );

    console.log(
      "sanctionLetterFile update call >>>>>",
      lottery.sanctionLetterFile
    );
    console.log(
      "nocApplicationFile update call >>>>>",
      lottery.nocApplicationFile
    );
    console.log(
      "cancelNocLetterFile update call >>>>>",
      lottery.cancelNocLetterFile
    );

    return this.http.post<{ status: string; errorMessage: string }>(
      api_url + "/apply/update-noc/",
      lottery
    );
  }

  fetchNocDetailsLists(page: number, size: number, filterText: any) {
    let reqParams =
      `?page=${page}&size=${size}` +
      (filterText ? `&filterText=${filterText}` : "");
    return this.http.get<NocListWrapper>(
      api_url + "/applications/fetch-application-noc-list" + reqParams
    );
  }

  fetchMortNocForView(mortNocKey: number) {
    return this.http.get<NocViewDetailsFormModel>(
      api_url + "/apply/fetch-mort-noc-view/" + mortNocKey
    );
  }

  fetchNocFile(applicationKey: number, mortNocKey: number, fileType: string) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(
      api_url +
        "/applications/nocFile/" +
        applicationKey +
        "/" +
        mortNocKey +
        "/" +
        fileType
    );
  }
  fetchapplicantdtl(applicationKey: number, appealType: string) {
    return this.http.get<AppealApplicationFormModel>(
      api_url +
        "/apply/fetch-appeal-applicant-dtl/" +
        applicationKey +
        "/" +
        appealType
    );
  }
  fetchapplicantdtlView(applicationKey: number, appealType: string) {
    return this.http.get<AppealApplicationFormModel>(
      api_url +
        "/apply/fetch-appeal-applicant-dtl/" +
        applicationKey +
        "/" +
        appealType
    );
  }
  fetchOrderdocfile(orderdocfile: string, applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(
      api_url +
        "/apply/orderdocumentfile/" +
        orderdocfile +
        "/" +
        applicationKey
    );
  }
  fetchAppealdocfile(appealdocfile: string, applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(
      api_url +
        "/apply/appealdocumentfile/" +
        appealdocfile +
        "/" +
        applicationKey
    );
  }
  fetchAppealfile(appealfile: string, applicationKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(
      api_url + "/apply/appealUploadedfile/" + appealfile + "/" + applicationKey
    );
  }
  fetchappealdtlList(
    appealType: string,
    applicationKey: number,
    page: number,
    size: number,
    filterText: any
  ) {
    let reqParams =
      `?page=${page}&size=${size}` +
      (filterText ? `&filterText=${filterText}` : "");
    return this.http.get<Page<AppealApplicationFormModel>>(
      api_url +
        "/apply/fetch-appeal-applicant-dtl-list/" +
        appealType +
        "/" +
        applicationKey +
        "/" +
        reqParams
    );
  }

  cancelNoc(mortNocKey: number, remark: string, cancelNocLetterBase64: string) {
    console.log("In pre lottery app service");
    return this.http.patch<{ status: string; errorMessage: string }>(
      api_url + "/update/cancel-noc/",
      { mortNocKey, remark, cancelNocLetterBase64 }
    );
  }

  verifyScannedQRCode(scannedData: string) {
    return this.http.post<ScannedDocWrapperResponseModel>(
      api_url + "/guest/verify-scan-doc",
      {
        scannedData,
      }
    );
  }

  //corrigendum
  downloadCorrigendum(page: number, size: number) {
    let reqParams = `?page=${page}&size=${size}`;
    return this.http.get<Page<CorrigendumRequestModal>>(
      api_url + "/fetch-corrigendum-doc/corrigendumList" + reqParams
    );
  }

  fetchCorrigendumPdfs(regKey: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/fetch-corrigendum-doc/corrigendumPdfs/" + regKey);
  }

  fetchTdsDetilsForApplication(key: number) {
    return this.http.get<TDSDetailsForApplicationModel>(
      api_url + "/application/tds-application-details/" + key
    );
  }

  //Applicant editing

  fetchPendingDetailsLists(page: number, size: number, applicationKey: number) {
    let reqParams = `?page=${page}&size=${size}`;
    return this.http.get<Page<ApplicantEditingDetailModel>>(
      api_url + "/fetch-pending-details-list/" + applicationKey + reqParams
    );
  }

  fetchPendingDetails(applicationKey: number, selectedChild: string) {
    return this.http.get<ApplicantEditingDetailModel>(
      api_url + "/fetch-pending-details/" + applicationKey + "/" + selectedChild
    );
  }

  fetchExistingImageView(applicationKey: number) {
    return this.http.get<ApplicantEditingDetailModel>(
      api_url + "/fetch-existing-image/" + applicationKey
    );
  }

  fetchExistingMarriageStatus(applicationKey: number) {
    return this.http.get<ApplicantEditingDetailModel>(
      api_url + "/fetch-existing-marriage-status/" + applicationKey
    );
  }

  fetImpLinks() {
    return this.http.get<importantLinkModal>(
      api_url + "/guest/imp-links/getLinks"
    );
  }

  saveNewApplicantImage(
    oldApplicantPhoto: string,
    applicantPhoto: File | ArrayBuffer,
    applicationNo: number,
    selectedType: string,
    selectedFileName: string
  ) {
    return this.http.post<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/saveNewApplicantPhoto", {
      oldApplicantPhoto,
      applicantPhoto,
      applicationNo,
      selectedType,
      selectedFileName,
    });
  }

  saveMarriageStatus(marriageStatus: ApplicantMarriageStatusModel) {
    return this.http.post<{ status: string; errorMessage: string }>(
      api_url + "/saveNewMaritalStatus",
      marriageStatus
    );
  }

  //Possession Detail
  generatePossessionLetter(PossessionDetail: PossessionDetailModel) {
    return this.http.post<{ status: string; errorMessage: string }>(
      api_url + "/generate-letter",
      PossessionDetail
    );
  }

  savePossessionDetails(PossessionDetail: PossessionDetailModel) {
    return this.http.post<{ status: string; errorMessage: string }>(
      api_url + "/saveNewPossessionDetails",
      PossessionDetail
    );
  }

  existingMarriageStatus(applicationKey: number) {
    return this.http.get<PossessionDetailModel>(
      api_url + "/existing-marriage-status/" + applicationKey
    );
  }

  existingApplicantName(registrationKey: number, applicationNo: number) {
    return this.http.get<PossessionDetailModel>(
      api_url + "/existing-applicant-name/" + registrationKey + "/" + applicationNo
    );
  }

  eRegistrationCall(applicationKey: number) {
    console.log("Inside last pre service", applicationKey);
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/applications/eRegistrationCall/" + applicationKey);
  }

  fetchAgreementCopy(registrationKey: number, applicationNo: string) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(
      api_url +
        "/applications/fetchAgreementCopy/" +
        registrationKey +
        "/" +
        applicationNo
    );
  }

  fetchIndex2Copy(registrationKey: number, applicationNo: string) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(
      api_url +
        "/applications/fetchIndex2Copy/" +
        registrationKey +
        "/" +
        applicationNo
    );
  }

  uploadAgrmntLtr(
    registrationKey: number,
    applicationNo: string,
    agrmntLetterBase64: string
  ) {
    console.log(
      "this is comming ",
      agrmntLetterBase64,
      "registrationKey",
      registrationKey,
      "applicationNo",
      applicationNo
    );

    return this.http.post<{
      status: string;
      data: string;
      errorMessage: string;
    }>(
      api_url +
        "/applications/uploadAgrmntLtr/" +
        registrationKey +
        "/" +
        applicationNo,
      agrmntLetterBase64
    );
  }

  uploadIndxLtr(
    registrationKey: number,
    applicationNo: string,
    indx2LetterBase64: string
  ) {
    console.log(
      "this is comming ",
      indx2LetterBase64,
      "registrationKey",
      registrationKey,
      "applicationNo",
      applicationNo
    );

    return this.http.post<{
      status: string;
      data: string;
      errorMessage: string;
    }>(
      api_url +
        "/applications/uploadIndx2Ltr/" +
        registrationKey +
        "/" +
        applicationNo,
      indx2LetterBase64
    );
  }

  saveOtherDocumentDetails(OtherDocument: ApplicationOtherDocumentModel) {
    return this.http.post<{ status: string; errorMessage: string }>(
      api_url + "/saveOtherDocumentDetails",
      OtherDocument
    );
  }

  updateDocumentDetails(OtherDocument: ApplicationOtherDocumentModel) {
    return this.http.post<{ status: string; errorMessage: string }>(
      api_url + "/saveOtherDocumentDetails",
      OtherDocument
    );
  }

  fetchOtherDocumentStatus(configType: string) {
    return this.http.get<ApplicationOtherDocumentModel>(
      api_url + "/list/" + configType
    );
  }

  fetchOtherDocumentForEdit(applicationId: number) {
    return this.http.get<ApplicationOtherDocumentModel>(
      api_url + "/fetchOtherDocumentForEdit/" + applicationId
    );
  }

  fetchPdfDocument(key: number) {
    return this.http.get<{
      status: string;
      data: string;
      errorMessage: string;
    }>(api_url + "/fetchPdfDocument/" + key);
  }

  getRequestTypes(){
    return this.http.get<{status: string;data: SystemConfigModal[];errorMessage: string;}>(`${api_url}/getRequestTypes`);
  }

  checkEligibilityForRequest(selectedRequestType: any) {
    return this.http.get<{
      data: string;
      status: string;
      errorMessage: string;
    }>(api_url + "/checkEligibilityForRequest/" + selectedRequestType);
  }

  fetchDetailsAgainstEligibleApplication(
      selectedReqType: string, elgblAppNo: string, currentPage: number, pageSize: number) {
    let reqParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;
    return this.http.get<SurrenderRequestWrapperFormModel>(api_url + "/getDataToRequest/" 
      + selectedReqType + "/" + elgblAppNo + reqParams);
  }

  submitSurrReqForm(
    selectedRequestType : string, surrReqAppNo : string, surrReqReason : string, surrReqFile : string | ArrayBuffer
  ){
    return this.http.post<{
      data: string;
      status: string;
      errorMessage: string;
    }>(api_url + "/RequestForSurrenderAftrAlltmntNPoss" , {
      selectedRequestType,
      surrReqAppNo,
      surrReqReason,
      surrReqFile,
    });
  }

  getSelfandSpouseName(applicationKey: number) {
    return this.http.get<SelfandSpouseNameModel>(
      api_url + "/spouse-application/" + applicationKey 
    );
  }

  // getSelfAndSpouseMarriageStatus(applicationKey: number) {
  //   return this.http.get<PossessionDetailModel>(
  //     api_url + "/SelfAndSpouseMarriageStatus/" + applicationKey
  //   );
  // }

  // saveSelfandSpouseName(
  //   data: any,
  //  ) {
  //    console.log(data);
  //   return this.http.post<{
  //     status: string;
  //     url: string;
  //   }>(api_url + "/saveSelfandSpouseName" , {
  //     data
  //   });
  // }

  // saveSelfandSpouseName(data: any) {
  //   console.log(data);
  //   return this.http.post<{ status: string; url: string }>(api_url + "/saveSelfandSpouseName", data, {
  //   });
  // }

  fetchCategoryList(
    applicationKey: number) {
      return this.http.get<{categoryList: string[], status: string, errorMessage: string}>(
        api_url + "/apply/tenement/category/" + applicationKey
      );
  }

  fetchBuildingList(
    applicationKey: number,category: string) {
      return this.http.get<{buildingList: string[], status: string, errorMessage: string}>(
        api_url + "/apply/tenement/buildings/" + applicationKey +"?category="+category
      );
  }

  fetchWingList(applicationKey: number,
    buildingNo: string,category: string) {
      return this.http.get<{wingList: string[], status: string, errorMessage: string}>(
        api_url + "/apply/tenement/buildings/wings/"+applicationKey+"?buildingNo="+buildingNo+"&category="+category
      );
  }

  fetchFloorGrid(applicationKey:number,buildingNo: string, wing: string,category: string) {
    return this.http.get<{gridData: {number: FloorTenementModel[]}, status: string, errorMessage: string, 
    availableCount: number, allotedCount: number, bookedCount: number, nacount: number}>(
      api_url + "/apply/tenement/floor-grid/"+applicationKey+"?buildingNo="+buildingNo+"&wing="+wing+"&category="+category
    );
  }

  fetchFloorGridForPlot(applicationKey:number,category: string) {
    return this.http.get<{gridData: {number: FloorTenementModel[]}, status: string, errorMessage: string, 
    availableCount: number, allotedCount: number, bookedCount: number, nacount: number}>(
      api_url + "/apply/tenement/floor-grid-plot/"+applicationKey+"?category="+category
    );
  }

  fetchFloorDetail(schemeId:number,selectedBuildingNo:string,
    selectedwing:string) {
      return this.http.get<BuildingListModel>(
        api_url + "/apply/tenement/"+ 
        schemeId+"/" +selectedBuildingNo +"/"+selectedwing
      );
  }



  fetchFlatNoDetail(schemeId:number,selectedBuildingNo:string,
    selectedwing:string,selectedFloorNo:number) {
      return this.http.get<BuildingListModel>(
        api_url + "/apply/tenement/"+ 
        schemeId+"/" +selectedBuildingNo +"/"+selectedwing+"/"+selectedFloorNo
      );
  }

  saveSelectedTenement(
    applicationKey: number,
    flatKey: number
    // categoryKey: number

  ) {
    return this.http.post<ApplicationModel>(
     api_url + "/apply/save-tenement/" + applicationKey,
      {
        flatKey
        // categoryKey
      }
    );
  } 

  generateCaptcha() {
    return this.http.get<{captchaKey: number, captchaImg: string, status: string, errorMessage: string}>
    (api_url+"/guest/captcha/generate");
  }

  playAudioCaptcha(captchaKey: number) {
    return this.http.get(api_url + "/guest/captcha/audio/" + captchaKey, {responseType: 'blob'});
  }

  sendOtpForNoc(appKey: number) {
    return this.http.get<{
      otpSentMessage: string;
      authEncryped: string;
      status: string;
      errorMessage: string;
    }>(api_url + "/confirm/noc-sendotp/" + appKey);
  }

  regenerateOtpForNoc(appKey: number, authEncryped: string) {
    return this.http.post<{
      otpSentMessage: string;
      authEncryped: string;
      status: string;
      errorMessage: string;
    }>(api_url + "/confirm/noc-regenotp/" + appKey, authEncryped);
  }
}
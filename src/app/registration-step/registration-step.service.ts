import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "../loader/loader.component";
import { DomSanitizer } from "@angular/platform-browser";
import { ApiResponse } from "./models/api-response.model";
import { QuestionModel } from "./models/question.model";
import { serverUrl } from "../serverurl";
import { YoutubeHelpVideoNewComponent } from "./youtube-help-video-new/youtube-help-video-new.component";
import { OcrStatus } from "./models/ocr-status.model";
import { QuestionRequest } from "./models/question-request.model";
import { QuestionDetailResponse } from "./models/question-detail-response.model";
import { QuestionDoc } from "./models/question-doc.model";
import { QuestionInitFormResponse } from "./models/question-init-form-response.model";
import { QuestionProceedWithoutSaveResponse } from "./models/question-proceed-without-save-response.model";
import { ProfileResponse } from "./models/profile-response.model";
import { ProfileQuestionEditResponse } from "./models/profile-question-edit-response.model";

@Injectable({
    providedIn: "root",
})
export class RegistrationStepService {
    
    constructor(
      private http: HttpClient,
      private toastController: ToastController,
      private translocoService: TranslocoService,
      private router: Router,
      private _snackBar: MatSnackBar,
      private dialog: MatDialog,
      private sanitizer: DomSanitizer
    ) {}

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    async successToast(message: string) {
        const toast = await this.toastController.create({
          message: message,
          icon: "checkmark-circle-outline",
          position: "top",
          cssClass: "toast success-toast",
          duration: 5000,
        });
        toast.present();
    }

    async showErrorMessage(msg: string, server: boolean, duration?: number) {
        const toast = await this.toastController.create({
            message: server ? msg : this.translocoService.translate(msg),
            icon: "information-circle",
            position: "top",
            cssClass: "toast error-toast",
            duration: duration ? duration : 4000,
        });
        toast.present();
    }
    
    async frontendWarningToast(msg: string, translationRequired?: boolean) {
        const toast = await this.toastController.create({
            message: translationRequired ? this.translocoService.translate(msg) : msg,
            icon: "information-circle",
            position: "top",
            cssClass: "toast warning-toast",
            duration: 10000,
        });
        toast.present();
    }
    
    fetchDisplayQuestion() {
        return this.http.get<ApiResponse<QuestionModel>>(serverUrl + "registration-step/display-question");
    }

    editQuestion(questionCode) {
        return this.http.get<ApiResponse<QuestionModel>>(serverUrl + "registration-step/edit-question/" + questionCode);
    }

    showVideo(question: QuestionModel) {
        this.dialog.open(YoutubeHelpVideoNewComponent, {
            disableClose: true,
            panelClass: "video-dialog",
            data: question,
        });
    }

    ocr(questionCode: string, fileObj) {
        const formData = new FormData();
        formData.append("fileObj", fileObj);
        return this.http.post<OcrStatus>(serverUrl + "registration-step/" +questionCode+"/ocr", formData);
    }

    saveQuestion(questionCode: string, questionRequest: QuestionRequest) {
        return this.http.post<ApiResponse<OcrStatus>>(serverUrl + "registration-step/" + questionCode, questionRequest);
    }

    proceedWithoutSave(questionCode: string) {
        return this.http.get<QuestionProceedWithoutSaveResponse>(serverUrl + "registration-step/proceed-without-save/" + questionCode);
    }

    fetchQuestionDetail(questionCode: string) {
        return this.http.get<QuestionDetailResponse>(serverUrl + "registration-step/question-detail/" + questionCode);
    }

    fetchQuestionDoc(questionCode: string) {
        return this.http.get<QuestionDoc>(serverUrl + "registration-step/question-doc/" + questionCode);
    }

    initFormQuestion(questionCode: string) {
        return this.http.get<QuestionInitFormResponse>(serverUrl + "registration-step/init-form/" + questionCode);
    }

    goBackQuestion(questionCode: string) {
        return this.http.get<QuestionProceedWithoutSaveResponse>(serverUrl + "registration-step/go-back/" + questionCode);
    }

    itrVerificationFirstAPI(captcha: string, qsCode: string, latestRevisedItr: string) {
        const url = serverUrl + "registration-step/itr-verification-first-api/"+qsCode;
        return this.http.post<{
          modeOfAuthentication: string;
          furtherApiCallRequired: boolean;
          status: string;
          errorMessage: string;
        }>(url, { captcha, qsCode, latestRevisedItr });
    }

    itrVerificationFirstAPINew(qsCode: string, latestRevisedItr: string, captchaText : string, captchaKey : number) {
        const itrVerificationRequestModel = {
            qsCode:qsCode,
            latestRevisedItr:latestRevisedItr,
            captchaText: captchaText,
            captchaKey: captchaKey
        };
        return this.http.post<{
            modeOfAuthentication: string;
            furtherApiCallRequired: boolean;
            status: string;
            errorMessage: string;
        }>(serverUrl + "registration-step/itr-verification-first-apiNew/"+qsCode, itrVerificationRequestModel);
      }
    
    itrVerificationSecondAPI(otp_password: string, qsCode: string) {
        const url = serverUrl + "registration-step/itr-verification-second-api/"+qsCode;
        return this.http.post<{
            status: string;
            errorMessage: string;
            successMsg: string;
            verificationStatus: string;
        }>(url, { otp_password, qsCode });
    }

    getQuestionProfiles() {
        return this.http.get<ProfileResponse>(serverUrl + "api/question-profiles/");
    }

    fetchPhoto() {
        return this.http.get<QuestionDoc>(serverUrl + "api/question-profiles/photo");
    }

    editProfileQuestion(questionCode: string) {
        return this.http.get<ProfileQuestionEditResponse>(serverUrl + "api/question-profiles/edit-question/" + questionCode);
    }

    fetchEsignedAffidavit() {
        return this.http.get<QuestionDoc>(serverUrl + "api/question-profiles/esigned-affidavit");
    }

    esignAffidavit(deviceType) {
        const url = serverUrl + "api/question-profiles/esign-affidavit";
        return this.http.post<{
            status: string;
            errorMessage: string;
            url: string
        }>(url, { deviceType });
    }

    sendOtpMail(questionCode: string, questionRequest: QuestionRequest) {
        console.log("in registration servuce for send otp >>");
        return this.http.post<{status: string;
            errorMessage: string;
            url: string}>(serverUrl + "registration-step/sendOtpV3/" + questionCode, questionRequest);
    }
}
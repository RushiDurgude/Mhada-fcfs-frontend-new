import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ActionSheetController, ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { DatePipe } from "@angular/common";
import { SharedService } from "src/app/toolbar/shared.service";
import { InAppBrowserObject } from "@awesome-cordova-plugins/in-app-browser";
import { Router } from "@angular/router";
import { ProfileService } from "src/app/profile/profile.service";

@Component({
  selector: "app-qs-email-mobile",
  templateUrl: "./qs-email-mobile.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsEmailMobileComponent implements OnInit {
  questionCode: string = 'Q_EMAIL_MOBILE';
  @Input() activeLang: string = "";
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  @Output() proceedNext = new EventEmitter();
  proceedEnabled: boolean = false;
  selectedRadioOption: string;
  dirtyForm: boolean = false;
  mobileOtp: any;
  otp: any;

  registrationId: number;
  showResendOtpBtn: boolean = false;
  isResendOtpButtonVisible: boolean = false;
  isInputDisabled: boolean = false;
  showSendOtpBtn: Boolean = false;
  enterOtpFlag: Boolean = false;
  emailIdOtp: any = "";
  mobileNoOtp: any = "";
  emailId: any = "";
  mobileNo: any = "";
  prevEmailId: any = "";
  prevMobileNo: any = "";
  maskedEmail: any = "";
  maskedMobile: any = "";
  questionId: number;
  emailPattern: any = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$";
  mobilePattern: any = "^[0-9]{10}$";
  panelOpenState = true;
  isQrScan = false;
  isEdit = localStorage.getItem("isEdit");
  allQuestions: any[] = [];
  selectedBackImage: any = "";
  aadharNo = "";
  currentAddress: string = "";
  scannedQrData: any[] = [];
  nextButtonLabel = "Next";
  scannedData: any = "";
  isFrontImage = true;
  qrObj: any = null;
  panAliasName: string = "null";
  panName: string = "";
  frontImageBlob: any = null;
  backImageBlob: any = null;
  responsePanNo = "";
  responseDomicile = "";
  responseIncomeCertificate = "";
  responseCasteValidity = "";
  displayedQuestion: any = null;
  ocrIdOnImage: any = "";
  errorMessageVisible: any = false;
  isOtpVerificationVisible: any = false;
  isUploadImageVisible: any = false;
  selectedImage: any = "";
  selectedPdf: any = "";
  imageToUpload: any = null;
  cardTitle: any = "";
  consentAccepted: any = false;
  domicileConsentAccepted: boolean = false;
  selectedAllowedWithConditionRadioOption: any = "";
  selectTypeOfDocToUploadVisible: any = false;
  domicileTokenTextFieldVisible: any = false;
  isEmailVisible: any = false;
  selectedDocToUpload: any = null;
  selfSpouseSw: string = "S";
  fileUploadVisible = false;
  fileObj: any = null;
  isImageUploaded: boolean = false;
  docuLocation: string = "";
  refresherEvent: any = null;
  isContentVisible: boolean = false;
  aadharNameFromDigi: string = "";
  isOcrDone: string = "No";
  uploadFromEnMr: string = "Upload from";
  galleryEnMr: string = "Gallery";
  cameraEnMr: string = "Camera";
  editRecordList: any[] = [];
  counter: number;
  timerRef;
  timerRunning: boolean = false;
  timeTaken: any = null;
  timerOn = true;
  resendOtpIn: any = null;
  resendOtp: string = "N";
  screenWidth: any;
  ocrMessage: string = "";
  platform: string = "";
  itrOcrResponseString: any = null;
  url: any;
  browser: InAppBrowserObject = null;
  panExists: boolean = false;
  exServicemanImageReuploaded = false;
  predefinedDocEditFlowOcrDone = false;
  domicileToken: string = "";
  selfItrPasswordBlock: boolean = false;
  spouseItrPasswordBlock: boolean = false;
  itrPortalOtp: string = "";
  itrPortalPassword: string = "";
  itrPortalConfirmPassword: string = "";
  firstItrApi: boolean = false;
  secondItrApi: boolean = false;
  secondItrApiOtp: boolean = false;
  secondItrApiPassword: boolean = false;
  isCaptchaClicked: boolean = false;
  captcha: string = "";
  isCaptchaVisible: boolean = true;
  showReVerifySelfItr: boolean = false;
  showReVerifySpouseItr: boolean = false;
  showItrErrorMessage: string;
  itrStatus: string;
  iAgree: any;
  siteKey: string = "6LcMVBMjAAAAADTww4rYepCIVsnwfUhG676Icj7M";
  isDarkMode: boolean = false;
  isExServiceman: boolean = true;
  showExservicemanFile: boolean = false;
  showDefenceFamilyFile: boolean = false;
  selectedFinancialYear: any;
  incomeAmount: number | null = null;
  spouseIcomeAmount: number | null = null;
  financialYearList: any[] = [];
  incomeCertificateVisible: boolean = false;
  emailVerificationRequired: boolean = false;
  mobileVerificationRequired: boolean = false;

  timeoutId: any;
  
  constructor(private registrationStepService: RegistrationStepService, private dialog: MatDialog,
    public actionSheetController: ActionSheetController, private translocoService: TranslocoService,
    public toastController: ToastController, private datePipe: DatePipe, 
    private sharedService: SharedService, private profileService: ProfileService, private router: Router
  ) {}

  ngOnInit() {
    if(localStorage.getItem("editQuestionCode") && localStorage.getItem("editQuestionCode") === this.questionCode) {
        this.displayProgressSpinner();
        this.registrationStepService.fetchQuestionDetail(this.questionCode)
        .subscribe((data) => {  
          this.closeProgressSpinner();
          if(data.status === 'SUCCESS') {
            if(data.emailMobileResponse) {
              this.emailId = data.emailMobileResponse.email;
              this.mobileNo = data.emailMobileResponse.mobileNo;
              this.prevEmailId = data.emailMobileResponse.email;
              this.prevMobileNo = data.emailMobileResponse.mobileNo;
              this.questionId = data.emailMobileResponse.questionId;
              this.registrationId = data.emailMobileResponse.registrationId;

              if(data.emailMobileResponse.verificationStatus !== 'Verified') {
                this.showSendOtpBtn = true;
                this.emailVerificationRequired = true;
                this.mobileVerificationRequired = true;
                this.dirtyForm = true;
                this.sendOtpToMail();
              }
              else {
                this.isInputDisabled = true;
              }

              this.maskEmail();
              this.maskMobile();
              this.evaluateProceed();
            }
            else {
              localStorage.removeItem("editQuestionCode");
              this.proceedNext.emit();      
            }
          }
          else {
            this.registrationStepService.showErrorMessage(data.errorMessage, true);
          }
        }, error => {
          this.closeProgressSpinner();
          this.registrationStepService.frontendWarningToast("error-network-related-issue", true);
        });
    }
    else {
      localStorage.removeItem("editQuestionCode");
      this.proceedNext.emit();      
    }
  }

  maskEmail() {
    const emailParts = this.emailId.split('@');
    const localPart = emailParts[0];
    const domainPart = emailParts[1];
    const maskedLocalPart = localPart.length > 3 
      ? localPart.substring(0, 1) + '***' + localPart.substring(localPart.length - 1)
      : this.errorToast("Email Id Should be more than 6 characters");//TODO get this error in some object so that it can be shown inn front end UI
    this.emailId = `${maskedLocalPart}@${domainPart}`;
  }

  maskMobile() {
    this.mobileNo = this.mobileNo.replace(/.(?=.{4})/g, '*');
  }

  async sendOtpToMail() {
    this.isInputDisabled = true;
    this.showSendOtpBtn = false;
    
    console.log("this.prevEmailId >>> ",this.prevEmailId);
    console.log("this.prevMobileNo >>> ",this.prevMobileNo);
    console.log("this.emailId >>> ",this.emailId);
    console.log("this.mobileNo >>> ",this.mobileNo);
    console.log("this.maskedEmail >>> ",this.maskedEmail);
    console.log("this.maskedMobile >>> ",this.maskedMobile);
    this.otp = "";
    this.mobileOtp = "";
    this.displayProgressSpinner();
    this.questionRequest = {
      emailMobileRequest: {
        fkRegid: this.registrationId,
        fkQsid: this.questionId,
        prevEmail: this.prevEmailId,
        reEmail: this.emailVerificationRequired ? this.prevEmailId : this.emailId,
        emailOtp: this.emailIdOtp,
        prevMobileNo: this.prevMobileNo,
        reMobileNo: this.mobileVerificationRequired ? this.prevMobileNo : this.mobileNo,
        mobileOtp: this.mobileNoOtp,
      }
    };
    // const response: any = await this.registrationStepService.sendOtpMail(this.questionCode, this.questionRequest);

    this.registrationStepService.sendOtpMail(this.questionCode, this.questionRequest).subscribe(
      (response: any) => {
        console.log("OTP sent successfully, response:", response);
        if (response && !response.error) {
          if (response.reAnsStatus === "OTP limit exceeded") {
            this.frontendWarningToast(response.reAnsStatus);
          } else if (response.status == "SUCCESS") {
            this.enterOtpFlag = true;
            this.showResendOtpBtn = true;
            this.resendOtpTimer(120);

            this.isOtpVerificationVisible = true;
            this.isEmailVisible = false;
            localStorage.setItem("regId", response.fkRegid);
            this.successToast(this.translocoService.translate("success-otp-sent"));
          } else {
            this.backendWarningToast("Unable to send OTP.");
          }
        }
        this.progressSpinnerDialog.close();
      },
      (error: any) => {
        console.error("Error sending OTP:", error);
        this.errorToast("Unable to send OTP. Please try again.");
      }
    );
  }

  onChangeOfEmail(event: Event){
    const inputElement = event.target as HTMLInputElement;
    this.emailId = inputElement.value;
    this.showSendOtpBtn = this.emailId.trim() !== '';
    this.enterOtpFlag = false;
    this.dirtyForm = true;
    this.emailVerificationRequired =false;
  }

  onChangeOfMobile(event: Event){
    const inputElement = event.target as HTMLInputElement;
    this.mobileNo = inputElement.value;
    this.showSendOtpBtn = this.mobileNo.trim() !== '';
    this.enterOtpFlag = false;
    this.dirtyForm = true;
    this.mobileVerificationRequired =false;
  }

  async frontendWarningToast(message: string) {
    // this.clearTimer();
    this.isImageUploaded = false;
    this.progressSpinnerDialog.close();
    this.selectedImage = "";
    this.selectedBackImage = "";
    this.ocrMessage = "";
    this.frontImageBlob = null;
    this.backImageBlob = null;
    this.selectedRadioOption = "";
    this.isUploadImageVisible = false;
    const toast = await this.toastController.create({
      message: message,
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 10000,
    });
    toast.present();
  }

  resendOtpTimer(remaining: any) {
    var m: any = Math.floor(remaining / 60);
    var s: any = remaining % 60;

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    this.resendOtpIn = m + ":" + s;
    localStorage.setItem("otpResendTimeLeft", this.resendOtpIn);
    remaining -= 1;

    if (remaining >= 0 && this.timerOn) {
      if(this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.resendOtpTimer(remaining);
      }, 1000);
      return;
    }

    if (!this.timerOn) {
      // Do validate stuff here
      return;
    } else {
      // Do timeout stuff here
      // alert('Timeout for otp');
      this.isResendOtpButtonVisible = true;
    }
  }

  onResendOtpClick() {
    this.resendOtp = "Y";
    this.isResendOtpButtonVisible = false;
    this.sendOtpToMail();
  }

  async backendWarningToast(message: any) {
    // this.clearTimer();
    this.isImageUploaded = false;
    this.progressSpinnerDialog.close();
    this.selectedImage = "";
    this.selectedBackImage = "";
    this.ocrMessage = "";
    this.frontImageBlob = null;
    this.backImageBlob = null;
    this.selectedRadioOption = "";
    setTimeout(() => {
      this.isUploadImageVisible = false;
    }, 10);
    const toast = await this.toastController.create({
      message: message.error,
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 5000,
    });
    toast.present();
  }

  async successToast(message: string) {
    // this.clearTimer();
    this.isImageUploaded = true;
    this.progressSpinnerDialog.close();
    const toast = await this.toastController.create({
      message: message,
      icon: "checkmark-circle-outline",
      position: "top",
      cssClass: "toast success-toast",
      duration: 5000,
    });
    toast.present();
  }

  async errorToast(error: any) {
    // this.reUploadImage();
    this.progressSpinnerDialog.close();
    this.selectedRadioOption = "";
    this.selectTypeOfDocToUploadVisible = false;
    this.domicileTokenTextFieldVisible = false;
    if (error.error.message != undefined) {
      if (error.error.message.includes("JWT expired")) {
        if (this.platform == "browser" || this.platform == "browser-local") {
          alert("Security Token is expired, please relogin with DigiLocker");
          localStorage.clear();
          this.sharedService.setAuthentication(false);
          this.router.navigate(["/landing"]);
          window.location.reload();
        } else {
          const response: any = await this.profileService.refreshtoken();
          // localStorage.setItem("token", response.token);
          this.sharedService.setAuthentication(true);
          // window.location.reload();
          this.ngOnInit();
        }
      } else {
        const toast = await this.toastController.create({
          message: this.translocoService.translate("error-network-related"),
          icon: "information-circle",
          position: "top",
          cssClass: "toast error-toast",
          duration: 5000,
        });
        toast.present();
        // setTimeout(() => {
        //   localStorage.clear();
        //   this.router.navigate([''])
        // }, 2000);
      }
    } else {
      // this.clearTimer();
      this.isImageUploaded = false;
      this.selectedImage = "";
      this.selectedBackImage = "";
      this.selectedDocToUpload = null;
      this.progressSpinnerDialog.close();
      this.ocrMessage = "";
      this.frontImageBlob = null;
      this.backImageBlob = null;
      const toast = await this.toastController.create({
        message: this.translocoService.translate("error-network-related"),
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 5000,
      });
      toast.present();
    }
  }

  edit() {
    this.isInputDisabled = false;
    this.showSendOtpBtn = true;
    this.otp = "";
    this.mobileOtp = "";

    this.enterOtpFlag = false;
    this.showResendOtpBtn = false;
    this.isOtpVerificationVisible = false;
    this.isResendOtpButtonVisible = false;
    this.isEmailVisible = true;

    this.emailId = this.prevEmailId;
    this.mobileNo = this.prevMobileNo;

    localStorage.removeItem("regId");
  }

  async proceed() {
    this.proceedEnabled = false;
    
    console.log("this.emailIdOtp >> ",this.emailIdOtp);
    console.log("this.mobileNoOtp >> ",this.mobileNoOtp);

    if(this.emailIdOtp == null){
      this.proceedEnabled = true;
      return this.registrationStepService.frontendWarningToast("please-enter-otp-received-on-email", true);
    }

    if(this.mobileNoOtp == null){
      this.proceedEnabled = true;
      return this.registrationStepService.frontendWarningToast("please-enter-otp-received-on-mobile", true);
    }

    if(this.dirtyForm) {
      if(this.evaluateProceed()) {
        this.displayProgressSpinner();
        this.questionRequest = {
          emailMobileRequest: {
            fkRegid: this.registrationId,
            fkQsid: this.questionId,
            prevEmail: this.prevEmailId,
            reEmail: this.emailVerificationRequired ? this.prevEmailId : this.emailId,
            emailOtp: this.emailIdOtp,
            prevMobileNo: this.prevMobileNo,
            reMobileNo: this.mobileVerificationRequired ? this.prevMobileNo : this.mobileNo,
            mobileOtp: this.mobileNoOtp,
          }
        };
        this.registrationStepService.saveQuestion(this.questionCode, this.questionRequest)
        .subscribe((data) => {
          this.closeProgressSpinner();
          if(data.status === 'SUCCESS') {
            this.proceedEnabled = true;
            localStorage.removeItem("editQuestionCode");
            this.proceedNext.emit();
          }
          else {
            this.proceedEnabled = true;
            this.registrationStepService.showErrorMessage(data.errorMessage, true);
          }
        }, error => {
          console.log(error);
          this.closeProgressSpinner();
          this.proceedEnabled = true;
          this.registrationStepService.frontendWarningToast("warning-unable-to-itr-inccert", true);
        });
      }
      else {
        this.proceedEnabled = true;
        this.registrationStepService.frontendWarningToast("Please complete mandatory fields", false);
      }
    }
    else {
      this.displayProgressSpinner();
      this.registrationStepService.proceedWithoutSave(this.questionCode)
      .subscribe((data) => {
        this.closeProgressSpinner();
        if(data.status === 'SUCCESS') {
          if(data.questionCode) {
            localStorage.setItem("editQuestionCode", data.questionCode);
            this.proceedNext.emit();
          }
          else {
            localStorage.removeItem("editQuestionCode");
            this.proceedNext.emit();
          }
        }
        else {
          this.proceedEnabled = true;
          this.registrationStepService.showErrorMessage(data.errorMessage, true);
        }
      }, error => {
        console.log(error);
        this.closeProgressSpinner();
        localStorage.removeItem("editQuestionCode");
        this.proceedNext.emit();
      });
    }
  }

  radioButtonClicked(event) {
    console.log(event)
    this.dirtyForm = true;
    this.evaluateProceed();
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
        disableClose: true,
        panelClass: "progressSpinner",
    });
  }

  async closeProgressSpinner() {
    if(this.progressSpinnerDialog) {
      this.progressSpinnerDialog.close();
    }
  }

  evaluateProceed() {
    this.proceedEnabled = false;
    if(this.emailId !== '' && this.mobileNo !== '' 
      && this.emailId !== undefined && this.mobileNo !== undefined) {
        if(this.isOtpVerificationVisible) {
          if(this.emailIdOtp?.length == 8 && this.mobileNoOtp?.length == 8) {
              this.proceedEnabled = true;    
            }
        }
        else {
          this.proceedEnabled = true;
        }
    }
    return this.proceedEnabled;
  }
  
}
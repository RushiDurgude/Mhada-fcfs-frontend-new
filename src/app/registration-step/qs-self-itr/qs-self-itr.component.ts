import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ActionSheetController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { RecaptchaComponent } from "ng-recaptcha";
import { DomSanitizer } from "@angular/platform-browser";
import { PreLotteryApplicationService } from "src/app/pre-lottery/services/pre-lottery-application.service";

@Component({
  selector: "app-qs-self-itr",
  templateUrl: "./qs-self-itr.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsSelfItrComponent implements OnInit {
  questionCode: string = 'Q_SELF_ITR';
  @Input() activeLang: string = "";
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  @Output() proceedNext = new EventEmitter();
  proceedEnabled: boolean = false;
  dirtyForm: boolean = false;
  workingStatus: string;
  @ViewChild("captchaElem") captchaElem: RecaptchaComponent;
  siteKey: string = "6LfIUqsqAAAAACZ0zougWrAW_gE5Bs_MuzKa5DYW";
  iAgree: boolean = false;
  latestRevisedItr: boolean = false;
  isCaptchaClicked: boolean = false;
  firstItrApi: boolean = false;
  secondItrApi: boolean = false;
  secondItrApiOtp: boolean = false;
  secondItrApiPassword: boolean = false;
  captcha: string = "";
  itrPortalOtp: string;
  itrPortalPassword: string;
  itrPortalConfirmPassword: string;
  itrErrorMessage: string;
  itrStatus: string;
  showReVerifyItr: boolean = false;
  selectedPdf;
  showItrErrorMessage: boolean = false;

  captchaKey: number;
  captchaImg: string;
  captchaText: string ="";

  constructor(private registrationStepService: RegistrationStepService, private dialog: MatDialog,
    public actionSheetController: ActionSheetController, private translocoService: TranslocoService,
    private domSanitizer: DomSanitizer,private preLotteryApplicationService: PreLotteryApplicationService
  ) {}

  ngOnInit() {
    this.generateCaptcha();
    if(localStorage.getItem("editQuestionCode") && localStorage.getItem("editQuestionCode") === this.questionCode) {
      this.setEditDetail();
    }
    else {
      this.firstItrApi = true;
    }
  }

  setEditDetail() {
    this.displayProgressSpinner();
    this.registrationStepService.fetchQuestionDetail(this.questionCode)
    .subscribe((data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        if(data.selfItrResponse) {
          this.itrStatus = data.selfItrResponse.itrStatus;
          this.itrErrorMessage = data.selfItrResponse.itrErrorMessage;
          this.showItrErrorMessage = true; 

          if(this.itrStatus === 'Verified') {
            this.fetchItr();
          }
          else {
            this.showReVerifyItr = true;
          }
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

  async proceed() {
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
        this.registrationStepService.showErrorMessage(data.errorMessage, true);
      }
    }, error => {
      console.log(error);
      this.closeProgressSpinner();
      localStorage.removeItem("editQuestionCode");
      this.proceedNext.emit();
    });
  }

  // proceedForFirstITRApi() {
  //   if(this.iAgree) {
  //     if (this.isCaptchaClicked) {
  //       this.displayProgressSpinner();
  //       this.registrationStepService.itrVerificationFirstAPI(this.captcha, this.questionCode, this.latestRevisedItr ? 'Y' : 'N')
  //       .subscribe((resp) => {
  //         this.progressSpinnerDialog.close();
  //         if(resp.status === 'SUCCESS') {
  //           if(resp.furtherApiCallRequired) {
  //             this.firstItrApi = false;
  //             this.secondItrApi = true;
  
  //             if(resp.modeOfAuthentication === 'OTP') {
  //               this.secondItrApiOtp = true;
  //               this.secondItrApiPassword = false;
  //             }
  //             else {
  //               this.secondItrApiOtp = false;
  //               this.secondItrApiPassword = true;
  //             }
  //           }
  //           else {
  //             // this.captchaElem.reset();
  //             // this.iAgree = false;
  //             localStorage.removeItem("editQuestionCode");
  //             this.proceedNext.emit();
  //           }
  //         }
  //         else {
  //           this.registrationStepService.showErrorMessage(resp.errorMessage, true);
  //           this.captchaElem.reset();
  //         }
          
  //       }, error => {
  //         this.progressSpinnerDialog.close();
  //         this.captchaElem.reset();
  //         this.registrationStepService.showErrorMessage(error.error.message||error.error.errorMessage, true);
  //       });
  //     }
  //     else {
  //       this.registrationStepService.frontendWarningToast("error-verify-captcha", true);
  //     }
  //   }
  //   else {
  //     this.registrationStepService.showErrorMessage("error-allow-us-use-itr-for-inc-cert", false);
  //   }
  // }
  proceedForFirstITRApiNew() {
    if(this.iAgree) {
      if (this.isCaptchaClicked) {
        this.displayProgressSpinner();
        this.registrationStepService.itrVerificationFirstAPINew(this.questionCode, this.latestRevisedItr ? 'Y' : 'N',this.captchaText,this.captchaKey)
        .subscribe((resp) => {
          this.progressSpinnerDialog.close();
          if(resp.status === 'SUCCESS') {
            if(resp.furtherApiCallRequired) {
              this.firstItrApi = false;
              this.secondItrApi = true;
  
              if(resp.modeOfAuthentication === 'OTP') {
                this.secondItrApiOtp = true;
                this.secondItrApiPassword = false;
              }
              else {
                this.secondItrApiOtp = false;
                this.secondItrApiPassword = true;
              }
            }
            else {
              // this.captchaElem.reset();
              // this.iAgree = false;
              localStorage.removeItem("editQuestionCode");
              this.proceedNext.emit();
            }
          }
          else {
            this.registrationStepService.showErrorMessage(resp.errorMessage, true);
            this.captchaElem.reset();
          }
          
        }, error => {
          this.progressSpinnerDialog.close();
          this.captchaElem.reset();
          this.registrationStepService.showErrorMessage(error.error.message||error.error.errorMessage, true);
        });
      }
      else {
        this.registrationStepService.frontendWarningToast("error-verify-captcha", true);
      }
    }
    else {
      this.registrationStepService.showErrorMessage("error-allow-us-use-itr-for-inc-cert", false);
    }
  }
  proceedForSecondITRApi() {
    if(this.secondItrApiOtp) {
      if(this.itrPortalOtp && this.itrPortalOtp.length == 6) {
        this.sendForOtpOrPasswordVerification(this.itrPortalOtp, this.questionCode);
      }
      else {
        this.registrationStepService.showErrorMessage('error-enter-valid-otp', false);
      }
    }
    else if(this.secondItrApiPassword) {
      if(this.itrPortalPassword && this.itrPortalConfirmPassword 
        && this.itrPortalPassword.length > 0 && this.itrPortalConfirmPassword.length > 0) {
          if(this.itrPortalPassword === this.itrPortalConfirmPassword) {
            this.sendForOtpOrPasswordVerification(this.itrPortalPassword, this.questionCode);
          }
          else {
            this.registrationStepService.showErrorMessage('error-pass-and-confirm-pass-not-match', false);    
          }
      }
      else {
        this.registrationStepService.showErrorMessage('error-enter-valid-password-itr', false);
      }
    }
    else {
      this.registrationStepService.showErrorMessage('error-invalid-authentication', false);
    }
  }

  async sendForOtpOrPasswordVerification(otp_password, qsCode) {
    this.displayProgressSpinner();
    this.registrationStepService.itrVerificationSecondAPI(otp_password, qsCode)
    .subscribe((resp) => {
      this.progressSpinnerDialog.close();
      if(resp.status === 'SUCCESS') {
        this.registrationStepService.successToast(resp.successMsg);
        // this.proceedForBothFICItr(qsCode.indexOf('SPOUSE') >= 0 ? 'OTHER' : 'SPOUSE');//TODO proceed to next question
        localStorage.removeItem("editQuestionCode");

        setTimeout(() => {
          this.proceedNext.emit();
        }, 3000);
      }
      else {
        this.registrationStepService.showErrorMessage(resp.errorMessage, true);
      }
      
    }, error => {
      this.progressSpinnerDialog.close();
      this.registrationStepService.showErrorMessage(error.error.message||error.error.errorMessage, true);
    });
  }

  fetchItr() {
    this.registrationStepService.fetchQuestionDoc(this.questionCode)
    .subscribe((data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        const byteArray = new Uint8Array(
          atob(data.fileBase64)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        let blob = new Blob([byteArray], { type: "application/pdf" });
        this.selectedPdf = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        this.evaluateProceed();
      }
      else {
        this.registrationStepService.showErrorMessage(data.errorMessage, true);
      }
    }, error => {
      this.closeProgressSpinner();
    });
  }

  resolved(captchaResponse: string) {
    if (captchaResponse !== null) {
      this.captcha = captchaResponse;
      this.isCaptchaClicked = true;
    } 
    else {
      this.isCaptchaClicked = false;
      this.captcha = "";
    }
    this.evaluateProceed();
  }

  agreeClicked() {
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

  reVerifyItr() {
    this.showReVerifyItr = false;
    this.firstItrApi = true;
    this.itrErrorMessage = null;
    this.itrStatus = null;
  }

  evaluateProceed() {
    this.proceedEnabled = false;
    if(this.firstItrApi) {
      if(this.iAgree && (this.captcha || this.captchaText.length === 6)) {
        this.proceedEnabled = true;
      }
    }
    else if(this.secondItrApi) {
      if(this.itrPortalPassword && this.itrPortalConfirmPassword) {
        if(this.itrPortalPassword == this.itrPortalConfirmPassword) {
          this.proceedEnabled = true;
        }
      }
      else if(this.itrPortalOtp && this.itrPortalOtp.length == 6) {
        this.proceedEnabled = true;
      }
    }
    return this.proceedEnabled;
  }

  generateCaptcha() {    
    this.preLotteryApplicationService.generateCaptcha()
    .subscribe(data => {
      if(data.status === 'SUCCESS') {
        this.captchaKey = data.captchaKey;
        this.isCaptchaClicked =true;
        this.captchaImg = `data:image/png;base64,${data.captchaImg}`;
        this.isCaptchaClicked = true;
        this.proceedEnabled = true;
      }
      else {
        setTimeout(() => {
          this.generateCaptcha();
        }, 150000);
      }
    }, error => {
      
    });
  }

  playAudioCaptcha() {
    if(this.captchaKey) {
      const audioElement = document.getElementById('audioCaptcha') as HTMLAudioElement;
      this.preLotteryApplicationService.playAudioCaptcha(this.captchaKey)
      .subscribe((audioBlob: Blob) => {
        console.log(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        audioElement.src = audioUrl;
        audioElement.play();
      }, error => {
        console.log(error);
      });
    }
  }
}
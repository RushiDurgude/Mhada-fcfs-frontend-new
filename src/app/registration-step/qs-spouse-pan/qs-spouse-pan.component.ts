import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { Router } from "@angular/router";
import { AadhaarPanDigiLockerService } from "../qs-aadhaar-pan.service";
import { RecaptchaComponent } from "ng-recaptcha";

@Component({
  selector: "app-qs-spouse-pan",
  templateUrl: "./qs-spouse-pan.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsSpousePanComponent implements OnInit {
  questionCode: string = 'Q_SPOUSE_PAN';
  @Input() activeLang: string = "";
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  loadCounter: number;
  @Output() proceedNext = new EventEmitter();
  proceedEnabled: boolean = false;
  selectedImage: string = '';
  uploadFileVisible: boolean = false;
  isReUploadFileAllowed: boolean = false;

  //
  consentAcceptedSpouse: boolean = false;
  isSpousePanAvailable: boolean = false;
  spousePAN: string;
  showSpousePanDetails: boolean = false;
  spousePANMaskedUUID: string; // From Pan Data
  spousePANName: string; // From Pan Data
  spousePANNumber: string; // From Pan Data

  spouseAadhaarMaskedUUID: string; // From Aadhaar Data
  spouseAadhaarName: string; // From Aadhaar Data

  //captcha
  captcha: string = "";
  isCaptchaClicked: boolean = false;
  isCaptchaVisible: boolean = true;
  @ViewChild("captchaElem") captchaElem: RecaptchaComponent;
  siteKey: string = "6LeWlokqAAAAAACB5JwblsHJMN57Xd_G7-dSEFRQ";
  selectedRadioOption: string;

  constructor(
    private aadhaarPanDigiLockerService: AadhaarPanDigiLockerService,
    private registrationStepService: RegistrationStepService,
    private router: Router,
    private dialog: MatDialog) {}

  ngOnInit() {
    if(localStorage.getItem("editQuestionCode") && localStorage.getItem("editQuestionCode") === this.questionCode) {
      this.displayProgressSpinner();
      this.registrationStepService.fetchQuestionDetail(this.questionCode)
      .subscribe((data) => {
        this.closeProgressSpinner();
        if(data.status === 'SUCCESS') {
          if(data.spousePanResponse) {
            // if(data.spousePanResponse.answer === 'Yes') {
              this.fetchSpousePanImage();
            // } else {
              // this.evaluateProceed();
            // }
          } else {
            localStorage.removeItem("editQuestionCode");
            this.proceedNext.emit();      
          }
        } else {
          this.aadhaarPanDigiLockerService.showErrorMessage(data.errorMessage, true);
        }
      }, error => {
        this.closeProgressSpinner();
        this.aadhaarPanDigiLockerService.frontendWarningToast("warning-unable-to-spouse-pan", true);
      });
    }
    else {
      localStorage.removeItem("editQuestionCode");
      this.showSpousePanDetails = false;
      this.isSpousePanAvailable = true;
      // this.proceedNext.emit();
    }
  }

  async fetchSpousePanImage() {
    console.log('test pan');
    this.displayProgressSpinner();
    this.registrationStepService.fetchQuestionDoc(this.questionCode)
    .subscribe((data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        const byteArray = new Uint8Array(
          atob(data.fileBase64)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        let blob = new Blob([byteArray], { type: "image/png" });
        this.uploadFileVisible = true;
        this.selectedImage = URL.createObjectURL(blob);
        console.log('this.selectedImage --> ',this.selectedImage);
        this.evaluateProceed();
      }
      else {
        this.registrationStepService.showErrorMessage(data.errorMessage, true);
      }
    }, async error => {
      this.closeProgressSpinner();
    });
  }

  load() {
    this.closeProgressSpinner();
  }

  // TODO 
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

  setSelectedImage(event) {
    this.selectedImage = event;
  }

  async save(){
    this.displayProgressSpinner();
    console.log('this.consentAcceptedSpouse -- ',this.consentAcceptedSpouse);
    if(this.consentAcceptedSpouse){
      this.aadhaarPanDigiLockerService.saveSpousePanConsent(this.spousePAN, this.consentAcceptedSpouse).subscribe(data => {
        this.closeProgressSpinner();
        if(data?.status === 'SUCCESS'){
          this.proceed();
        } else {
          this.aadhaarPanDigiLockerService.frontendWarningToast(data?.errorMessage);
          this.ngOnInit();
        }
      }, async error => {

      });
    }
    this.closeProgressSpinner();
  }

  resolved(captchaResponse: string) {
    if (captchaResponse !== null) {
      this.captcha = captchaResponse;
      this.isCaptchaClicked = true;
      // `${captchaResponse.substring(0, 7)}...${captchaResponse.substring(captchaResponse.length - 7)}`;
    } else {
      this.isCaptchaVisible = false;
      this.isCaptchaClicked = false;
      this.captcha = "";
      setTimeout(() => {
        this.isCaptchaVisible = true;
      }, 100);
    }
  }

  async fetchSpousePanDetailsNew() {

    if (!(this.spousePAN && this.spousePAN.trim().length == 10)) {
      this.aadhaarPanDigiLockerService.frontendWarningToast("Please Enter Valid Pan Number");
      return;
    }

    this.consentAcceptedSpouse = false;

    this.showSpousePanDetails = false;
    console.log("fetchSpousePanDetails works", this.spousePAN, this.captcha);
    this.displayProgressSpinner();
    this.aadhaarPanDigiLockerService
      .fetchSpousePanNew(this.spousePAN, this.captcha)
      .subscribe((resp) => {
        this.closeProgressSpinner();
        console.log(resp);
        if (resp.status === 'SUCCESS' && resp.isNameMatched == 'Y') {
          this.showSpousePanDetails = true;
          this.isSpousePanAvailable = true;
          this.spouseAadhaarName = resp.digiName;
          this.spousePANName = resp.name;
          this.spousePANNumber = resp.number;
        } else if (resp.status === 'SUCCESS' && resp.isNameMatched == 'N') {
          this.proceed();
        } else {
          this.captcha = "";
          this.captchaElem.reset();
          this.showSpousePanDetails = false;
          this.aadhaarPanDigiLockerService.frontendWarningToast(resp.errorMessage);
        }
      }, error => {
        this.showSpousePanDetails = false;
        this.captchaElem.reset();
        this.progressSpinnerDialog.close();
        this.aadhaarPanDigiLockerService.frontendWarningToast(error.errorMessage);
      });
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
        disableClose: true,
        panelClass: "progressSpinner",
    });
  }

  evaluateProceed() {
    this.proceedEnabled = false;
    if(!this.uploadFileVisible) {
      this.proceedEnabled = true;
    }
    else {
      if(this.selectedImage) {
          this.proceedEnabled = true;
      }
    }
    return this.proceedEnabled;
  }

  async closeProgressSpinner() {
    this.progressSpinnerDialog.close();
  }
}
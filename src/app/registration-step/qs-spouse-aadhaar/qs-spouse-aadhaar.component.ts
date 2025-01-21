import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { Router } from "@angular/router";
import { AadhaarPanDigiLockerService } from "../qs-aadhaar-pan.service";
import { ActionSheetController } from "@ionic/angular";

@Component({
  selector: "app-qs-spouse-aadhaar",
  templateUrl: "./qs-spouse-aadhaar.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsSpouseAadhaarComponent implements OnInit {
  questionCode: string = 'Q_SPOUSE_AADHAR';
  @Input() activeLang: string = "";
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  loadCounter: number;
  proceedEnabled: boolean = false;
  isEdit: boolean = false;
  uploadFileVisible: boolean = false;
  isReUploadFileAllowed: boolean = false;
  selectedImage: string = '';
  @Output() proceedNext = new EventEmitter();

  constructor(
    private aadhaarPanDigiLockerService: AadhaarPanDigiLockerService,
    private iab: InAppBrowser,
    private router: Router,
    private dialog: MatDialog,
    private registrationStepService: RegistrationStepService,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    if (localStorage.getItem("editQuestionCode") && localStorage.getItem("editQuestionCode") === this.questionCode) {
      this.displayProgressSpinner();
      this.registrationStepService.fetchQuestionDetail(this.questionCode)
      .subscribe((data) => {
          this.isEdit = true;
          this.closeProgressSpinner();
          if (data.status === 'SUCCESS') {
            if (data.spouseAadhaarResponse) {
              // if (data.spouseAadhaarResponse.answer === 'Yes') {
                this.fetchSpouseAadhaarImage();
              // }
              // else {
              //   this.evaluateProceed();
              // }
            }
            else {
              localStorage.removeItem("editQuestionCode");
              this.proceedNext.emit();
            }
          }
          else {
            this.aadhaarPanDigiLockerService.showErrorMessage(data.errorMessage, true);
          }
        }, error => {
          this.closeProgressSpinner();
          this.aadhaarPanDigiLockerService.frontendWarningToast("warning-unable-to-spouse-aadhaar", true);
        });
    }
    else {
      localStorage.removeItem("editQuestionCode");
      this.proceedNext.emit();
    }
  }

  async load() {
    this.displayProgressSpinner();
    this.aadhaarPanDigiLockerService.proceedToDigiLocker(this.questionCode).subscribe(data => {
      console.log(data);
      this.closeProgressSpinner();
      if (data.status == 'SUCCESS') {
        let url = data?.url;
        let target = "";
        let options: InAppBrowserOptions = {
          zoom: "no",
          hideurlbar: "yes",
          toolbar: "no",
          location: "no",
          hidenavigationbuttons: "no",
          usewkwebview: "yes",
        };
        if (localStorage.getItem("platform") == "ios") {
          target = "_blank";
        } else {
          target = "_self";
        }
        localStorage.removeItem("lastRoute");
        const browser = this.iab.create(url, target, options);
        browser.on("loadstart").subscribe((ev: InAppBrowserEvent) => {
          console.log('onload stop--' + ev.url);
          if (ev.url.startsWith("http://localhost:8100/registration-step/digi-locker-test")
          ) {
            browser.close();
            this.progressSpinnerDialog.close();
            localStorage.setItem("lastRoute", "/registration-step/digi-locker-test");
            this.router.navigate(['/registration-step', 'digi-locker-test', data?.key], { replaceUrl: true });
            window.location.reload();
          }
        });

      } else {
        this.aadhaarPanDigiLockerService.showErrorMessage(data.errorMessage, true);
      }
    }, async error => {
      this.closeProgressSpinner();
      console.log(error);
      this.aadhaarPanDigiLockerService.frontendWarningToast("error-try-again");
      if (this.loadCounter < 1) {
        this.loadCounter++;
        // this.load();
      }
    });

  }

  async fetchSpouseAadhaarImage() {
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

  // TODO 
  async proceed() {
    this.displayProgressSpinner();
      this.registrationStepService.proceedWithoutSave(this.questionCode)
      .subscribe((data) => {
        this.closeProgressSpinner();
        if(data.status === 'SUCCESS') {
          if(data.questionCode) {
            localStorage.setItem("editQuestionCode", "Q_SPOUSE_PAN");// TODO  data.questionCode
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

  evaluateProceed() {
    this.proceedEnabled = false;
    if (!this.uploadFileVisible) {
      this.proceedEnabled = true;
    }
    else {
      if (this.selectedImage) {
        this.proceedEnabled = true;
      }
    }
    return this.proceedEnabled;
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  async closeProgressSpinner() {
    this.progressSpinnerDialog.close();
  }
}
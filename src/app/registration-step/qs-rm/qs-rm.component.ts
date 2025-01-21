import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ActionSheetController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  selector: "app-qs-rm",
  templateUrl: "./qs-rm.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsRMComponent implements OnInit {
  questionCode: string = 'Q_RM';
  @Input() activeLang: string = "";
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  @Output() proceedNext = new EventEmitter();
  uploadFileVisible: boolean = false;
  reUploadFileVisible: boolean = false;
  fileObj: File;
  selectedImage: string = '';
  errorMessageVisible: boolean = false;
  proceedEnabled: boolean = false;
  selectedRadioOption: string;
  dirtyForm: boolean = false;
  fileBase64: string | ArrayBuffer;
  
  selectedOption: boolean =false;
  religion: string = ''; // For tracking the dropdown value
  religions: string[] = ['Sikh', 'Muslim', 'Christian', 'Parsi', 'Jain', 'Buddhist'];

  constructor(private registrationStepService: RegistrationStepService, private dialog: MatDialog,
    public actionSheetController: ActionSheetController, private translocoService: TranslocoService
  ) {}

  ngOnInit() {
    if(localStorage.getItem("editQuestionCode") && localStorage.getItem("editQuestionCode") === this.questionCode) {
      this.displayProgressSpinner();
      this.registrationStepService.fetchQuestionDetail(this.questionCode)
      .subscribe((data) => {  
        this.closeProgressSpinner();
        if(data.status === 'SUCCESS') {
          if(data.religiousMinorityResponse) {
            this.selectedRadioOption = data.religiousMinorityResponse.answer;
            if(this.selectedRadioOption === 'Yes') {
              this.religion=data.religiousMinorityResponse.religion
              this.selectedOption = this.selectedRadioOption === 'Yes';
              this.fetchLeavingCertificate();
              console.log("this.religion",this.religion);
            }
            else {
              this.evaluateProceed();
            }
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
  }

  fetchLeavingCertificate() {
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
        this.evaluateProceed();
      }
      else {
        this.registrationStepService.showErrorMessage(data.errorMessage, true);
      }
    }, error => {
      this.closeProgressSpinner();
    });
  }

  async proceed() {
    if(this.dirtyForm) {
      if(this.evaluateProceed()) {
        this.displayProgressSpinner();
        this.questionRequest = {
          religiousMinorityRequest: {
            answer: this.selectedRadioOption,
            fileBase64: this.fileBase64,
            religion:this.religion
          }
        };
        this.registrationStepService.saveQuestion(this.questionCode, this.questionRequest)
        .subscribe((data) => {
          this.closeProgressSpinner();
          if(data.status === 'SUCCESS') {
            localStorage.removeItem("editQuestionCode");
            this.proceedNext.emit();
          }
          else {
            this.registrationStepService.showErrorMessage(data.errorMessage, true);
          }
        }, error => {
          console.log(error);
          this.closeProgressSpinner();
          this.registrationStepService.frontendWarningToast("error-network-related-issue", true);
        });
      }
      else {
        this.registrationStepService.frontendWarningToast("error-mandatory-fields", true);
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
    console.log("radioButtonClicked -------------:-",event);
    this.dirtyForm = true;
    if(event == 'Yes') {
      this.selectedOption = true;
      // this.uploadFileVisible = true;
      this.checkFileUploadVisibility();
    }
    else {
      this.selectedOption = false;
      this.uploadFileVisible = false;
    }
    this.evaluateProceed();
  }

  setSelectedImage(event) {
    this.selectedImage = event;
  }

  setFileObj(event) {
    console.log(event);
    this.dirtyForm = true;
    this.fileObj = event;
    const reader = new FileReader();
    reader.readAsDataURL(this.fileObj);
    reader.onload = () => {
      this.fileBase64 = reader.result;
      this.evaluateProceed();
    };
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
    console.log('eval proceed', this.dirtyForm);
    this.proceedEnabled = false;
    if(!this.uploadFileVisible) {
      this.proceedEnabled = true;
    }
    else {
      if(this.selectedImage || this.fileBase64) {
        this.proceedEnabled = true;
      }
    }
    return this.proceedEnabled;
  }

  onReligionChange(): void {
    this.checkFileUploadVisibility(); // Check if dropdown value affects visibility
  }

  checkFileUploadVisibility(): void {
    this.uploadFileVisible = this.selectedOption && !!this.religion;
  }
}
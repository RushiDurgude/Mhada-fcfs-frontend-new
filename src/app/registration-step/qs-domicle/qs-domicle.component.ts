import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ActionSheetController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { Subject } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-qs-domicle",
  templateUrl: "./qs-domicile.component.html",
  styleUrls: ['../registration-step.component.scss']
})

export class QsDomcileComponent implements OnInit {
  questionCode: string = 'Q_DOMICILE';
  @Input() activeLang: string = "";
  @Input() ocrToBeDone: boolean;
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  @Output() proceedNext = new EventEmitter();
  @Output() routeToCertEntry = new EventEmitter();
  uploadFileVisible: boolean = false;
  reUploadFileVisible: boolean = false;
  fileObj: File;
  selectedImage: string = '';
  errorMessageVisible: boolean = false;
  proceedEnabled: boolean = false;
  ocrStatus: boolean = false;
  ocrEntryKey: number;
  selectedRadioOption: string;
  dirtyForm: boolean = false;
  callOcr: Subject<File> = new Subject();
  fileBase64: string | ArrayBuffer;

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
          if(data.domicileResponse) {
            this.selectedRadioOption = data.domicileResponse.answer;
            // if(this.selectedRadioOption === 'Yes') {
              this.fetchDomicileCertificate();
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
          this.registrationStepService.showErrorMessage(data.errorMessage, true);
        }
      }, error => {
        this.closeProgressSpinner();
        this.registrationStepService.frontendWarningToast("error-network-related-issue", true);
      });
    }
    else {
      // localStorage.removeItem("editQuestionCode");
      // this.proceedNext.emit();
    }
  }

  fetchDomicileCertificate() {
    console.log('test');
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
        console.log(this.selectedImage)
        this.ocrStatus = true;
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
          domicileRequest: {
            answer: this.selectedRadioOption,
            uploadedOcrEntry: this.ocrEntryKey,
            // fileBase64: this.fileBase64
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
        this.registrationStepService.frontendWarningToast("error-mandatory-fields", false);
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
    this.dirtyForm = true;
    if(event == 'Yes') {
      this.uploadFileVisible = true;
    }
    else if(event == 'No') {
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
    this.callOcr.next(this.fileObj);
  }

  setOcrStatus(event){
    this.ocrStatus = event;
  }

  setOcrEntryKey(event) {
    this.ocrEntryKey = event;
  }
 
  routeToCertEntryFn() {
    this.routeToCertEntry.emit();
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
    if(!this.uploadFileVisible) {
      this.proceedEnabled = true;
    }
    else {
      if(this.selectedImage) {
        if(this.ocrStatus) {
          this.proceedEnabled = true;
        }
      }
    }
    return this.proceedEnabled;
  }
}
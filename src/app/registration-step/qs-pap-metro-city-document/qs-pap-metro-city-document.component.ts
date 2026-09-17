import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ActionSheetController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from "pdfjs-dist/types/display/api";

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.js';

@Component({
  selector: "app-qs-pap-metro-city-document",
  templateUrl: "./qs-pap-metro-city-document.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsPAPMetroCityDocumentComponent implements OnInit {
  questionCode: string = 'Q_PAP_METRO_CITY_DOCUMENT';
  @Input() activeLang: string = "";
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  @Output() proceedNext = new EventEmitter();
  uploadFileVisible: boolean = false;
  reUploadFileVisible: boolean = false;
  fileObj: File;
  previewImage: string = '';
  errorMessageVisible: boolean = false;
  proceedEnabled: boolean = false;
  selectedRadioOption: string;
  dirtyForm: boolean = false;
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
          if(data.papMetroCityDocumentResponse) {
            this.selectedRadioOption = data.papMetroCityDocumentResponse.answer;
            if(this.selectedRadioOption === 'Yes') {
              this.fetchPAPVanshavali();
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

  fetchPAPVanshavali() {
    this.registrationStepService.fetchQuestionDoc(this.questionCode)
    .subscribe(async (data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        const byteArray = new Uint8Array(
          atob(data.fileBase64)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        let blob = new Blob([byteArray], { type: "application/pdf" });
        this.uploadFileVisible = true;
        this.previewImage = await this.generatePdfPreview(blob);
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
          papMetroCityDocumentRequest: {
            answer: this.selectedRadioOption,
            fileBase64: this.fileBase64
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
    else {
      this.uploadFileVisible = false;
    }
    this.evaluateProceed();
  }

  setPreviewImage(event) {
    this.previewImage = event;
  }

  setFileObj(event) {
    console.log(event);
    this.dirtyForm = true;
    this.fileObj = event;
    if(event) {
      const reader = new FileReader();
      reader.readAsDataURL(this.fileObj);
      reader.onload = () => {
        this.fileBase64 = reader.result;
        this.evaluateProceed();
      };
    }
    else {
      this.fileBase64 = null;
      this.evaluateProceed();
    }
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

  async generatePdfPreview(pdfBlob: Blob): Promise<string> {
    const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(pdfBlob));

    return loadingTask.promise.then((pdf: PDFDocumentProxy) => {
      return pdf.getPage(1).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        return page.render(renderContext).promise.then(() => {
          // Convert the canvas to an image (base64)
          return canvas.toDataURL('image/png');
        });
      });
    });
  }

  evaluateProceed() {
    this.proceedEnabled = false;
    if(!this.uploadFileVisible) {
      this.proceedEnabled = true;
    }
    else {
      if(this.previewImage || this.fileBase64) {
        this.proceedEnabled = true;
      }
    }
    return this.proceedEnabled;
  }
}
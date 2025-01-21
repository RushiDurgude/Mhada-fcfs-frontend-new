import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ActionSheetController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { Subject } from "rxjs";

@Component({
  selector: "app-qs-journalist",
  templateUrl: "./qs-journalist.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsJournalistComponent implements OnInit {
  questionCode: string = 'Q_JOURNALIST';
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
  rejectReason: string;

  constructor(private registrationStepService: RegistrationStepService, private dialog: MatDialog,
    public actionSheetController: ActionSheetController, private translocoService: TranslocoService
  ) {}

  ngOnInit() {
    if(localStorage.getItem("editQuestionCode") && localStorage.getItem("editQuestionCode") === this.questionCode) {
      this.setEditDetail();
    }
  }
  setEditDetail() {
      this.displayProgressSpinner();
      this.registrationStepService.fetchQuestionDetail(this.questionCode)
      .subscribe((data) => {  
        this.closeProgressSpinner();
        if(data.status === 'SUCCESS') {
          if(data.journalistResponse) {
            this.selectedRadioOption = data.journalistResponse.answer;
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
      if(this.dirtyForm) {
        if(this.evaluateProceed()) {
          this.displayProgressSpinner();
          console.log("Value is like this",this.selectedRadioOption);
          
          this.questionRequest = {
            journalistRequest: {
                answer: this.selectedRadioOption,
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
        if (this.selectedRadioOption === 'Yes') {
            this.proceedEnabled = true;
          } else if (this.selectedRadioOption === 'No') {
            this.proceedEnabled = true;
          } else {
            this.proceedEnabled = false;
          }
        return this.proceedEnabled;
      }

      routeToCertEntryFn() {
        this.routeToCertEntry.emit();
      }
}
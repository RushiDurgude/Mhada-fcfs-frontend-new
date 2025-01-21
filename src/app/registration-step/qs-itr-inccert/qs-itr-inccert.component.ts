import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ActionSheetController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  selector: "app-qs-itr-inccert",
  templateUrl: "./qs-itr-inccert.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsItrInccertComponent implements OnInit {
  questionCode: string = 'Q_ITR_INCCERT';
  @Input() activeLang: string = "";
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  @Output() proceedNext = new EventEmitter();
  proceedEnabled: boolean = false;
  selectedRadioOption: string;
  dirtyForm: boolean = false;
  workingStatus: string;
  
  constructor(private registrationStepService: RegistrationStepService, private dialog: MatDialog,
    public actionSheetController: ActionSheetController, private translocoService: TranslocoService
  ) {}

  ngOnInit() {
    this.displayProgressSpinner();
    this.registrationStepService.initFormQuestion(this.questionCode)
    .subscribe((data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        this.workingStatus = data.incomeTypeInitFormResponse.workingStatus;
        if(localStorage.getItem("editQuestionCode") && localStorage.getItem("editQuestionCode") === this.questionCode) {
          this.setEditDetail();
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

  setEditDetail() {
    this.displayProgressSpinner();
    this.registrationStepService.fetchQuestionDetail(this.questionCode)
    .subscribe((data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        if(data.itrInccertResponse) {
          this.selectedRadioOption = data.itrInccertResponse.answer;
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
        this.questionRequest = {
          itrInccertRequest: {
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
    // else {
    //   if(this.selectedRadioOption === 'ITR') {
    //     localStorage.setItem("editQuestionCode", "Q_SELF_ITR");
    //   }
    //   else if(this.selectedRadioOption === 'Spouse ITR') {
    //     localStorage.setItem("editQuestionCode", "Q_SPOUSE_ITR");
    //   }
    //   else if(this.selectedRadioOption === 'Family Income Certificate') {
    //     localStorage.setItem("editQuestionCode", "Q_INCOME_CERT");
    //   }
    //   else if(this.selectedRadioOption === 'Income Certificate' 
    //     && (this.workingStatus == 'Self' || this.workingStatus == 'None' || this.workingStatus == 'Yes' 
    //       || this.workingStatus == 'No'
    //     )) {
    //     localStorage.setItem("editQuestionCode", "Q_SELF_INCOME_CERT");
    //   }
    //   else if(this.selectedRadioOption === 'Income Certificate' && this.workingStatus == 'Spouse') {
    //     localStorage.setItem("editQuestionCode", "Q_SPOUSE_INCOME_CERT");
    //   }
    //   else {
    //     localStorage.removeItem("editQuestionCode");
    //   }
    //   this.proceedNext.emit();
    // }
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
    this.proceedEnabled = false;
    if(this.selectedRadioOption) {
      this.proceedEnabled = true;
    }
    return this.proceedEnabled;
  }
}
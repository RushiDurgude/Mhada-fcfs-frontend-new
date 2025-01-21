import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ActionSheetController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  selector: "app-qs-work-status",
  templateUrl: "./qs-work-status.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsWorkStatusComponent implements OnInit {
  questionCode: string = 'Q_WORK_STATUS';
  @Input() activeLang: string = "";
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  @Output() proceedNext = new EventEmitter();
  proceedEnabled: boolean = false;
  selectedRadioOption: string;
  dirtyForm: boolean = false;

  financialYears: {[key: number]: string};
  financialYear: number;
  selfIncome: number;
  spouseIncome: number;
  showSpouseIncome: boolean = false;
  
  constructor(private registrationStepService: RegistrationStepService, private dialog: MatDialog,
    public actionSheetController: ActionSheetController, private translocoService: TranslocoService
  ) {}

  ngOnInit() {
    this.displayProgressSpinner();
    this.registrationStepService.initFormQuestion(this.questionCode)
    .subscribe((data) => {  
      this.closeProgressSpinner();
      if(data.status === 'SUCCESS') {
        this.financialYears = data.workStatusInitFormResponse.financialYears;
        this.showSpouseIncome = data.workStatusInitFormResponse.showSpouseIncome;
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
        if(data.workStatusResponse) {
          this.selectedRadioOption = data.workStatusResponse.answer;
          this.financialYear = data.workStatusResponse.financialYear;
          this.selfIncome = data.workStatusResponse.selfIncome;
          this.spouseIncome = data.workStatusResponse.spouseIncome;
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
          workStatusRequest: {
            financialYear: +this.financialYear,
            selfIncome: +this.selfIncome,
            spouseIncome: +this.spouseIncome
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
      // if(this.selectedRadioOption === 'Both') {
      //   localStorage.setItem("editQuestionCode", "Q_ITR_INCCERT");
      // }
      // else if(this.selectedRadioOption === 'Self' || this.selectedRadioOption === 'Yes' || this.selectedRadioOption === 'No') {
      //   localStorage.setItem("editQuestionCode", "Q_SELF_ITR");
      // }
      // else if(this.selectedRadioOption === 'Spouse') {
      //   localStorage.setItem("editQuestionCode", "Q_SPOUSE_ITR");
      // }
      // else {
      //   localStorage.removeItem("editQuestionCode");
      // }
      // this.proceedNext.emit();
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

  onFinancialYearChange(event) {
    this.dirtyForm = true;
    this.evaluateProceed();
  }

  numberOnly(event: any) {
    console.log('numberOnly triggered');
    this.dirtyForm = true;
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    this.evaluateAnswer('');
    return true;
  }

  evaluateAnswer(event) {
    this.dirtyForm = true;
    //console.log(this.showSpouseIncome, this.selfIncome, this.spouseIncome, event);
    if(this.showSpouseIncome) {
      if(this.selfIncome && this.spouseIncome) {
        if(+this.selfIncome > 0 && +this.spouseIncome > 0) {
          this.selectedRadioOption = "Both";
        }
        else if(+this.selfIncome > 0) {
          this.selectedRadioOption = "Self";
        }
        else if(+this.spouseIncome > 0) {
          this.selectedRadioOption = "Spouse";
        }
        else {
          this.selectedRadioOption = "None";
        }
      }
      else if(this.selfIncome) {
        if(+this.selfIncome > 0) {
          this.selectedRadioOption = "Self";
        }
        else {
          this.selectedRadioOption = "None";
        }
      }
      else if(this.spouseIncome) {
        if(+this.spouseIncome > 0) {
          this.selectedRadioOption = "Spouse";
        }
        else {
          this.selectedRadioOption = "None";
        }
      }
      else {
        this.selectedRadioOption = null;
      }
    }
    else {
      if(this.selfIncome) {
        if(+this.selfIncome > 0) {
          this.selectedRadioOption = "Yes";
        }
        else {
          this.selectedRadioOption = "No";
        }
      }
      else {
        this.selectedRadioOption = null;
      }
    }
    this.evaluateProceed();
  }

  evaluateProceed() {
    console.log('evaluateProceed called', this.financialYear, this.showSpouseIncome, this.selfIncome, this.spouseIncome);
    this.proceedEnabled = false;
    if(this.financialYear) {
      if(this.showSpouseIncome) {
        if(+this.selfIncome >= 0 && +this.spouseIncome >= 0) {
          this.proceedEnabled = true;    
        }
      }
      else {
        if(this.selfIncome) {
          if(+this.selfIncome >= 0) {
            this.proceedEnabled = true;    
          }
        }
      }
    }
    
    return this.proceedEnabled;
  }
}
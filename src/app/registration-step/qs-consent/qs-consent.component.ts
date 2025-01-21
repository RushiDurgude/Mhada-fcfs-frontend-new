import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";

@Component({
  selector: "app-qs-consent",
  templateUrl: "./qs-consent.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsConsentComponent implements OnInit {
  questionCode: string = 'Q_CONSENT';
  consentAccepted: boolean = false;
  @Input() activeLang: string = "";
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  @Output() proceedNext = new EventEmitter();

  constructor(private registrationStepService: RegistrationStepService, private dialog: MatDialog) {}

  ngOnInit() {
    
  }

  async proceed() {
    if(this.consentAccepted) {
      this.questionRequest = {
        consentRequest: {
          consent: 'Y'
        }
      };
      this.displayProgressSpinner();
      this.registrationStepService.saveQuestion(this.questionCode, this.questionRequest)
      .subscribe((data) => {
        this.closeProgressSpinner();
        if(data.status === 'SUCCESS') {
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
      this.registrationStepService.frontendWarningToast("error-provide-consent", false);
    }
  }

  async displayProgressSpinner() {
    if(!this.progressSpinnerDialog) {
      this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
          disableClose: true,
          panelClass: "progressSpinner",
      });
    }
  }

  async closeProgressSpinner() {
    if(this.progressSpinnerDialog) {
      this.progressSpinnerDialog.close();
    }
  }
}
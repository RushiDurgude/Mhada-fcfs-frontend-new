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
  selector: "app-qs-spouse-old-winner",
  templateUrl: "./qs-spouse-old-winner.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsSpouseOldWinnerComponent implements OnInit {
  questionCode: string = 'Q_SPOUSE_PAN_OLD_WINNER';
  @Input() activeLang: string = "";
  questionRequest: QuestionRequest;
  progressSpinnerDialog: any = null;
  loadCounter: number;
  @Output() proceedNext = new EventEmitter();
  answer: string;

  constructor(
    private registrationStepService: RegistrationStepService,
    private dialog: MatDialog) { }

  ngOnInit() {
    // this.load();
  }

  async proceed() {
    this.displayProgressSpinner();
    this.questionRequest = {
      oldWinnerRequest: {
        answer: this.answer
      }
    };
    this.registrationStepService.saveQuestion(this.questionCode, this.questionRequest)
      .subscribe((data) => {
        this.closeProgressSpinner();
        if (data.status === 'SUCCESS') {
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

  async save(answer: string) {
    console.log(answer);
    this.answer = answer;
    this.proceed();
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
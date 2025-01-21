import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationStepService } from './registration-step.service';
import { QuestionModel } from './models/question.model';
import { SharedService } from '../toolbar/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'registration-step',
  templateUrl: './registration-step.component.html',
  styleUrls: ['./registration-step.component.scss']
})
export class RegistrationStepComponent implements OnInit {
  loading: boolean = false;
  dataLoaded: boolean = false;
  isEdit: boolean = false;//use path variable to edit
  question: QuestionModel;
  platform: string;
  activeLang: string;
  activeLangIndex: number;
  progressSpinnerDialog: any = null;
  ocrToBeDone: boolean = false;

  constructor(private router: Router, private service: RegistrationStepService,
    private sharedService: SharedService, private dialog: MatDialog) { 
    this.platform = localStorage.getItem("platform");
  }
    
  ngOnInit(): void {
    this.checkActiveLanguage();

    if(localStorage.getItem("editQuestionCode")) {
      this.isEdit = true;
      this.editQuestion(localStorage.getItem("editQuestionCode"));
    }
    else {
      this.loadQuestion();
    }
    localStorage.setItem("lastRoute", "/registration-step");
  }

  editQuestion(questionCode) {
    this.loading = true;
    this.displayProgressSpinner();
    this.service.editQuestion(questionCode)
    .subscribe(data => {
      if(data.status === 'SUCCESS') {
        localStorage.setItem("editQuestionCode", data.obj.questionCode);
        this.loading = false;
        this.dataLoaded = true;
        this.question = data.obj;
        this.ocrToBeDone = this.question.ocrRequired && this.question.ocrRequired == 'Y' ? true : false; 
        this.closeProgressSpinner();
      }
      else {
        localStorage.removeItem("editQuestionCode");
        this.ngOnInit();
      }
    }, async error => {
      this.loading = false;
      this.closeProgressSpinner();
      this.service.showErrorMessage("load error for question", false);
    });
  }

  loadQuestion() {
    this.loading = true;
    this.displayProgressSpinner();
    this.service.fetchDisplayQuestion()
    .subscribe(data => {
      this.closeProgressSpinner();
      this.loading = false;
      this.dataLoaded = true;
      if(data.status == 'SUCCESS') {
        if(data.obj?.stage === 'PROFILE') {
          this.router.navigate(["/profile"], { replaceUrl: true });
        }
        else {
          this.question = data.obj;
          this.ocrToBeDone = this.question.ocrRequired && this.question.ocrRequired == 'Y' ? true : false; 
        }
      }
      else {
        this.service.showErrorMessage(data.errorMessage, true);  
      }
    }, async error => {
      this.loading = false;
      this.closeProgressSpinner();
      this.service.showErrorMessage("load error for question", false);
    });
  }
  
  checkActiveLanguage() {
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
      if(this.activeLang == "en") {
        this.activeLangIndex = 0;
      } 
      else if(this.activeLang == "mr") {
        this.activeLangIndex = 1;
      } 
      else {
        this.activeLangIndex = 0;
      }
    });
  }

  viewHelpVideo() {
    if (this.question?.helpVideo && this.question?.helpVideo?.length > 0) {
      this.service.showVideo(this.question);
    } else {
      this.service.frontendWarningToast("video-not-available", true);
    }
  }

  showQuestion(questionStr: string) {
    let questionStrArr = questionStr.split("|||");
    return questionStrArr && questionStrArr.length > 0 ? questionStrArr[this.activeLangIndex] : "";//en 0, mr 1
  }

  proceedNext() {
    this.ngOnInit();
  }

  routeToCertEntry(event) {
    let panNo = localStorage.getItem("panNo");
    let category = "";
    if (panNo != null) {
      if (this.question.questionCode === "Q_JOURNALIST") {
        category = "JR";
      } else if (this.question.questionCode === "Q_FREEDOM") {
        category = "FF";
      } else if (this.question.questionCode === "Q_HANDICAPED") {
        category = "PH";
      } else if (this.question.questionCode === "Q_EXSERVICEMAN") {
        category = "EX";
      } else if (this.question.questionCode === "Q_DEFENCE_FAMILY") {
        category = "DF";
      } else if (this.question.questionCode === "Q_MLA") {
        category = "MP_MLA_MLC";
      } else if (this.question.questionCode === "Q_MHADA") {
        category = "ME";
      } else if (this.question.questionCode === "Q_STATE") {
        category = "SG";
      } else if (this.question.questionCode === "Q_CENTRAL") {
        category = "CG";
      } else if (this.question.questionCode === "Q_ARTIST") {
        category = "AR";
      } else if (this.question.questionCode === "Q_PMAY") {
        category = "PY";
      }
      this.router.navigate(["/cert-entry", "category", panNo, category], { replaceUrl: true });
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

  goBackQuestion(questionCode) {
    this.displayProgressSpinner();
    this.service.goBackQuestion(questionCode)
    .subscribe(data => {
      this.closeProgressSpinner();
      this.loading = false;
      this.dataLoaded = true;
      if(data.status == 'SUCCESS') {
        if(data.questionCode) {
          localStorage.setItem("editQuestionCode", data.questionCode);
          this.proceedNext();
        }
        else {
          localStorage.removeItem("editQuestionCode");
          this.proceedNext();
        }
      }
      else {
        this.service.showErrorMessage(data.errorMessage, true);  
      }
    }, async error => {
      this.loading = false;
      this.closeProgressSpinner();
      this.service.showErrorMessage("go back for question", false);
    });    
  }
}

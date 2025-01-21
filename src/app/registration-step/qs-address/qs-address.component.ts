import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RegistrationStepService } from "../registration-step.service";
import { QuestionRequest } from "../models/question-request.model";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { Router } from "@angular/router";
import { AadhaarPanDigiLockerService } from "../qs-aadhaar-pan.service";
import { ActionSheetController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  selector: "app-qs-address",
  templateUrl: "./qs-address.component.html",
  styleUrls: ['../registration-step.component.scss']
})
export class QsAddressComponent implements OnInit {
    questionCode: string = 'Q_ADDRESS';
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
    noOptionText: string = '';
    
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
          if(data.addressResponse) {
            this.selectedRadioOption = data.addressResponse.answer;
            this.noOptionText = data.addressResponse.address;
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
          console.log("Value is like this",this.selectedRadioOption,this.noOptionText);
          
          this.questionRequest = {
            addressRequest: {
                answer: this.selectedRadioOption,
                address: this.noOptionText
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
      this.noOptionText = '';
      this.dirtyForm = true;
      this.evaluateProceed();
    }

    onInputChange(event: any) {
        this.noOptionText = event.target.value;
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
          } else if (this.selectedRadioOption === 'No' && this.noOptionText.trim() !== '') {
            this.proceedEnabled = true;
          } else {
            this.proceedEnabled = false;
          }
        return this.proceedEnabled;
      }
  }
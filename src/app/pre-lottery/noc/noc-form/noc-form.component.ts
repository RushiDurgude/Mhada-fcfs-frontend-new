import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NocGenerationFormModel } from "../../models/noc-generation-form.model";
import { PreLotteryApplicationService } from "../../services/pre-lottery-application.service";
import { ToastController } from "@ionic/angular";
import { NocGenerationResponseModel } from "../../models/noc-generation-response-model";
// import { ToastController } from "@ionic/angular/providers/toast-controller";
// import { ConsoleReporter } from "jasmine";


 
@Component({
  // selector: 'app-secure-lottery-au',
  // templateUrl: './lottery-au.component.html',
  // styleUrls: ['./lottery-au.component.scss'],
  selector: "app-noc-form",
  templateUrl: "./noc-form.component.html",
  styleUrls: ["../../pre-lottery.component.scss","./noc-form.component.scss"],
})
export class NocFormComponent  implements OnInit {

  applicationList: {[key:number]:string};
  applicationKey: number;
  applicatName: string;
  scheme: string;
  category: string;
  tenement: string;
  lotteryName: string;

  selectedFile: File;
  sanctionLetter: File;
  cancelNocLetter: File;


  pBankName: string;
  pBranchName: string;
  pLoanAmount: number;
  pRateOfInterest: number;
  pTenureYear: number;
  pTenureMonth: number;
  secondNoc: boolean = false;

  
  pageMode: string;
  nocGenerationResponseModel : NocGenerationResponseModel;
  // nocGenerationFormModel : NocGenerationFormModel;
  form: FormGroup = new FormGroup({});
  isSubmitDisabled: boolean = false;
  boardsList: {[key:number]:string};
  stageList: string[];
  paymentGatewayList: string[];
  isLoading = false;

  nocApplicationFile: string | ArrayBuffer;
  sanctionLetterFile: string | ArrayBuffer;
  cancelNocLetterFile: string | ArrayBuffer;

  showDraftList: boolean = false;
  showFinalList: boolean = false;
  showLoiBtn: boolean = false;
  constructor(private preLotteryApplicationService: PreLotteryApplicationService, 
    private route: ActivatedRoute, 
    private dialog: MatDialog,
    private router: Router,
    private toastController: ToastController) {}

  ngOnInit() {

    console.log("Create NOC component on init called");
      // this.applicationKey = +params["key"];

      this.preLotteryApplicationService
      .fetchApplicationForNocGeneration()
      .subscribe((data) => {
        console.log("API status",data.status);
        if(data.status === 'SUCCESS') {
          
          console.log("Data From DB",data);
          this.applicationList = data.applications;

          if(data.isSecondNoc){
            this.nocGenerationResponseModel = data;
            this.pBankName = data.bankName;
            this.pBranchName = data.branchName;
            this.pLoanAmount = data.loanAmount;
            this.pRateOfInterest = data.rateOfIntrest;
            this.pTenureYear = data.tenureYear;
            this.pTenureMonth = data.tenureMonth;
            this.secondNoc = true;
            
          }

          if(this.pageMode === 'ADD') {
            this.form.addControl("applicationKey", new FormControl(null, Validators.required));
          }
          if(this.pageMode === 'EDIT') {
            this.form.addControl("applicationKey", new FormControl(null, Validators.required));
          }


          console.log(this.applicationList);
              // this.form.setValue({
              //   // applicationKey:{key: this.nocGenerationFormModel.applicationKey, value: this.nocGenerationFormModel.applicationNumber}
              
              // });
          } 
          console.log("Is second NOC",this.secondNoc);
          if(this.secondNoc){
            this.form.addControl('cancelNocLetterFile', new FormControl(null, Validators.required));
          }
        });

          
    this.form = new FormGroup({
      //applicationKey: new FormControl(null, Validators.required),
      bankName: new FormControl(null, Validators.required),
      branchName: new FormControl(null, Validators.required),
      tenureYear: new FormControl(null, Validators.required),
      tenureMonths: new FormControl(null, Validators.required),
      loanAmount: new FormControl(null, Validators.required),
      loanIntrest: new FormControl(null, Validators.required),
      Nocfile: new FormControl(null, Validators.required),
      sanctionLetterFile: new FormControl(null, Validators.required),
    });
  }



  
  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    console.log("this.selectedFile",this.selectedFile);
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.nocApplicationFile =reader.result;
      
    }

    console.log("reader 1",reader.result);
  }
  onSanctionLetter(event1) {
    this.sanctionLetter = event1.target.files[0];
    console.log("this.sanctionLetter ",this.sanctionLetter)
    const readerr = new FileReader();
    readerr.readAsDataURL(this.sanctionLetter);

    readerr.onload = () => {
      this.sanctionLetterFile =readerr.result;
      
    }
  }

  onCancelNoc(event2) {
    // this.form.addControl('cancelNocLetterFile', new FormControl('', Validators.required));
    this.cancelNocLetter = event2.target.files[0];
    console.log("this.cancelLetter ",this.cancelNocLetter)
    const readerr = new FileReader();
    readerr.readAsDataURL(this.cancelNocLetter);

    readerr.onload = () => {
      this.cancelNocLetterFile =readerr.result;
      
    }
  }



  onSubmit() {
    console.log("in onSubmit NOC", this.form.value);
    if(this.form.valid) {
      this.saveNoc();
    }
    else {
      this.isSubmitDisabled = false;
    }
  }



  async saveNoc() {
    console.log("in save NOC", this.form.value);

    const regexNamePtrn = /^[a-zA-Z& ]+$/;

    if(!this.form.value.branchName.match(regexNamePtrn)){
      this.showErrorToast("Only alphabets allowed for Branch Name");
      this.isSubmitDisabled = false;
      return;
    }

    if(!this.form.value.bankName.match(regexNamePtrn)){
      this.showErrorToast("Only alphabets allowed for Bank Name");
      this.isSubmitDisabled = false;
      return;
    }

    if(!this.applicatName){
      this.showErrorToast("Please Select Application");
      this.isSubmitDisabled = false;
      return;
    }


    if(!this.validateLoanAmount()){
      this.showErrorToast("Loan Amount Should Be Greatter than Zero");
      this.isSubmitDisabled = false;
      return;
    }
    if(!this.validateRateOfIntrest()){
      this.showErrorToast("Rate of Intrest Should Be Gratter ThanZero");
      this.isSubmitDisabled = false;
      return;
    }


    this.preLotteryApplicationService
        .saveNoc({
          bankName: this.form.value.bankName.trim(),
          branchName: this.form.value.branchName.trim(),
          tenureYear: this.form.value.tenureYear,
          tenureMonths: this.form.value.tenureMonths,
          rateOfInterest: this.form.value.loanIntrest,
          loanAmount: this.form.value.loanAmount,
          applicationKey: this.applicationKey,
          nocApplicationFile: this.nocApplicationFile == null ? "NO UPDATE": this.nocApplicationFile ,
          sanctionLetterFile: this.sanctionLetterFile == null ? "NO UPDATE": this.sanctionLetterFile ,
          cancelNocLetterFile: this.cancelNocLetterFile == null ? "NO UPDATE": this.cancelNocLetterFile 
        }).subscribe((data: any) => {
            if(data.status === 'SUCCESS') {
              this.successToast("NOC submitted");
              this.router.navigate(['/noc/noc-list']);
            }
            else {
              this.isSubmitDisabled = false;
              this.showErrorToast(data.errorMessage);
            }
          }, error => {
            this.isSubmitDisabled = false;
            console.log(error);
            this.showErrorToast(error.error.errorMessage);
          });
    } 
    








    onDropdownChange(e: any) {
      console.log('*********Selected value: ', e.value);
      console.log(e.value?.key);
  
      this.applicationKey = e.value?.key;
      console.log("Selected Application Kye For NOC",this.applicationKey);
      if (this.applicationKey) {
        this.preLotteryApplicationService
          .getFindApplicationForNoc(this.applicationKey).subscribe((data: any) => {
            console.log('Data from DB for applicat Details',data);
            console.log('value*****');
            this.applicatName = data.applicantName;
            this.scheme = data.scheme;
            this.category = data.category;
            this.tenement = data.tenement;
            this.lotteryName = data.lottery;
  
          }, error => {
            this.isSubmitDisabled = false;
            console.log(error);
            // this.errorToast(error.error.errorMessage, 5 * 1000);
          });
      }
  
  
    }

  showApplication(o1: any, o2: any) {
    if(o1 && o2 && o1.key == o2.key) {
      return o1.value;
    }
    else {
      return "";
    }
  }





  async showErrorToast(errorMessage: string) {
    const toast = await this.toastController.create({
      message: errorMessage,
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 4000,
    });
    toast.present();
  }

  async successToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      icon: "checkmark-circle-outline",
      position: "top",
      cssClass: "toast success-toast",
      duration: 5000,
    });
    toast.present();
  }



  validateLoanAmount() {
    return this.form.value.loanAmount > 0
    ? true
    : false;
  }
  validateRateOfIntrest() {
    return this.form.value.loanIntrest > 0
    ? true
    : false;
  }
  
  onBlurField(type: string) {
    if(type === 'LOAN_AMOUNT') {
      if(!isNaN(+parseFloat(this.form.value.loanAmount).toFixed(2))) {
        this.form.patchValue({
          loanAmount: parseFloat(this.form.value.loanAmount).toFixed(2)
        });
      }
    }
    else if(type === 'LOAN_INTEREST') {
      if(!isNaN(+parseFloat(this.form.value.loanIntrest).toFixed(2))) {
        this.form.patchValue({
          loanIntrest: parseFloat(this.form.value.loanIntrest).toFixed(2)
        });
      }
    }
  }
}

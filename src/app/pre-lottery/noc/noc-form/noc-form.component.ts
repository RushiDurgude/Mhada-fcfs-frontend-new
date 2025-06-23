import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { NocGenerationFormModel } from "../../models/noc-generation-form.model";
import { PreLotteryApplicationService } from "../../services/pre-lottery-application.service";
import { ModalController, ToastController } from "@ionic/angular";
import { NocGenerationResponseModel } from "../../models/noc-generation-response-model";
import { NocOtpComponent } from "../../noc-otp/noc-otp.component";
import { LoaderComponent } from "src/app/loader/loader.component";
import { data } from "jquery";
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
  isChecked: boolean = false;
  SubmitDisabled: boolean = true;
  applicationList: {[key:number]:string};
  applicationKey: number;
  applicatName: string;
  scheme: string;
  category: string;
  tenement: string;
  lotteryName: string;
  mobileNumber: string;


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
  progressSpinnerDialog: any = null;
  otpSentMessage: string;
  authEncrypted: string;


  constructor(private preLotteryApplicationService: PreLotteryApplicationService, 
    private route: ActivatedRoute, 
    private dialog: MatDialog,
    private router: Router,
    private modalCtrl: ModalController,
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
      bankEmailId: new FormControl(null, Validators.required),
      bankAuthorizedOfficerName: new FormControl(null, Validators.required),
      bankAuthorizedOfficerDesignation: new FormControl(null, Validators.required),
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
  onCheckboxChange(e: any) {
    if(e.target){
      console.log("check box ticked");
  this.isSubmitDisabled = false;

    }else{
      console.log("check box unticked");
   this.isSubmitDisabled = true;

    }
  }
  
  async saveNoc() {
    console.log("in save NOC", this.form.value);

    const regexNamePtrn = /^[a-zA-Z& ]+$/;

    if (!this.form.value.branchName.match(regexNamePtrn)) {
        this.showErrorToast("Only alphabets allowed for Branch Name");
        this.isSubmitDisabled = false;
        return;
    }

    if (!this.form.value.bankAuthorizedOfficerName.match(regexNamePtrn)) {
        this.showErrorToast("Only alphabets allowed for Bank Authorized Officer Name");
        this.isSubmitDisabled = false;
        return;
    }

    if (!this.form.value.bankAuthorizedOfficerDesignation.match(regexNamePtrn)) {
        this.showErrorToast("Only alphabets allowed for Bank Authorized Officer Designation");
        this.isSubmitDisabled = false;
        return;
    }

    if (!this.form.value.bankName.match(regexNamePtrn)) {
        this.showErrorToast("Only alphabets allowed for Bank Name");
        this.isSubmitDisabled = false;
        return;
    }

    if (!this.applicatName) {
        this.showErrorToast("Please Select Application");
        this.isSubmitDisabled = false;
        return;
    }

    if (!this.validateLoanAmount()) {
        this.showErrorToast("Loan Amount Should Be Greater than Zero");
        this.isSubmitDisabled = false;
        return;
    }

    if (!this.validateRateOfIntrest()) {
        this.showErrorToast("Rate of Interest Should Be Greater Than Zero");
        this.isSubmitDisabled = false;
        return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(this.form.value.bankEmailId.trim())) {
        this.showErrorToast("Please enter a valid email ID");
        this.isSubmitDisabled = false;
        return;
    }
    const loanAmount = this.form.value.loanAmount;
    const confirmLoan = confirm(`Please Confirm your loan amount: ₹${loanAmount}`);
    if (!confirmLoan) {
      this.isSubmitDisabled = false;
      return;
     }
    this.displayProgressSpinner();
    
    this.preLotteryApplicationService.sendOtpForNoc(this.applicationKey).subscribe(async (otpResponse) => {
        this.progressSpinnerDialog.close();

        if (otpResponse.status === 'SUCCESS') {
            this.otpSentMessage = otpResponse.otpSentMessage;
            this.authEncrypted = otpResponse.authEncryped;
console.log("otpResponse.authEncryped"+otpResponse.authEncryped);
            const modal = await this.modalCtrl.create({
                component: NocOtpComponent,
                componentProps: {
                    otpSentMessage: this.otpSentMessage,
                    authEncrypted: this.authEncrypted,
                    applicationKey: this.applicationKey
                }
            });

            modal.present();
            const { data, role } = await modal.onWillDismiss();

            if (data != null && role === 'submit') {
                this.displayProgressSpinner();
  console.log("Hii in saveNoc");
             console.log("bankName"+this.form.value.bankName.trim());
             console.log("branchName"+this.form.value.branchName.trim());
             console.log("tenureYear"+this.form.value.tenureYear);
             console.log("tenureMonths"+this.form.value.tenureMonths);
             console.log("loanIntrest"+ this.form.value.loanIntrest);
             console.log("loanAmount"+this.form.value.loanAmount);
             console.log("bankEmailId"+this.form.value.bankEmailId.trim());
             console.log("bankAuthorizedOfficerName"+this.form.value.bankAuthorizedOfficerName.trim());
             console.log("bankAuthorizedOfficerDesignation"+this.form.value.bankAuthorizedOfficerDesignation.trim());
             console.log("applicationKey"+this.applicationKey);
             console.log("enteredOtp"+data.enteredOtp.toString());
             console.log("enteredOtp"+data.authEncrypted);
             console.log("enteredOtp"+this.authEncrypted);

                this.preLotteryApplicationService.saveNoc({
                    bankName: this.form.value.bankName.trim(),
                    branchName: this.form.value.branchName.trim(),
                    tenureYear: this.form.value.tenureYear,
                    tenureMonths: this.form.value.tenureMonths,
                    rateOfInterest: this.form.value.loanIntrest,
                    loanAmount: this.form.value.loanAmount,
                    bankEmailId: this.form.value.bankEmailId.trim(),
                    bankAuthorizedOfficerName: this.form.value.bankAuthorizedOfficerName.trim(),
                    bankAuthorizedOfficerDesignation: this.form.value.bankAuthorizedOfficerDesignation.trim(),
                    applicationKey: this.applicationKey,
                    enteredOtp: data.enteredOtp.toString(),
                    authEncrypted: this.authEncrypted,
                    nocApplicationFile: this.nocApplicationFile ?? "NO UPDATE",
                    sanctionLetterFile: this.sanctionLetterFile ?? "NO UPDATE",
                    cancelNocLetterFile: this.cancelNocLetterFile ?? "NO UPDATE"
                }).subscribe((response) => {
                    this.progressSpinnerDialog.close();
                    
                    if (response.status === 'SUCCESS') {
                        this.successToast("NOC submitted");
                        this.router.navigate(['/noc/noc-list']);
                    } else {
                        this.showErrorToast(response.errorMessage);
                    }
                }, error => {
                    this.progressSpinnerDialog.close();
                    this.showErrorToast(error.error?.errorMessage || "Submission failed.");
                });
            } else {
                this.showErrorToast("OTP verification failed!");
            }
        } else {
            this.showErrorToast(otpResponse.errorMessage || "Failed to send OTP. Please try again.");
        }
        
    }, error => {
        this.progressSpinnerDialog.close();
        this.showErrorToast(error.error?.errorMessage || "Error sending OTP.");
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
            this.mobileNumber = data.mobileNumber;

  
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

  // updateSubmitStatus() {
  //   this.SubmitDisabled = !this.isChecked;
  // }

   async displayProgressSpinner() {
      this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
        disableClose: true,
        panelClass: "progressSpinner",
      });
    }
}

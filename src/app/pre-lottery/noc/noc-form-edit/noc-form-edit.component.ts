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
import { NocViewDetailsFormModel } from "../../models/noc-view-details-form.model";
import { ViewPdfComponent } from "../../view-pdf/view-pdf.component";




@Component({

  selector: "app-noc-form-edit",
  templateUrl: "./noc-form-edit.component.html",
  styleUrls: ["../../pre-lottery.component.scss"],
})
export class NocFormEditComponent  implements OnInit {

  applicationList: {[key:number]:string};

   secondNoc: boolean = false;
   applicationNo: string;
   applicantName: string;
   scheme: string;
   tenement: string;
   category: string;
   lotteryName: string;
   rejectReason: string;

   bankName: string;
   branchName: string;
   nocDate: string;
   tenureYear: number;
   tenureMonths: number;
   loanAmount: number;
   rateOfIntrest: number;
   applicationKey: number;
   nocStatus: string;

 









  selectedFile: File;
  sanctionLetter: File;
  cancelLetter: File;
  nocLetter: File;
  
  pageMode: string ;
  nocGenerationResponseModel : NocViewDetailsFormModel;
  // nocGenerationFormModel : NocGenerationFormModel;
  form: FormGroup = new FormGroup({});
  isSubmitDisabled: boolean = false;
  boardsList: {[key:number]:string};
  stageList: string[];
  paymentGatewayList: string[];
  isLoading = false;
  haveCancelledNocEntry: boolean =false;
  nocApplicationFile: string | ArrayBuffer;
  sanctionLetterFile: string | ArrayBuffer;
  nocLetterFile: string | ArrayBuffer;
  cancelNocLetterFile: string | ArrayBuffer;

  mortNocKey : number;

  showDraftList: boolean = false;
  showFinalList: boolean = false;
  showLoiBtn: boolean = false;
  constructor(private preLotteryApplicationService: PreLotteryApplicationService, 
    private route: ActivatedRoute, 
    private dialog: MatDialog,
    private router: Router,
    private modalCtrl: ModalController, 
    private toastController: ToastController) {}

  ngOnInit() {

    console.log("View NOC Details component on init called");
    this.route.params.subscribe((params: Params) => {
      this.mortNocKey = +params["mortNocKey"];

      console.log("MortNocKey for View Details",this.mortNocKey);

        this.preLotteryApplicationService
        .fetchMortNocForView(this.mortNocKey)
        .subscribe((data) => {
          console.log("API status************",data);
          if(data.status === 'SUCCESS') {
           // this.nocGenerationResponseModel = data;
            // console.log(this.applicationList);
            // console.log("Noc Details for View from DB",this.nocGenerationResponseModel);
            this.applicantName = data.applicantName;
            this.scheme = data.scheme;
            this.category = data.category;
            this.tenement = data.tenement;
            this.lotteryName = data.lottery;

            this.haveCancelledNocEntry = data.haveCancelledNocEntry;
            this.applicationNo= data.applicationNo;
            this.applicantName= data.applicantName;
            this.scheme= data.scheme;
            this.tenement= data.tenement;
            this.category= data.category;
            this.lotteryName= data.lottery;
            
            this.bankName= data.bankName;
            this.branchName= data.branchName;
            this.nocDate= data.nocDate;
            this.tenureYear= data.tenureYear;
            this.tenureMonths= data.tenureMonths;
            this.loanAmount= data.loanAmount;
            this.rateOfIntrest= data.rateOfIntrest;
            this.applicationKey= data.applicationKey;
            this.nocStatus= data.nocStatus;
            this.rejectReason= data.rejectReason;
            
            console.log("Is second NOC",this.secondNoc);
            if(this.secondNoc){
              this.form.addControl('cancelNocLetterFile', new FormControl(null, Validators.required));
            }
       
            //this.applicationList = this.nocGenerationResponseModel.applications;

            
                this.form.setValue({
                  // applicationKey:{key: this.nocGenerationFormModel.applicationKey, value: this.nocGenerationFormModel.applicationNumber}
                  applicationNo:this.form.get("applicationNo").setValue(data.applicationNo),
                  applicantName :this.form.get("applicantName").setValue(data.applicantName),
                  scheme :this.form.get("scheme").setValue(data.scheme),
                  category :this.form.get("category").setValue(data.category),
                  tenement :this.form.get("tenement").setValue(data.tenement),
                  lotteryName :this.form.get("lotteryName").setValue(data.lottery),
                 // applicationNo: data.applicationNo,
                  bankName:this.form.get("bankName").setValue(data.bankName),
                  branchName:this.form.get("branchName").setValue(data.branchName),
                  nocDate:this.form.get("nocDate").setValue(data.nocDate),
                  tenureYear:this.form.get("tenureYear").setValue(data.tenureYear),
                  tenureMonths:this.form.get("tenureMonths").setValue(data.tenureMonths),
                  loanAmount:this.form.get("loanAmount").setValue(data.loanAmount),
                  rateOfIntrest:this.form.get("rateOfIntrest").setValue(data.rateOfIntrest),
                  applicationKey:this.form.get("applicationKey").setValue(data.applicationKey),
                  nocStatus:this.form.get("applicationKey").setValue("PENDING"),
                  Nocfile:this .form.get("Nocfile").setValue(data.sanctionLetterFile),
                  rejectReason: data.rejectReason
                });
                
            } });
            
        
        
     
        this.form = new FormGroup({
        applicationNo: new FormControl(null, Validators.required),
        applicantName: new FormControl(null, Validators.required),
        scheme: new FormControl(null, Validators.required),
        category: new FormControl(null, Validators.required),
        tenement: new FormControl(null, Validators.required),
        lotteryName: new FormControl(null, Validators.required),
        bankName: new FormControl(null, Validators.required),
        branchName: new FormControl(null, Validators.required),
        nocDate: new FormControl(null, Validators.required),
        tenureYear: new FormControl(null, Validators.required),
        tenureMonths: new FormControl(null, Validators.required),
        loanAmount: new FormControl(null, Validators.required),
        rateOfIntrest: new FormControl(null, Validators.required),
      //  Nocfile: new FormControl(null, Validators.required),
      //  sanctionLetterFile: new FormControl(null, Validators.required),
       // nocLetterFile : new FormControl(null, Validators.required),
        
      });
    });
  }


  async showSanctionLetter() {
    this.getFile("sanctionLetter");
  }
  async showPaymentSlip() {
    this.getFile("paymentSlip");
  }
  async showNocLetter() {
    this.getFile("nocLetter");
  }
  async showCancelLetter() {
    this.getFile("cancelLetter");
  }

  getFile(fileType: string) {
    // this.displayProgressSpinner();
    this.preLotteryApplicationService
    .fetchNocFile(this.applicationKey,this.mortNocKey,fileType)
    .subscribe(async ({status, data, errorMessage}) => {
      if(status === 'SUCCESS') {
        // this.progressSpinnerDialog.close();
        const modal = await this.modalCtrl.create({
          component: ViewPdfComponent,
          componentProps: {
            base64: data,
            documentName: "File",
            fileName: "FILE"+new Date().getTime()+".pdf"
          }
        });
        modal.present();
      }
      else {
        // this.progressSpinnerDialog.close();
        const toast = await this.toastController.create({
          message: errorMessage,
          icon: "information-circle",
          position: "top",
          cssClass: "toast error-toast",
          duration: 4000,
        });
        toast.present();
      }
    }, 
    // error => {
    //   this.progressSpinnerDialog.close();
    //   if(this.polCounter < 1) {
    //     this.polCounter++;
    //     this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
    //     "error-pol-load").then(num => {
    //       this.fetchPOL(applicationKey);
    //     });
    //   }
    // }
    );
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
    console.log("this.sanctionLetter ",this.sanctionLetter);
    const readerr = new FileReader();
    readerr.readAsDataURL(this.sanctionLetter);

    readerr.onload = () => {
      this.sanctionLetterFile =readerr.result;
      
    }
  }
 
  onCancelLetter(event2) {
    this.cancelLetter = event2.target.files[0];
    console.log("this.cancelLetter ",this.cancelLetter);
    const readerr = new FileReader();
    readerr.readAsDataURL(this.cancelLetter);

    readerr.onload = () => {
      this.cancelNocLetterFile =readerr.result;
      
    }
  }

  onSubmit() {
    console.log("in onSubmit NOC", this.form.value);
    if(this.form.valid) {
      console.log("Valid Form");
      this.saveNoc();
    }
    else {
      console.log("InValid Form");
      this.isSubmitDisabled = false;
    }
  }



  async saveNoc() {
    console.log("in Update NOC", this.form.value);

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
        .updateNoc({
          bankName: this.form.value.bankName.trim(),
          branchName: this.form.value.branchName.trim(),
          tenureYear: this.form.value.tenureYear,
          tenureMonths: this.form.value.tenureMonths,
          rateOfIntrest: this.form.value.rateOfIntrest,
          loanAmount: this.form.value.loanAmount,
          applicationKey: this.applicationKey,
          nocApplicationFile: this.nocApplicationFile == null ? "NO UPDATE":this.nocApplicationFile,
          sanctionLetterFile: this.sanctionLetterFile == null ? "NO UPDATE":this.sanctionLetterFile,
          cancelNocLetterFile: this.cancelNocLetterFile == null ? "NO UPDATE":this.cancelNocLetterFile,
          mortKey: this.mortNocKey
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


    validateLoanAmount() {
      return this.form.value.loanAmount > 0
      ? true
      : false;
    }
    validateRateOfIntrest() {
      return this.form.value.rateOfIntrest > 0
      ? true
      : false;
    }
    






    

  showApplication(o1: any, o2: any) {
    if(o1 && o2 && o1.key == o2.key) {
      return o1.value;
    }
    else {
      return "";
    }
  }

  showStage(o1: any, o2: any) {
    if(o1 && o2 && o1 == o2) {
      return o1;
    }
    else {
      return "";
    }
  }

  showPaymentGateway(o1: any, o2: any) {
    if(o1 && o2 && o1 == o2) {
      return o1;
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
  
  
}

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
import { PaymentComponent } from "../../payment/payment.component"; 






@Component({

  selector: "app-noc-form-view",
  templateUrl: "./noc-form-view.component.html",
  styleUrls: ["../../pre-lottery.component.scss"],
})
export class NocFormViewComponent  implements OnInit {

  applicationList: {[key:number]:string};

  
   applicationNo: string;
   applicantName: string;
   scheme: string;
   tenement: string;
   category: string;
   lotteryName: string;
   lotteryCode: string;
   rejectReason: string;
   cancelNocRejectReason: string;

   bankName: string;
   branchName: string;
   nocDate: string;
   tenureYear: number;
   tenureMonths: number;
   loanAmount: number;
   rateOfIntrest: number;
   applicationKey: number;
   nocStatus: string;
   dataLoaded: boolean = false;











  selectedFile: File;
  sanctionLetter: File;
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

  nocApplicationFile: string | ArrayBuffer;
  sanctionLetterFile: string | ArrayBuffer;
  nocLetterFile: string | ArrayBuffer;
  cancelLetterFile: string | ArrayBuffer;

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
            this.dataLoaded = true;
            this.applicantName = data.applicantName;
            this.scheme = data.scheme;
            this.category = data.category;
            this.tenement = data.tenement;
            this.lotteryName = data.lottery;


            this.applicationNo= data.applicationNo;
            this.applicantName= data.applicantName;
            this.scheme= data.scheme;
            this.tenement= data.tenement;
            this.category= data.category;
            this.lotteryName= data.lottery;
            this.lotteryCode= data.lotteryCode;
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
            this.cancelNocRejectReason = data.cancelNocRejectReason;

            if(data.cancelLetterFile !=null){
              this.cancelLetterFile = data.cancelLetterFile;
            }
       
            //this.applicationList = this.nocGenerationResponseModel.applications;

            
                this.form.setValue({
                  // applicationKey:{key: this.nocGenerationFormModel.applicationKey, value: this.nocGenerationFormModel.applicationNumber}
                
                });
            } });
            
        
        
     
        this.form = new FormGroup({
        bankName: new FormControl(null, Validators.required),
        branchName: new FormControl(null, Validators.required),
        nocDate: new FormControl(null, Validators.required),
        tenureYear: new FormControl(null, Validators.required),
        tenureMonths: new FormControl(null, Validators.required),
        loanAmount: new FormControl(null, Validators.required),
        loanIntrest: new FormControl(null, Validators.required),
        Nocfile: new FormControl(null, Validators.required),
        sanctionLetterFile: new FormControl(null, Validators.required),
        nocLetterFile : new FormControl(null, Validators.required),
        cancelLetterFile : new FormControl(null, Validators.required),
        
      });
    });
  }


  async showSanctionLetter() {
    this.getFile("sanctionLetter");
  }
  async showCancelLetter() {
    this.getFile("cancelLetter");
  }
  async showPaymentSlip() {
    this.getFile("paymentSlip");
  }
  async showNocLetter() {
    this.getFile("nocLetter");
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
  onNocLetter(event2) {
    this.nocLetter = event2.target.files[0];
    console.log("this.nocLetter ",this.nocLetter);
    const readerr = new FileReader();
    readerr.readAsDataURL(this.nocLetter);

    readerr.onload = () => {
      this.nocLetterFile =readerr.result;
      
    }
  }



  onSubmit() {
    if(true) {
      console.log("going to save");
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

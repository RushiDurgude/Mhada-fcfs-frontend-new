import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { ToastController } from "@ionic/angular";
import { NocGenerationResponseModel } from "../models/noc-generation-response-model";
import { PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { SurrenderRequestWrapperFormModel } from "../models/surrenderRequestFormModel";
import { RequestToSurrenderModel } from "../models/requestToSurrenderModel";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Page } from "../models/Page";
//import { RequestToSurrenderModel } from "../models/RequestToSurrenderModel";
 
@Component({
  selector: "app-surrender-request-form",
  templateUrl: "./surrender-request-form.component.html",
  styleUrls: ["../pre-lottery.component.scss","./surrender-request-form.component.scss"],
})
export class SurrenderRequestFormComponent  implements OnInit {

  selectedRequestType: string;
  eligibleAppNo: string;
  applicationDetials: SurrenderRequestWrapperFormModel;
  requestToSurrenderModel: Page<RequestToSurrenderModel>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<RequestToSurrenderModel>=new MatTableDataSource();
  displayedColumns: string[] = [
    "id",
    "status"
  ];
  pageSizeOptions: number[] = [10, 25, 100];
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  isNewReq: string;
  hasRejectRecord: string;

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

  surrReqFile: string | ArrayBuffer;
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

    this.form = new FormGroup({
      surrReqFile: new FormControl(null, Validators.required),
      surrReqReason : new FormControl(null, Validators.required)
    });

    this.route.params.subscribe((params: Params) => {
      this.selectedRequestType = params['selectedRequestType'];
      this.eligibleAppNo = params['applicationNo'];
    });

    console.log("In Form selectedRequestType: ", this.selectedRequestType);
    console.log("In Form applicationNo: ", this.eligibleAppNo);
    this.preLotteryApplicationService
      .fetchDetailsAgainstEligibleApplication(
        this.selectedRequestType, 
        this.eligibleAppNo,
        this.currentPage,
        this.pageSize)
      .subscribe((data) => {
        console.log("API status",data);
        if(data.status === 'SUCCESS') 
        {
          console.log("Data From DB",data);
          this.applicationDetials = data;
          this.requestToSurrenderModel = data.requestToSurrenderModel;
          console.log("data.requestToSurrenderModel ", data.requestToSurrenderModel);
          if(this.requestToSurrenderModel.content.length == 0){
            this.isNewReq ="Y";
          }else{
            this.isNewReq ="N";
          }
 
          console.log("data.isAbleToMakeRequest : ", data.ableToMakeRequest);
          if(data.ableToMakeRequest === true){
            this.hasRejectRecord = 'Y';
          }else{
            this.hasRejectRecord = 'N';
          }

          console.log("this.hasRejectRecord ", this.hasRejectRecord);
          console.log("this.isNewReq ",  this.isNewReq);

          this.dataSource = new MatTableDataSource(data.requestToSurrenderModel.content);//page.content
          setTimeout(() => {
            if(this.paginator){
              this.paginator.pageIndex = this.currentPage;
              this.paginator.length = this.requestToSurrenderModel.totalElements;
            }
          });
          
          console.log("this.requestToSurrenderModel : ", this.requestToSurrenderModel);
        }else if(data.status === 'FAILURE'){
          this.preLotteryApplicationService.showErrorToast(data.errorMessage);
        }else{
          this.preLotteryApplicationService.showErrorToast(data.errorMessage);
        }
      });
}



  
  onFileSelect(event) {
    this.selectedFile = event.target.files[0];
    console.log("this.selectedFile****", this.selectedFile);
    if (this.selectedFile) {
        const fileName = this.selectedFile.name.toLowerCase();      
        if (!fileName.endsWith('.pdf')) {
            this.selectedFile = null;
            this.surrReqFile = null;
            alert("Please Select PDF file only");
            return;
        }else{
          console.log("this.selectedFile",this.selectedFile);
          const reader = new FileReader();
          reader.readAsDataURL(this.selectedFile);
          reader.onload = () => {
            this.surrReqFile =reader.result; 
          }
          console.log("reader 1",reader.result);
        }
      }
    }

  onSubmit() {
    console.log("in onSubmit SurrReqSubmit", this.form.value);
    if(this.form.valid) {
      console.log("Hiii Going to save");
      this.saveSurrReq();
    }
    else {
      this.isSubmitDisabled = false;
    }
  }

  async saveSurrReq() {
    console.log("in Surr Req", this.form.value);
    console.log("Surr Reason",this.form.value.surrReqReason);
    console.log("Surr File",this.surrReqFile);

    let surrReqFileToSend: string | ArrayBuffer;

    if(this.surrReqFile == null){
      this.showErrorToast("Please upload Request File");
      this.isSubmitDisabled = false;
      return;
    }else{
      if (this.surrReqFile) {
        surrReqFileToSend = this.surrReqFile;
      } else {
        surrReqFileToSend = "NO_FILE";
      }
    }

    if(this.form.value.surrReqReason == null){
      this.showErrorToast("Please Enter the Reason");
      this.isSubmitDisabled = false;
      return;
    }

    this.preLotteryApplicationService.submitSurrReqForm(this.selectedRequestType, this.eligibleAppNo,
      this.form.value.surrReqReason.trim(), surrReqFileToSend).subscribe((data : any) =>{
      if(data.status == "SUCCESS"){
        this.successToast("Request for Surrender of Tenement is Submitted");
        setTimeout(() => {
          window.location.reload();
        }, 50);
      }else if(data.status =="FAILURE"){
        this.showErrorToast(data.errorMessage);
        this.isSubmitDisabled =false;
      }else{
      }

    });
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

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.ngOnInit();
  }
}

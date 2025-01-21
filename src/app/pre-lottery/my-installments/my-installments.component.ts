import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';
import { ModalController, ToastController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { TranslocoService } from '@ngneat/transloco';
import { MatTableDataSource } from "@angular/material/table";
import { Page } from "src/app/pre-lottery/models/Page";
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { InstallmentListItemModel } from '../models/installment-list-item.model';
import { ViewPdfComponent } from '../view-pdf/view-pdf.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-installments',
  templateUrl: './my-installments.component.html',
  styleUrls: ['../pre-lottery.component.scss', './my-installments.component.scss']
})
export class MyInstallmentsComponent implements OnInit {
  dataLoaded: boolean = false;
  progressSpinnerDialog: any = null;
  form: FormGroup = new FormGroup({});
  counter: number = 0;
  isLoading = false;
  selectedFile : File;
  selectedFile1 : File;
  selectedFile2 : File;
  selectedFile3 : File;
  page: Page<InstallmentListItemModel>;
  applicationKey: number;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  cost : any;

  fileUploadStatus: string;

  qbFile: string | ArrayBuffer;

  asFile: string | ArrayBuffer;

  form16BFile: string | ArrayBuffer;

  challanFile: string | ArrayBuffer;

  dataSource: MatTableDataSource<InstallmentListItemModel> = new MatTableDataSource();
  displayedColumns: string[] = [
    "id",
    "installment",
    "amount",//"amount","paidAmount","balanceAmount",
    "status",
    "dates",//"startDate","endDate",
    "action",  
  ];
  
  pageSizeOptions: number[] = [25, 100];
  totalRows = 0;
  pageSize = 25;
  currentPage = 0;

  receiptCounter: number = 0;
  
  constructor(
    private route: ActivatedRoute, private toastController: ToastController,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController, private dialog: MatDialog, 
    private translocoService: TranslocoService) { }

    ngOnInit(): void {
      this.route.params.subscribe((params: Params) => {
        if(params["applicationKey"]) {
          this.applicationKey = +params["applicationKey"];
          this.onLoad();
        }
        else {
          this.preLotteryApplicationService.showErrorToast(this.translocoService.translate("error-invalid-application"));
        }
      });  
      
      this.form = new FormGroup({
        //applicationKey: new FormControl(null, Validators.required),
        file: new FormControl(null, Validators.required),
         file1: new FormControl(null, Validators.required),
         file2: new FormControl(null, Validators.required),
         file3: new FormControl(null, Validators.required),
      });

    }
  
  onLoad() {
    this.isLoading = true;
    this.preLotteryApplicationService.fetchInstallmentsForApplication(this.applicationKey,
      this.currentPage, this.pageSize).subscribe((data) => {
      this.cost = data.cost;
      this.fileUploadStatus = data.fileUploadStatus;
      console.log(data.fileUploadStatus);

      let pageContent: InstallmentListItemModel[] = data.page.content;

      if(data.allowForTds) {
        pageContent.push(new InstallmentListItemModel(
          0, 'TDS Certificate', 'TDS_CERTIFICATE',
        data.cost,
        0, 0,0,
        data.fileUploadStatus !== null ? data.fileUploadStatus : 'FILE_UPLOAD_PENDING',
        null,
	      data.tdsUploadEndDate,
	      null,null,
        false,false,false,
        null,null,null
        ));
      }
      /* this.verificationstatus = data.verificationstatus */
      this.dataSource = new MatTableDataSource(pageContent);
      
      setTimeout(() => {
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = data.page.totalElements;

        if(data.allowForTds) {
          this.paginator.length++;
        }

        console.log('page', this.currentPage, data.page.totalElements);
      });
      this.isLoading = false;
    },
    (error) => {
        console.log(error);
        this.isLoading = false;
        if(this.counter < 1) {
          this.counter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
          "error-installment-list-load").then(num => {
            this.onLoad();
          });
        }
    });
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  async showReceipt(applicationKey, installmentType) {
    this.receiptCounter = 0;
    this.fetchReceipt(applicationKey, installmentType);
  }

  fetchReceipt(applicationKey: number, installmentType: string) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
    .fetchInstallmentReceipt(applicationKey, installmentType)
    .subscribe(async ({status, data, errorMessage}) => {
      if(status === 'SUCCESS') {
        this.progressSpinnerDialog.close();
        const modal = await this.modalCtrl.create({
          component: ViewPdfComponent,
          componentProps: {
            base64: data,
            documentName: "Installment Receipt ("+installmentType.split('_').join(" ")+")",
            fileName: "INSTALLMENT_RECEIPT_"+installmentType+"_"+new Date().getTime()+".pdf"
          }
        });
        modal.present();
      }
      else {
        this.progressSpinnerDialog.close();
        const toast = await this.toastController.create({
          message: errorMessage,
          icon: "information-circle",
          position: "top",
          cssClass: "toast error-toast",
          duration: 4000,
        });
        toast.present();
      }
    }, error => {
      this.progressSpinnerDialog.close();
      if(this.receiptCounter < 1) {
        this.receiptCounter++;
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
        "error-installmentreceipt-load").then(num => {
          this.fetchReceipt(applicationKey, installmentType);
        });
      }
    });
  }

  statusClass(status) {
    if(status === 'Payment received' || status === 'APPROVED') {
      return 'p-1 bg-green-500 text-white border-round-md shadow-4';
    }
    else if(status === 'Payment not received' || status === 'REJECTED') {
      return 'p-1 bg-pink-500 text-white border-round-md shadow-4';
    }
    else {
      return 'p-1 bg-yellow-500 text-white border-round-md shadow-4';
    }
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.onLoad();
  }

//

onFileSelect(event) {
  this.selectedFile = event.target.files[0];
  console.log("this.selectedFile1",this.selectedFile);
  const reader = new FileReader();
  reader.readAsDataURL(this.selectedFile);
  reader.onload = () => {
    this.qbFile = reader.result;
    console.log(this.qbFile);
  }
  console.log("reader 2",reader.result);
}



onFileSelect1(event) {
  this.selectedFile1 = event.target.files[0];
  console.log("this.selectedFile1",this.selectedFile1);
  const reader = new FileReader();
  reader.readAsDataURL(this.selectedFile1);
  reader.onload = () => {
    this.asFile = reader.result;
    console.log("this.asFile ",this.asFile);
  }
  console.log("reader 2",reader.result);
}


onFileSelect2(event) {
  this.selectedFile2 = event.target.files[0];
  console.log("this.selectedFile2",this.selectedFile2);
  const reader = new FileReader();
  reader.readAsDataURL(this.selectedFile2);
  reader.onload = () => {
    this.form16BFile =reader.result;
    console.log("this.form16BFile ",this.form16BFile);
  }
  console.log("reader 3",reader.result);

}


onFileSelect3(event) {
  this.selectedFile3 = event.target.files[0];
  console.log("this.selectedFile3",this.selectedFile3);
  const reader = new FileReader();
  reader.readAsDataURL(this.selectedFile3);
  reader.onload = () => {
    this.challanFile =reader.result;
    console.log("this.challanFile ",this.challanFile);
  }
  console.log("reader 4",reader.result);

}

validateQbFile1() {
  return typeof(this.qbFile) === 'string' 
            ? true
            : false;
}


validateasFile() {
  return typeof(this.asFile) === 'string' 
            ? true
            : false;
}


validateform16BFile() {
  return typeof(this.form16BFile) === 'string' 
            ? true
            : false;
}


validatechallanFile() {
  return typeof(this.challanFile) === 'string' 
            ? true
            : false;
}

async submitTDSFile(){

  if(!this.validateQbFile1()){
    this.preLotteryApplicationService.showErrorToast(this.translocoService.translate('error-qbfile-upload'));
    return ;
  }
  if(!this.validateasFile()){
    this.preLotteryApplicationService.showErrorToast(this.translocoService.translate('error-asFile-upload'));
    return ;
  }

  if(!this.validateform16BFile()){
    this.preLotteryApplicationService.showErrorToast(this.translocoService.translate('error-form16BFile-upload'));
    return ;
  }
  
  if(!this.validatechallanFile()){
    this.preLotteryApplicationService.showErrorToast(this.translocoService.translate('error-challanFile-upload'));
    return ;
  }

  this.preLotteryApplicationService.uploadTDSCertificateFile(this.applicationKey, this.qbFile, this.asFile, this.form16BFile, this.challanFile).subscribe((data: any) => {

    if(data.status === 'SUCCESS'){
      this.preLotteryApplicationService.successToast("Successfully Saved"); // TODO success msg
      this.onLoad()
    } else {
      this.preLotteryApplicationService.showErrorToast(data.errorMessage); // TODO success msg
    }
    
  }, error => {
    this.preLotteryApplicationService.showErrorToast(""); // TODO error msg
  });


}


}

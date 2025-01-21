import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { PaymentVerifyResponseModel } from '../models/payment-verify-response.model';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';
import { ViewPdfComponent } from '../view-pdf/view-pdf.component';

@Component({
  selector: 'app-payment-verification',
  templateUrl: './noc-payment-verification.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class NocPaymentVerificationComponent implements OnInit {
  transactionId: string;
  paymentResponseModel: PaymentVerifyResponseModel;
  progressSpinnerDialog: any = null;
  counter: number = 0;
  receiptCounter: number = 0;


  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService, private dialog: MatDialog, 
    private modalCtrl: ModalController, private toastController: ToastController) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: HttpParams) => {
      console.log('response transactionId - ', params['transactionId']);
      this.transactionId = params['transactionId'];
      this.loadData();
    });
  }
  
  loadData() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.verifyNocPayment(this.transactionId)
    .subscribe((model) => {
      this.paymentResponseModel = model;
      this.progressSpinnerDialog.close();
    }, error => {
      this.progressSpinnerDialog.close();
      if(this.counter < 1) {
        this.counter++;
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
        "error-payment-form-load").then(num => {
          this.loadData();
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

  async showReceipt() {
    this.receiptCounter = 0;
    this.fetchReceipt();
  }

  fetchReceipt() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
    .fetchNocReceipt(this.paymentResponseModel.applicationKey)
    .subscribe(async ({status, data, errorMessage}) => {
      if(status === 'SUCCESS') {
        this.progressSpinnerDialog.close();
        const modal = await this.modalCtrl.create({
          component: ViewPdfComponent,
          componentProps: {
            base64: data,
            documentName: "NOC PAYMENT RECEIPT",
            fileName: "NOC_PAYMENT_RECEIPT_"+new Date().getTime()+".pdf"
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
        "error-emdreceipt-load").then(num => {
          this.fetchReceipt();
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';
import { ScannedDocWrapperResponseModel } from '../models/scanned-doc-wrapper.model';

@Component({
  selector: 'app-verify-document-scan',
  templateUrl: './verify-document-scan.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class VerifyDocumentScanComponent implements OnInit {
  progressSpinnerDialog: any = null;
  scannedData: string;
  scanFlag: boolean = false;
  data: ScannedDocWrapperResponseModel;

  constructor(private dialog: MatDialog, private barcodeScanner: BarcodeScanner, 
    private toastController: ToastController, private preLotteryApplicationService: PreLotteryApplicationService) { }

  ngOnInit(): void {
  }

  scanQrCode() {
    this.scannedData = null;
    this.barcodeScanner.scan().then(qrcodeData => {
      console.log('QR data', qrcodeData.text);
      this.scannedData = qrcodeData.text+'';
      
      this.displayProgressSpinner();
      this.preLotteryApplicationService.verifyScannedQRCode(this.scannedData)
      .subscribe(data => {
        this.progressSpinnerDialog.close();
        
        if(data.status === 'SUCCESS') {
          this.scanFlag = true;
          this.data = data;
        }
        else {
          this.scanFlag = false;
          this.data = null;
          this.showErrorToast(data.errorMessage);
        }
      }, async error => {
        this.progressSpinnerDialog.close();
        this.showErrorToast('Unable to Verify Document, Please try again.');
        this.scanFlag = false;
        this.scannedData = null;
      });
    }).catch(err => {
      this.showErrorToast(err);
      this.scanFlag = false;
    });
  }

  scanAgain() {
    this.scanFlag = false;
    this.scannedData = null;
    this.data = null;
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

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

}

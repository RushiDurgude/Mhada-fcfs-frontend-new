import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ToastController } from '@ionic/angular';
import { ScannedDocWrapperResponseModel } from '../../models/scanned-doc-wrapper.model';

@Component({
  selector: 'app-verify-scanned-document',
  templateUrl: './verify-scanned-document.component.html',
  styleUrls: ['../../pre-lottery.component.scss', './verify-scanned-document.component.scss']
})
export class VerifyScannedDocumentComponent implements OnInit {
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  @Input() data: ScannedDocWrapperResponseModel;

  constructor(private dialog: MatDialog, private toastController: ToastController) { }

  ngOnInit(): void {    
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
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

}

import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';

@Component({
  selector: 'app-esign-verify',
  template: '<div class="grid m-0 pl-3 pt-2 pr-3 background-image card-content ng-star-inserted"'+ 
            'style="height: calc(100% - 100px);"></div>'
})
export class EsignVerifyComponent implements OnInit {
  progressSpinnerDialog: any = null;
  counter: number = 0;
  receiptCounter: number = 0;

  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService, 
    private dialog: MatDialog, 
    private router: Router,
    private modalCtrl: ModalController, 
    private toastController: ToastController) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: HttpParams) => {
      this.loadData();
    });
  }
  
  loadData() {
    this.displayProgressSpinner();
    this.fetchEsignDoc();
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  fetchEsignDoc() {
    this.preLotteryApplicationService
    .fetchScceptSurrenderEsignReceipt()
    .subscribe(async ({type, status, errorMessage}) => {
      if(status === 'SUCCESS') {
        this.progressSpinnerDialog.close();
        console.log('Esign Receipt');
        let str = "";
        if(type === 'ACCEPTANCE') {
          str = "Tenement acceptance is Successful.";
        }
        else if(type === 'SURRENDER') {
          str = "Surrender of Tenement is Successful.";
        }
        else {
          str = "Esign Successful.";
        }
        this.preLotteryApplicationService.successToast(str);
        this.router.navigate(['/app', 'application-detail-list', 'post-apps'], { replaceUrl: true });
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
        this.router.navigate(['/app', 'application-detail-list', 'post-apps'], { replaceUrl: true });
      }
    }, error => {
      this.progressSpinnerDialog.close();
      if(this.receiptCounter < 1) {
        this.receiptCounter++;
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
        "error-esigndoc-load").then(num => {
          this.loadData();
        });
      }
      this.router.navigate(['/app', 'application-detail-list', 'post-apps'], { replaceUrl: true });
    });
  }
}

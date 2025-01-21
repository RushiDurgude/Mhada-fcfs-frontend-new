import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';
import { ApplicationListItemModel } from '../models/application-list-item.model';
import { AlertController, IonModal, ModalController, ToastController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AcceptSurrenderTenementModal } from '../models/acceptsurrendertenementmodal';
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ViewPdfComponent } from '../view-pdf/view-pdf.component';
import { TermsAndConditionsComponent } from '../terms-and-conditions/terms-and-conditions.component';
import { SurrenderRemarkComponent } from '../surrender-remark/surrender-remark.component';

@Component({
  selector: 'app-surrender-tenement',
  templateUrl: './surrender-tenement.component.html',
  styleUrls: ['../pre-lottery.component.scss', './surrender-tenement.component.scss']
})
export class SurrenderTenementComponent implements OnInit {
  applicationList: ApplicationListItemModel[] = [];
  dataLoaded: boolean = false;
  dataFiltered: boolean = true;
  progressSpinnerDialog: any = null;
  applicationKey: number;
  type: string;
  singleSurrenderTenement :  AcceptSurrenderTenementModal;
  loadCounter: number;

  esignDisabled: boolean = true;
  showAcceptList: boolean = false;
  showSurrenderList: boolean = false;

  otpSentMessage: string;
  authEncryped: string;

  constructor(
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController, private dialog: MatDialog, 
    private toastController: ToastController, 
    private iab: InAppBrowser,
    private router: Router,
    private alertController: AlertController,
    private translocoService: TranslocoService) { }

    ngOnInit(): void {

      this.route.params.subscribe((params: Params) => {
        this.applicationKey = +params["applicationKey"];
        this.type = params["type"];
        console.log('Surrender TenementComponent Call');
        this.onLoad();
      });

    }
  
  onLoad() {

      this.preLotteryApplicationService.fetchSurrenderTenementDetails(this.applicationKey).subscribe((data) => {
        this.singleSurrenderTenement = data.singleSurrenderTenement;
        if(this.singleSurrenderTenement) {
          this.showAcceptList = true;
        }
      });
  }

  onCheckboxChange(e: any) {
    if(e.target){
      console.log("check box ticked");
      this.esignDisabled = false;
    }else{
      console.log("check box unticked");
      this.esignDisabled = true;
    }
  }

  async confirmTenement() {
    let acceptText = this.singleSurrenderTenement ? 
    "Are you sure you want to <b>Surrender</b> application no - <b>"+this.singleSurrenderTenement.applicationNo+"</b><br><br><br>" : "";
    this.alertController
      .create({
        header: "Confirm",
        message: acceptText,
        backdropDismiss: false,
        buttons: [
          {
            text: "Confirm",
            handler: () => {
              this.finallyConfirmTenement();
            },
          },
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  async finallyConfirmTenement(){
    this.displayProgressSpinner();
    this.preLotteryApplicationService.sendOtpForSurrender(this.applicationKey).subscribe(async (data1) => {
      this.progressSpinnerDialog.close();

      if(data1.status === 'SUCCESS') {
        this.otpSentMessage = data1.otpSentMessage;
        this.authEncryped = data1.authEncryped;
        
        const modal = await this.modalCtrl.create({
          component: SurrenderRemarkComponent,
          componentProps: {
            otpSentMessage: this.otpSentMessage,
            authEncryped: this.authEncryped,
            applicationKey: this.applicationKey
          }
        });
        modal.present();
        const { data, role } = await modal.onWillDismiss();
    
        if(data != null && role === 'submit'){
          console.log(this.singleSurrenderTenement?.acceptAppKey);
          this.displayProgressSpinner();
          this.preLotteryApplicationService.saveSurrenderTenement('surrender', 
          this.singleSurrenderTenement?.acceptAppKey, data.remark.toString(), 
          data.enteredOtp.toString(), data.authEncryped).subscribe((data) => {
              console.log(data);
              if(data.status === 'SUCCESS') {
                let url = data?.url;
                let target = "";
                let options: InAppBrowserOptions = {
                  zoom: "no",
                  hideurlbar: "yes",
                  toolbar: "no",
                  location: "no",
                  hidenavigationbuttons: "no",
                  usewkwebview: "yes",
                };
                if (localStorage.getItem("platform") == "ios") {
                  target = "_blank";
                } else {
                  target = "_self";
                }
        
                localStorage.setItem("lastRoute", null);
                const browser = this.iab.create(url, target, options);
                browser.on("loadstart").subscribe((ev: InAppBrowserEvent) => {
                  console.log('onload stop--'+ev.url);
                  if (ev.url.startsWith("http://localhost:8100/app/esign-verify")
                  || ev.url.startsWith("https://cidcohousing.probitysoftware.in/app/esign-verify")
                  || ev.url.startsWith("https://housing.pmrda.gov.in/app/esign-verify")
                  || ev.url.startsWith("https://sqtchousing.mhada.gov.in/app/esign-verify")
                ) {
                    browser.close();
                    this.progressSpinnerDialog.close();
                    localStorage.setItem("lastRoute", "/app/esign-verify/");
                    this.router.navigate(['/app', 'esign-verify'], { replaceUrl: true });
                    window.location.reload();
                  }
                });
              }
              else {
                this.progressSpinnerDialog.close();
                this.preLotteryApplicationService.showErrorToast(data.errorMessage);
              }
            }, error => {
              this.progressSpinnerDialog.close();
              if(this.loadCounter < 1) {
                this.loadCounter++;
                this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
                "error-submit").then(num => {
                  this.finallyConfirmTenement();
                });
              }
            });
        } else {
          this.preLotteryApplicationService.showErrorToast('Please Enter Surrender Reason.');
        }
      }
      else {
        this.progressSpinnerDialog.close();
        this.preLotteryApplicationService.showErrorToast(data1.errorMessage);
      }      
    }, error => {
      this.progressSpinnerDialog.close();
      if(error?.errorMessage?.errorMessage.indexOf('Limit') > 0) {
        this.preLotteryApplicationService.showErrorToast(error?.errorMessage?.errorMessage);
      }
      else {
        this.preLotteryApplicationService.showErrorToast('Please try again.');
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

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

}

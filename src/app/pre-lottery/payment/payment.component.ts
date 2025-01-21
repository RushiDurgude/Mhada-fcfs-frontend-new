import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from "@awesome-cordova-plugins/in-app-browser/ngx";
import { ModalController, ToastController } from "@ionic/angular";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ApplicationModel } from "../models/application.model";
import { PaymentGatewayListWrapperModel } from "../models/payment-gateway-list-wrapper.model";
import { api_url, PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { TermsAndConditionsComponent } from "../terms-and-conditions/terms-and-conditions.component";


@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["../pre-lottery.component.scss", "./payment.component.scss"],
})
export class PaymentComponent implements OnInit {
  applicationKey: number;
  paymentModel: ApplicationModel;
  //paymentFormSubmitted: boolean = false;
  iAgree: boolean = false;
  paymentMsg: string = null;
  paymentRequestUrl: string;
  isPayDisabled: boolean = false;
  api_url: string;
  @ViewChild("payForm") payForm: any;
  //showLoader: boolean = false;
  progressSpinnerDialog: any = null;
  formLoadStatus: string;
  formLoadErrorMessage: string;
  loadCounter: number = 0;
  payCounter: number = 0;
  paymentGateways: PaymentGatewayListWrapperModel;
  showPgs: boolean = false;

  constructor(
    private preLotteryApplicationService: PreLotteryApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    // private allInOneSDK: AllInOneSDK,
    private iab: InAppBrowser,
    private toastController: ToastController, 
    private dialog: MatDialog, private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.api_url = api_url;
    this.route.params.subscribe((params: Params) => {
      this.applicationKey = +params["applicationKey"];
      this.loadData();
    });
  }
  
  loadData() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .payForApplicationInitForm(this.applicationKey)
      .subscribe((paymentModel) => {
        this.paymentModel = paymentModel;
        this.formLoadStatus = paymentModel.status;
        this.formLoadErrorMessage = paymentModel.errorMessage;
        this.progressSpinnerDialog.close();
        this.loadCounter = 0;
      }, error => {
        this.progressSpinnerDialog.close();
        if(this.loadCounter < 1) {
          this.loadCounter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
          "error-payment-form-load").then(num => {
            this.loadData();
          });
        }
      });
  }

  async successToast(message: any) {
    const toast = await this.toastController.create({
      message: message,
      icon: "information-circle",
      position: "top",
      cssClass: "toast success-toast",
      duration: 2000,
    });
    toast.present();
  }

  onPayFindPgs() {
    this.isPayDisabled = true;
    this.displayProgressSpinner();
    this.preLotteryApplicationService
    .showPaymentGateway(this.applicationKey)
    .subscribe((paymentGateways) => {
      this.progressSpinnerDialog.close();
      this.isPayDisabled = false;
      this.loadCounter = 0;
      if(paymentGateways.status === 'SUCCESS') {
        this.paymentGateways = paymentGateways;
        this.showPgs = true;
      }
      else {
        this.preLotteryApplicationService.showErrorToast(paymentGateways.errorMessage);
      }
    }, error => {
      this.progressSpinnerDialog.close();
      this.isPayDisabled = false;
      if(this.loadCounter < 1) {
        this.loadCounter++;
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
        "error-payment-pgs-load").then(num => {
          this.onPayFindPgs();
        });
      }
    });
  }

  onPay(pg: string) {
    this.paymentMsg = null;
    this.payCounter = 0;
    //this.paymentFormSubmitted = true;
    // this.showLoader = true;
    this.payAgainstApplication(pg);
  }

  payAgainstApplication(pg: string) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.payForApplication(this.applicationKey, pg)
    .subscribe(async (res) => {
      if(res.status === 'SUCCESS') {
        let url = this.preLotteryApplicationService.getPaymentUrl(res);
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
          if (ev.url.startsWith("http://localhost:8100/app/payment-verify")
          || ev.url.startsWith("https://cidcohousing.probitysoftware.in/app/payment-verify")
          || ev.url.startsWith("https://housing.pmrda.gov.in/app/payment-verify")
          || ev.url.startsWith("https://sqtchousing.mhada.gov.in/app/payment-verify")
        ) {
            browser.close();
            this.progressSpinnerDialog.close();
            localStorage.setItem("lastRoute", "/app/payment-verify/"+res?.transactionId);
            this.router.navigate(['/app', 'payment-verify', res?.transactionId], { replaceUrl: true });
            window.location.reload();
          }
        });
      }
      else {
        const toast = await this.toastController.create({
          message: res.errorMessage,
          icon: 'information-circle',
          position: 'top',
          cssClass: 'toast error-toast',
          duration: 2000,
        });
        toast.present();
        // this.showLoader = false;
        this.progressSpinnerDialog.close();
        //this.paymentFormSubmitted = false;
        this.paymentMsg = 'Show Error';
        this.iAgree = false;
        this.isPayDisabled = false;
      }
    }, async (error) => {
      this.progressSpinnerDialog.close();
      if(this.payCounter < 1) {
        this.payCounter++;
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
        "error-payment-form-submit").then(num => {
          this.payAgainstApplication(pg);
        });
      }
      else {
        this.paymentMsg = 'Show Error';
        this.iAgree = false;
        this.isPayDisabled = false;
      }      
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }
  
  async showTermsAndConditions() {
    const modal = await this.modalCtrl.create({
      component: TermsAndConditionsComponent,
      componentProps: {
        type: "EMD_PAYMENT",
        mdrList: this.paymentModel?.lotterMdrlst
      }
    });
    modal.present();
  }
}

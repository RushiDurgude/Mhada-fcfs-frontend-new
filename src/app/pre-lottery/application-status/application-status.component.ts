import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ModalController, ToastController } from "@ionic/angular";
import { LoaderComponent } from "src/app/loader/loader.component";
import { PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { ViewPdfComponent } from "../view-pdf/view-pdf.component";
import { RefundDetailComponent } from "../refund-detail/refund-detail.component";
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: "app-application-status",
  templateUrl: "./application-status.component.html",
  styleUrls: ['../pre-lottery.component.scss', './application-status.component.scss'],
})
export class ApplicationStatusComponent implements OnInit {
  @Input() statusMsg: string = "";
  @Input() pendingDoc: string = "";
  @Input() statusIcon: string = "";
  @Input() type: string = "";
  @Input() key: number = 0;
  @Input() flatDetail: string;
  @Input() lotteryStage: string;
  @Input() full: boolean;
  @Input() pendingPayments: boolean;
  @Input() draftListPublished: string = "N";
  @Input() finalListPublished: string = "N";
  @Input() rejectMessage: string;
  @Input() priority: string;
  @Input() installmentType: string;
  @Input() ineligibityRemarks: string;

  verifyPaymentClicked: boolean = false;

  progressSpinnerDialog: any = null;
  emdReceiptCounter: number = 0;
  refundDtlCounter: number = 0;


  isDarkMode : boolean = false;

  constructor(private dialog: MatDialog, 
    private modalCtrl: ModalController, private toastController: ToastController, 
    private preLotteryApplicationService: PreLotteryApplicationService,
    private themeService: ThemeService
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
   }

  ngOnInit(): void {
    //  console.log("lotteryStage",this.lotteryStage, "Type --> ",this.type);
    
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  viewRefundDetail() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchRefundDetail(this.key).subscribe(
      async ({ refundDate, refundMessage, status, errorMessage }) => {
        this.refundDtlCounter = 0;
        if (status === "SUCCESS") {
          this.progressSpinnerDialog.close();
          const modal = await this.modalCtrl.create({
            component: RefundDetailComponent,
            componentProps: {
              refundDate: refundDate,
              refundMessage: refundMessage,
            },
          });
          modal.present();
        } else {
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
      },
      (error) => {
        this.progressSpinnerDialog.close();
        if (this.refundDtlCounter < 1) {
          this.refundDtlCounter++;
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(
              error,
              "error-unable-fetch-refund-detail"
            )
            .then((num) => {
              this.viewRefundDetail();
            });
        }
      }
    );
  }

  showAcknowledgement() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchAcknowledgement(this.key).subscribe(
      async ({ status, data, errorMessage }) => {
        this.emdReceiptCounter = 0;
        if (status === "SUCCESS") {
          this.progressSpinnerDialog.close();
          const modal = await this.modalCtrl.create({
            component: ViewPdfComponent,
            componentProps: {
              base64: data,
              documentName: "Acknowledgement",
              fileName: "ACKNOWLEDGEMENT_" + new Date().getTime() + ".pdf",
            },
          });
          modal.present();
        } else {
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
      },
      (error) => {
        this.progressSpinnerDialog.close();
        if (this.emdReceiptCounter < 1) {
          this.emdReceiptCounter++;
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-unable-fetch-file")
            .then((num) => {
              this.showAcknowledgement();
            });
        }
      }
    );
  }

  async showReceipt() {
    this.fetchReceipt();
  }

  verifyPayment() {
    this.verifyPaymentClicked = true;
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .verifyPaymentAgainstApplication(this.key)
      .subscribe(
        async (data) => {
          this.emdReceiptCounter = 0;
          this.progressSpinnerDialog.close();
          if (data.status === "SUCCESS") {
            if (data.applicationId === this.key) {
              if (data.paymentStatus === "Payment received") {
                this.statusMsg = data.paymentStatus;
                this.statusIcon = data.paymentStatusIcon;
              } else {
                this.preLotteryApplicationService.showErrorToast(
                  data.paymentStatus
                );
              }
            }
          } else {
            this.preLotteryApplicationService.showErrorToast(data.errorMessage);
          }
        },
        (error) => {
          this.progressSpinnerDialog.close();
          if (this.emdReceiptCounter < 1) {
            this.emdReceiptCounter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(error, "error-unable-verify-payment")
              .then((num) => {
                this.verifyPayment();
              });
          }
        }
      );
  }

  fetchReceipt() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchEMDReceipt(this.key).subscribe(
      async ({ status, data, errorMessage }) => {
        this.emdReceiptCounter = 0;
        if (status === "SUCCESS") {
          this.progressSpinnerDialog.close();
          const modal = await this.modalCtrl.create({
            component: ViewPdfComponent,
            componentProps: {
              base64: data,
              documentName: "EMD Receipt",
              fileName: "EMD_RECEIPT_" + new Date().getTime() + ".pdf",
            },
          });
          modal.present();
        } else {
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
      },
      (error) => {
        this.progressSpinnerDialog.close();
        if (this.emdReceiptCounter < 1) {
          this.emdReceiptCounter++;
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-unable-fetch-file")
            .then((num) => {
              this.fetchReceipt();
            });
        }
      }
    );
  }
}

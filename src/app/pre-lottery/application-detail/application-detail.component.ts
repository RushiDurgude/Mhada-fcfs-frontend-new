import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ModalController, ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ApplicationListItemModel } from "../models/application-list-item.model";
import { ApplicationModel } from "../models/application.model";
import { PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { ViewPdfComponent } from "../view-pdf/view-pdf.component";

@Component({
  selector: "app-application-detail",
  templateUrl: "./application-detail.component.html",
  styleUrls: ["../pre-lottery.component.scss"],
})
export class ApplicationDetailComponent implements OnInit {
  applicationKey: number;
  applicationModel: ApplicationListItemModel;
  progressSpinnerDialog: any = null;
  formLoadStatus: string;
  formLoadErrorMessage: string;
  loaded: boolean = false;
  counter: number = 0;
  polCounter: number = 0;

  constructor(
    private preLotteryApplicationService: PreLotteryApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private translocoService: TranslocoService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.applicationKey = +params["applicationKey"];

      let refundStatus = params["refund"];
      if(refundStatus) {
        this.successToast(this.translocoService.translate("success-refund-details-updated"));
      }

      this.loadData();
    });
  }

  async successToast(msg) {
    await this._snackBar.open(
      msg,
      "Close", {
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: "success-toast1",
        duration: 3 * 1000,
      }
    );
  }

  loadData() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchApplicationDetail(this.applicationKey).subscribe(
      (applicationModel) => {
        console.log('closing');
        this.progressSpinnerDialog.close();
        this.applicationModel = applicationModel;
        this.formLoadStatus = applicationModel.status;
        this.formLoadErrorMessage = applicationModel.errorMessage;

        this.loaded = true;
      },
      (error) => {
        this.progressSpinnerDialog.close();
        if (this.counter < 1) {
          this.counter++;
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-application-detail-load")
            .then((num) => {
              this.loadData();
            });
        }
      }
    );
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

  async viewPOL() {
    this.fetchPOL();
  }

  fetchPOL() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchPOL(this.applicationKey).subscribe(
      async ({ status, data, errorMessage }) => {
        if (status === "SUCCESS") {
          this.progressSpinnerDialog.close();
          const modal = await this.modalCtrl.create({
            component: ViewPdfComponent,
            componentProps: {
              base64: data,
              documentName: "Provisional Offer Letter",
              fileName: "POL_" + new Date().getTime() + ".pdf",
            },
          });
          modal.present();
        } else {
          this.progressSpinnerDialog.close();
          this.showErrorToast(errorMessage);
        }
      },
      (error) => {
        this.progressSpinnerDialog.close();
        if (this.polCounter < 1) {
          this.polCounter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error, "error-pol-load").then((num) => {
            this.loadData();
          });
        }
      }
    );
  }
}

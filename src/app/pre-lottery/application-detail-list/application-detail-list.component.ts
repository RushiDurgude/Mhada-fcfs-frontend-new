import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { ApplicationListItemModel } from "../models/application-list-item.model";
import {
  AlertController,
  IonModal,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { FilterListComponent } from "../filter-list/filter-list.component";
import { InAppBrowser, InAppBrowserEvent, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { TranslocoService } from "@ngneat/transloco";
// import {MatIconModule} from '@angular/material/icon';
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Page } from "src/app/pre-lottery/models/Page";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { LetterOfIntimationComponent } from "../letter-of-intimation/letter-of-intimation.component";
import { TimelineDataModel } from "../models/timeline-data.model";
import { PostLotteryApplicationListItemModel } from "../models/post-lottery-application-list";
import { ViewPdfComponent } from "../view-pdf/view-pdf.component";
import { CorrigendumModalComponent } from "../corrigendum-modal/corrigendum-modal.component";
import { SurrenderRemarkComponent } from "../surrender-remark/surrender-remark.component";

@Component({
  selector: "app-application-detail-list",
  templateUrl: "./application-detail-list.component.html",
  styleUrls: [
    "../pre-lottery.component.scss",
    "./application-detail-list.component.scss",
  ],
})
export class ApplicationDetailListComponent implements OnInit {
  applicationList: ApplicationListItemModel[] = [];
  dataLoaded: boolean = false;
  dataFiltered: boolean = true;
  progressSpinnerDialog: any = null;
  counter: number = 0;
  loiCounter: number = 0;
  isSearchDisabled: boolean = false;
  isLoading = false;
  page: Page<ApplicationListItemModel>;
  filterForm: FormGroup = new FormGroup({});
  timelineData: TimelineDataModel[];
  loadCounter: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;

  dataSource: MatTableDataSource<ApplicationListItemModel> =
    new MatTableDataSource();
  displayedColumns: string[] = [
    "id",
    "applicationNo",
    "schemeName",
    "categoryCode",
    "applicationFormStatus",
    "applicationEmdPaymentStatus",
    "applicationDrawStatus",
    "action",
  ];

  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild("paginator1") paginator1: MatPaginator;
  dataSourcePostLottery: MatTableDataSource<PostLotteryApplicationListItemModel> =
    new MatTableDataSource();
  displayedColumnsPostLottery: string[] = [
    "applicationId",
    "applicationNo",
    "schemeName",
    "categoryCode",
    // "applicationEmdPaymentStatus",
    "applicationDrawStatus",
    "postLotteryStatus",
    "action",
  ];

  selectedTab: number = 0;

  pageSizeOptions: number[] = [10, 25, 100];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;

  pageSizeOptions1: number[] = [10, 25, 100];
  totalRows1 = 0;
  pageSize1 = 10;
  currentPage1 = 0;

  isAllowedForERegistration: boolean = false;
  isAllowedForLOI: boolean = false;
  isAllowedForSurrenderAll: boolean = false;
  isAgrmntAllowed: boolean = false;
  isIndx2Allowed: boolean = false;
  allowedForAcceptence: boolean = false;
  receiptCounter: number = 0;
  allowedForHelpFile: boolean = false;
  polCounter: number = 0;
  spouseErrorMsg: string;
  agrmntLetterBase64: string;
  indx2LetterBase64: string;
  agrmntLetter: File;
  indx2Letter: File;
  agrmntLtrFile: string | ArrayBuffer;
  registrationKey: number = 0;
  applicationNo: number = 0;
  agrmntLtrUpldAppKey: number = 0;
  allotmentLetterCounter: number = 0;
  draftAllotmentLetterCounter: number = 0;
  possessionLetterCounter: number = 0;

  constructor(
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController,
    private dialog: MatDialog,
    private toastController: ToastController,
    private router: Router,
    private iab: InAppBrowser,
    private alertController: AlertController,
    private translocoService: TranslocoService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.selectedTab = 0;
      if (params["post"]) {
        this.selectedTab = 1;
      }
    });

    this.filterForm = new FormGroup({
      filterText: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });

    this.onLoad();
  }

  onLoad() {
    this.isLoading = true;
    this.preLotteryApplicationService
      .fetchApplicationDetailsLists(
        this.currentPage,
        this.pageSize,
        this.filterForm.value.filterText
      )
      .subscribe(
        (data) => {
          this.isAllowedForLOI = data.allowedForLOI;
          this.isAllowedForSurrenderAll = data.allowedForSurrenderAll;
          this.allowedForAcceptence = data.allowedForAcceptence;
          this.spouseErrorMsg = data.spouseErrorMsg;
          this.dataSource = new MatTableDataSource(data.page.content);
          this.dataSourcePostLottery = new MatTableDataSource(
            data.pagePostLottery.content
          );
          this.allowedForHelpFile = data.allowedForHelpFile;

          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = data.page.totalElements;

            console.log("page", this.currentPage, data.page.totalElements);

            this.paginator1.pageIndex = this.currentPage1;
            this.paginator1.length = data.pagePostLottery.totalElements;
            console.log(
              "pagePostLottery",
              this.currentPage1,
              data.pagePostLottery.totalElements
            );
          });
          this.isSearchDisabled = false;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.isSearchDisabled = false;
          if (this.counter < 1) {
            this.counter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(error, "error-application-list-load")
              .then((num) => {
                this.onLoad();
              });
          }
        }
      );
  }

  onSearch() {
    if (this.filterForm.valid) {
      this.currentPage = 0;
      this.currentPage1 = 0;
      this.onLoad();
    } else {
      this._snackBar.open(
        "Please enter Filter text (minimum - 3 char) for Application",
        "Close",
        {
          horizontalPosition: "right",
          verticalPosition: "top",
          panelClass: "warning-toast1",
          duration: 3 * 1000,
        }
      );
      this.isSearchDisabled = false;
    }
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
  resetFilter(e) {
    console.log(e?.index);
    if (this.allowedForHelpFile && e?.index === 1) {
      console.log('Its work');
      this.openHelpFile();
    }
    this.filterForm.controls["filterText"].setValue(null);
    this.currentPage = 0;
    this.currentPage1 = 0;
    this.onLoad();

  }

  openHelpFile() {
    this.preLotteryApplicationService
      .fetchPostLotteryHelpFile()
      .subscribe(
        async ({ status, data, errorMessage }) => {
          if (status === "SUCCESS") {
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Help File",
                fileName: "Help File.pdf",
              },
            });
            modal.present();
          }
        }
      );
  }

  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterListComponent,
      componentProps: {
        timelineData: [],
      },
    });
    modal.present();
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.onLoad();
  }

  pageChanged1(event: PageEvent) {
    console.log({ event });
    this.pageSize1 = event.pageSize;
    this.currentPage1 = event.pageIndex;
    this.onLoad();
  }

  async openModal() {
    this.preLotteryApplicationService.fetchLOIs(0, 10).subscribe(
      async (data) => {
        const modal = await this.modalCtrl.create({
          component: LetterOfIntimationComponent,
          componentProps: {
            page: data,
          },
        });
        modal.present();
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        if (this.loiCounter < 1) {
          this.loiCounter++;
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-application-list-load")
            .then((num) => {
              this.openModal();
            });
        }
      }
    );
    // get lotterywise loi against registration
    // pre lottery service
    // fetch registration loi model list
    // populate to LOI component
  }

  async openModalForCorrigendum() {
    this.preLotteryApplicationService.downloadCorrigendum(0, 10).subscribe(
      async (data) => {
        const modal = await this.modalCtrl.create({
          component: CorrigendumModalComponent,
          componentProps: {
            page: data,
          },
        });
        modal.present();
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
        if (this.loiCounter < 1) {
          this.loiCounter++;
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-application-list-load")
            .then((num) => {
              this.openModal();
            });
        }
      }
    );
  }

  showAcceptedApplicationPdf(appkey: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchEsignAcceptSurrenderTenementPdf(appkey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          if (status === "SUCCESS") {
            this.progressSpinnerDialog.close();
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Esign Document",
                fileName: "Esign_Document.pdf",
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
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-unable-fetch-file")
            .then((num) => {
              this.showAcceptedApplicationPdf(appkey);
            });
          // }
        }
      );
  }

  showFinalScrutinyLetterPdf(appkey: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchFinalScrutinyLetterPdf(appkey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          if (status === "SUCCESS") {
            this.progressSpinnerDialog.close();
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Final Scrutiny Letter",
                fileName: "Final_Scrutiny_Letter.pdf",
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
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-unable-fetch-file")
            .then((num) => {
              this.showFinalScrutinyLetterPdf(appkey);
            });
          // }
        }
      );
  }

  async showReceipt(applicationKey) {
    this.receiptCounter = 0;
    this.fetchReceipt(applicationKey, "FIRST_INSTALLMENT");
  }

  fetchReceipt(applicationKey: number, installmentType: string) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchInstallmentReceipt(applicationKey, installmentType)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          if (status === "SUCCESS") {
            this.progressSpinnerDialog.close();
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName:
                  "Installment Receipt (" +
                  installmentType.split("_").join(" ") +
                  ")",
                fileName:
                  "INSTALLMENT_RECEIPT_" +
                  installmentType +
                  "_" +
                  new Date().getTime() +
                  ".pdf",
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
          if (this.receiptCounter < 1) {
            this.receiptCounter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(error, "error-installmentreceipt-load")
              .then((num) => {
                this.fetchReceipt(applicationKey, installmentType);
              });
          }
        }
      );
  }

  async revertSurrender(applicationKey: number, applicationNo: string) {
    let acceptText =
      "Are you sure you want to <b>Revert Surrender</b> application no - <b>" + applicationNo + "</b><br><br><br>";
    this.alertController
      .create({
        header: "Confirm",
        message: acceptText,
        backdropDismiss: false,
        buttons: [
          {
            text: "Confirm",
            handler: () => {
              this.finallyConfirmTenement(applicationKey);
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

  async finallyConfirmTenement(applicationKey) {

    const modal = await this.modalCtrl.create({
      component: SurrenderRemarkComponent,
      componentProps: {
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (data != null && role === 'submit') {
      console.log(applicationKey);
      this.displayProgressSpinner();
      this.preLotteryApplicationService.saveRevertSurrenderTenement(applicationKey, data.toString()).subscribe((data) => {
        console.log(data);
        if (data.status === 'SUCCESS') {
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
            console.log('onload stop--' + ev.url);
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
        if (this.loadCounter < 1) {
          this.loadCounter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error,
            "error-submit").then(num => {
              this.finallyConfirmTenement(applicationKey);
            });
        }
      });
    } else {
      this.preLotteryApplicationService.showErrorToast('Please Enter Surrender Reason.');
    }

  }

  async showAllotmentLetter(applicationKey) {
    this.allotmentLetterCounter = 0;
    this.fetchAllotmentLetter(applicationKey);
  }

  async showDraftAllotmentLetter(applicationKey) {
    this.draftAllotmentLetterCounter = 0;
    this.fetchDraftAllotmentLetter(applicationKey);
  }

  async showPossessionLetter(applicationKey) {
    this.possessionLetterCounter = 0;
    this.fetchPossessionLetter(applicationKey);
  }

  async showPOL(applicationKey) {
    this.polCounter = 0;
    this.fetchPOL(applicationKey);
  }

  fetchAllotmentLetter(applicationKey: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchAllotmentLetter(applicationKey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          if (status === "SUCCESS") {
            this.progressSpinnerDialog.close();
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Allotment Letter",
                fileName: "ALLOTMENT_LETTER_" + new Date().getTime() + ".pdf",
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
          if (this.allotmentLetterCounter < 1) {
            this.allotmentLetterCounter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(error, "error-allotmentletter-load")
              .then((num) => {
                this.fetchAllotmentLetter(applicationKey);
              });
          }
        }
      );
  }

  fetchDraftAllotmentLetter(applicationKey: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchDraftAllotmentLetter(applicationKey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          if (status === "SUCCESS") {
            this.progressSpinnerDialog.close();
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Draft Allotment Letter",
                fileName:
                  "DRAFT_ALLOTMENT_LETTER_" + new Date().getTime() + ".pdf",
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
          if (this.draftAllotmentLetterCounter < 1) {
            this.draftAllotmentLetterCounter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(
                error,
                "error-draftallotmentletter-load"
              )
              .then((num) => {
                this.fetchDraftAllotmentLetter(applicationKey);
              });
          }
        }
      );
  }

  fetchPossessionLetter(applicationKey: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchPossessionLetter(applicationKey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          if (status === "SUCCESS") {
            this.progressSpinnerDialog.close();
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Possession Letter",
                fileName: "POSSESSION_LETTER_" + new Date().getTime() + ".pdf",
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
          if (this.possessionLetterCounter < 1) {
            this.possessionLetterCounter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(error, "error-possessionletter-load")
              .then((num) => {
                this.fetchPossessionLetter(applicationKey);
              });
          }
        }
      );
  }

  fetchPOL(applicationKey: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchPOL(applicationKey).subscribe(
      async ({ status, data, errorMessage }) => {
        if (status === "SUCCESS") {
          this.progressSpinnerDialog.close();
          const modal = await this.modalCtrl.create({
            component: ViewPdfComponent,
            componentProps: {
              base64: data,
              documentName: "Provisional Offer Letter (POL)",
              fileName:
                "PROVISIONAL_OFFER_LETTER_" + new Date().getTime() + ".pdf",
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
        if (this.polCounter < 1) {
          this.polCounter++;
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-pol-load")
            .then((num) => {
              this.fetchPOL(applicationKey);
            });
        }
      }
    );
  }


  // Added By Lucifer For acceptance
  async validateAcceptences(applicationKey: number) {
    if (this.allowedForAcceptence == true) {
      this.router.navigate(
        ["/app", "confirm-tenement", "accept", applicationKey],
        { replaceUrl: true }
      );
    } else {
      this.alertController
        .create({
          header: "Note",
          message: this.translocoService.translate(
            this.spouseErrorMsg != null
              ? "error-spouse-winner-acceptance"
              : "error-multi-winner-acceptance"
          ),
          backdropDismiss: false,
          buttons: [
            {
              text: "Cancel",
              role: "cancel",
              handler: () => { },
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    }
  }

  showFinalIneligibleLetterPdf(appkey: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchFinalIneligibleLetterPdf(appkey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          if (status === "SUCCESS") {
            this.progressSpinnerDialog.close();
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Final Ineligible Letter",
                fileName: "Final_Ineligible_Letter.pdf",
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
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-unable-fetch-file")
            .then((num) => {
              this.showFinalIneligibleLetterPdf(appkey);
            });
          // }
        }
      );
  }

  downloadCasteValidityRefLetter(applicationKey: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .downloadCasteValidityRefLetter(applicationKey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          if (status === "SUCCESS") {
            this.progressSpinnerDialog.close();
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Caste Validity Reference Letter",
                fileName: "Caste_Validity_Reference_Letter.pdf",
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
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-unable-fetch-file")
            .then((num) => {
              this.downloadCasteValidityRefLetter(applicationKey);
            });
          // }
        }
      );
  }

  eRegistrationCall(appkey: number) {
    console.log("Eregistration clicked" + appkey);

    if (appkey != null) {
      console.log("Inside IF");
      this.preLotteryApplicationService
        .eRegistrationCall(appkey)
        .subscribe((data) => {
          if (data.status === "SUCCESS") {
            console.log("Received URL >>> ", data.data);
            location.href = data.data;
          }
        });
    } else {
      console.log("Inside ELSE");
      this.showErrorToast("Application Not Found.");
    }
  }

  showAgreement(registrationKey: number, applicationNo: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchAgreementCopy(registrationKey, applicationNo)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          this.progressSpinnerDialog.close();
          if (status === "SUCCESS") {
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Agreement Copy",
                fileName: "Agreement_Document.pdf",
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
          this.showErrorToast("Unable to fetch Agreement Letter");
        }
      );
  }

  showIndex2Ltr(registrationKey: number, applicationNo: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchIndex2Copy(registrationKey, applicationNo)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          this.progressSpinnerDialog.close();
          if (status === "SUCCESS") {
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Index 2 Copy",
                fileName: "Index_2_Document.pdf",
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
          this.showErrorToast("Unable to fetch Index 2 Letter");
        }
      );
  }

  agrmntLtrUpload(event1, registrationKey: number, applicationNo: number) {
    this.agrmntLetter = event1.target.files[0];
    this.registrationKey = registrationKey;
    this.applicationNo = applicationNo;

    this.agrmntLetter = event1.target.files[0];
    if (this.agrmntLetter && this.agrmntLetter.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.agrmntLetterBase64 = reader.result as string;
        this.uploadAgrmntLetterToAPI();
      };

      reader.readAsDataURL(this.agrmntLetter);
    } else {
      this.showErrorToast("Please select a valid PDF file.");
    }
  }

  indx2LtrUpload(event1, registrationKey: number, applicationNo: number) {
    this.indx2Letter = event1.target.files[0];
    this.registrationKey = registrationKey;
    this.applicationNo = applicationNo;

    this.indx2Letter = event1.target.files[0];
    if (this.indx2Letter && this.indx2Letter.type === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.indx2LetterBase64 = reader.result as string;
        this.uploadIndx2LetterToAPI();
      };

      reader.readAsDataURL(this.indx2Letter);
    } else {
      this.showErrorToast("Please select a valid PDF file.");
    }
  }

  uploadAgrmntLetterToAPI() {
    this.preLotteryApplicationService
      .uploadAgrmntLtr(
        this.registrationKey,
        this.applicationNo,
        this.agrmntLetterBase64 == null ? "NO UPDATE" : this.agrmntLetterBase64
      )
      .subscribe(
        (data: any) => {
          if (data.status === "SUCCESS") {
            this.successToast("Agreement Letter Uploaded successfully.");
            // this.ngOnInit;
            this.onLoad();
          } else {
            this.showErrorToast(data.errorMessage);
          }
        },
        (error) => {
          this.showErrorToast(error.error.errorMessage);
        }
      );
  }

  uploadIndx2LetterToAPI() {
    this.preLotteryApplicationService
      .uploadIndxLtr(
        this.registrationKey,
        this.applicationNo,
        this.indx2LetterBase64 == null ? "NO UPDATE" : this.indx2LetterBase64
      )
      .subscribe(
        (data: any) => {
          if (data.status === "SUCCESS") {
            this.successToast("Index 2 Letter Uploaded successfully.");
            this.onLoad();
          } else {
            this.showErrorToast(data.errorMessage);
          }
        },
        (error) => {
          this.showErrorToast(error.error.errorMessage);
        }
      );
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

  onFileSelect(event) {
    this.agrmntLetter = event.target.files[0];
    console.log("File >>>>> ", this.agrmntLetter);

    const reader = new FileReader();
    reader.readAsDataURL(this.agrmntLetter);
    reader.onload = () => {
      this.agrmntLtrFile = reader.result;
    };
  }
}

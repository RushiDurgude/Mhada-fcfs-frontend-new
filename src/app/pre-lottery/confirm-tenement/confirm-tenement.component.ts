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
import { MatDialog } from "@angular/material/dialog";
// import { LoaderComponent } from 'src/app/loader/loader.component';
import { TranslocoService } from "@ngneat/transloco";
// import {MatIconModule} from '@angular/material/icon';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AcceptSurrenderTenementModal } from "../models/acceptsurrendertenementmodal";
import {
  InAppBrowser,
  InAppBrowserEvent,
  InAppBrowserOptions,
} from "@awesome-cordova-plugins/in-app-browser/ngx";
import { LoaderComponent } from "src/app/loader/loader.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SelfandSpouseNameModel } from "../models/SelfandSpouseNameModel";
import { MatRadioChange } from "@angular/material/radio";

@Component({
  selector: "app-confirm-tenement",
  templateUrl: "./confirm-tenement.component.html",
  styleUrls: [
    "../pre-lottery.component.scss",
    "./confirm-tenement.component.scss",
  ],
})
export class ConfirmTenementComponent implements OnInit {
  applicationList: ApplicationListItemModel[] = [];
  dataLoaded: boolean = false;
  dataFiltered: boolean = true;
  progressSpinnerDialog: any = null;
  applicationKey: number;
  registrationKey: number;
  type: string;
  acceptTenement: AcceptSurrenderTenementModal;
  loadCounter: number;

  applicantAadharName: string;
  applicantPanName: string;
  spouseAadhaarName: string;
  spousePanName: string;
  spouseAadharName: string;
  applicantName: any;
  spouseName: any;
  selectedName: any;
  selectedSpouseName: any;
  gender: String;
  maritalStatus: String;
  data: SelfandSpouseNameModel;
  spouseConditionVisible: String;
  isSubmitDisabled: boolean = false;

  esignDisabled: boolean = true;
  showAcceptList: boolean = false;
  showSurrenderList: boolean = false;
  allowedForAcceptence: boolean = false;
  nameSelectionForm: FormGroup = new FormGroup({});

  constructor(
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController,
    private dialog: MatDialog,
    private toastController: ToastController,
    private iab: InAppBrowser,
    private router: Router,
    private alertController: AlertController,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.applicationKey = +params["applicationKey"];
      // this.registrationKey = +params["registrationKey"];
      // console.log("   this.registrationKey", this.registrationKey);

      this.type = params["type"];
      this.onLoad();
      this.getApplicantNames(this.applicationKey);
    });

    this.nameSelectionForm = new FormGroup({
      applicantChosenMode: new FormControl(null, Validators.required),
      spouseChosenMode: new FormControl(null, Validators.required),
    });
  }

  onLoad() {
    if (this.type === "accept") {
      this.preLotteryApplicationService
        .fetchAcceptSurrenderTenementList(this.applicationKey)
        .subscribe((data) => {
          this.acceptTenement = data.acceptTenement;

          if (this.acceptTenement) {
            this.showAcceptList = true;
          }
        });
    }
  }

  onSpouseNameApplicableButton(event: any) {
    this.spouseConditionVisible = event.target.checked;
  }

  onCheckboxChange(e: any) {
    if (e.target) {
      // console.log("check box ticked");
      this.esignDisabled = false;
    } else {
      // console.log("check box unticked");
      this.esignDisabled = true;
    }
  }

  async confirmTenement() {
    let acceptText = this.acceptTenement
      ? "Are you sure you want to <b>Accept</b> application no - <b>" +
        this.acceptTenement.applicationNo +
        "</b><br><br><br>"
      : "";
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
            handler: () => {},
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  async finallyConfirmTenement() {
    // this.save();
    console.log("confirm call");
    // console.log(surrenderTenement);
    console.log(this.type);

    const selfAadhaarPanData = {
      gender: this.gender,
      polapplicableSpouseName: this.spouseConditionVisible ? "Y" : "N",
      marriageStatus: this.maritalStatus,
      applicantName: this.selectedName,
      spouseName: this.selectedSpouseName,
      applicationKey: this.applicationKey,
    };

    if (this.type === "accept") {
      console.log(this.acceptTenement?.acceptAppKey);
      this.displayProgressSpinner();
      this.preLotteryApplicationService
        .saveConfirmTenement("accept", this.acceptTenement?.acceptAppKey, selfAadhaarPanData)
        .subscribe(
          (data) => {
            console.log(data);
            if (data.status === "SUCCESS") {
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
                console.log("onload stop--" + ev.url);
                if (
                  ev.url.startsWith(
                    "http://localhost/app/esign-verify"
                  ) ||
                  ev.url.startsWith(
                    "http://localhost:8100/app/esign-verify"
                  ) ||
                  ev.url.startsWith(
                    "https://cidcohousing.probitysoftware.in/app/esign-verify"
                  ) ||
                  ev.url.startsWith(
                    "https://housing.pmrda.gov.in/app/esign-verify"
                  ) ||
                  ev.url.startsWith(
                    "https://sqtchousing.mhada.gov.in/app/esign-verify"
                  )
                ) {
                  browser.close();
                  this.progressSpinnerDialog.close();
                  localStorage.setItem(
                    "lastRoute",
                    "/app/esign-verify/"
                  );
                  this.router.navigate(["/app", "esign-verify"], {
                    replaceUrl: true,
                  });
                  window.location.reload();
                } else if (
                  ev.url.startsWith(
                    "http://localhost/app/surrender-tenement"
                  ) ||
                  ev.url.startsWith(
                    "http://localhost:8100/app/surrender-tenement"
                  ) ||
                  ev.url.startsWith(
                    "https://cidcohousing.probitysoftware.in/app/surrender-tenement"
                  ) ||
                  ev.url.startsWith(
                    "https://housing.pmrda.gov.in/app/surrender-tenement"
                  ) ||
                  ev.url.startsWith(
                    "https://sqtchousing.mhada.gov.in/app/surrender-tenement"
                  ) ||
                  ev.url.startsWith(
                    "http://localhost/app/confirm-tenement"
                  ) ||
                  ev.url.startsWith(
                    "http://localhost:8100/app/confirm-tenement"
                  ) ||
                  ev.url.startsWith(
                    "https://cidcohousing.probitysoftware.in/app/confirm-tenement"
                  ) ||
                  ev.url.startsWith(
                    "https://housing.pmrda.gov.in/app/confirm-tenement"
                  ) ||
                  ev.url.startsWith(
                    "https://sqtchousing.mhada.gov.in/app/confirm-tenement"
                  )
                ) {
                  browser.close();
                  this.progressSpinnerDialog.close();
                  localStorage.setItem(
                    "lastRoute",
                    "/app/application-detail-list/"
                  );
                  this.router.navigate(
                    ["/app", "application-detail-list"],
                    { replaceUrl: true }
                  );
                  window.location.reload();
                }
              });
            } else {
              this.progressSpinnerDialog.close();
              this.preLotteryApplicationService.showErrorToast(
                data.errorMessage
              );
            }
          },
          (error) => {
            this.progressSpinnerDialog.close();
            if (this.loadCounter < 1) {
              this.loadCounter++;
              this.preLotteryApplicationService
                .checkErrorForExpiredToken(error, "error-submit")
                .then((num) => {
                  this.finallyConfirmTenement();
                });
            }
          }
        );
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

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  toggleAppName(event: MatRadioChange) {
    this.selectedName = event.value;
    console.log("Selected AppName:", this.selectedName);
  }

  toggleSposName(event: MatRadioChange) {
    this.selectedSpouseName = event.value;
    console.log("Selected SposName:", this.selectedSpouseName);
  }

  // toggleSposName(event: any) {
  //   // Handle spouse name selection logic here
  //   console.log('Selected spouse name type:', event.value);
  // }

  getApplicantNames(applicationKey: number) {
    this.preLotteryApplicationService
      .getSelfandSpouseName(applicationKey)
      .subscribe(
        (data) => {
          console.log(data);
          this.applicantAadharName = data.applicantAadharName;
          this.applicantPanName = data.applicantPanName;
          this.spouseAadharName = data.spouseAadharName;
          this.spousePanName = data.spousePanName;
          this.maritalStatus = data.marriageStatus;
          this.gender = data.gender
          this.progressSpinnerDialog.close();
        },
        (error) => {
          this.progressSpinnerDialog.close();

          console.log(error);
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

  async save() {
    const data = {
      gender: this.gender,
      polapplicableSpouseName: this.spouseConditionVisible ? "Y" : "N",
      marriageStatus: this.maritalStatus,
      applicantName: this.selectedName,
      spouseName: this.selectedSpouseName,
      applicationKey: this.applicationKey,
    };
    // this.preLotteryApplicationService
    //   .saveSelfandSpouseName(data)
    //   .subscribe((data: any) => {
    //     if (data.status === "SUCCESS") {
    //       this.successToast("Data Saved Successfully");
    //       this.router.navigate(["/app", "application-detail-list"]);
    //     } else {
    //       this.isSubmitDisabled = false;
    //       this.showErrorToast(data.errorMessage);
    //       // this.showErrorToast("Please Select Required Detail");
    //     }
      // });
  }
}

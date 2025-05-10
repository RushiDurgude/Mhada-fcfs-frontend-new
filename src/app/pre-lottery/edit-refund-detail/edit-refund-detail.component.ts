import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ApplicationRefundFormModel } from "../models/application-refund-form.model";
import { ApplicationModel } from "../models/application.model";
import { PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { ValidateName } from "../validator.util";
import { ThemeService } from "src/app/theme.service";

@Component({
  selector: "app-edit-refund-detail",
  templateUrl: "./edit-refund-detail.component.html",
  styleUrls: ["../pre-lottery.component.scss"],
})
export class EditRefundDetailComponent implements OnInit {
  applicationRefundFormModel: ApplicationRefundFormModel;
  applicationKey: number;
  appForm: FormGroup = new FormGroup({});
  formValidMessage: boolean = true;
  formSubmitted: boolean = false;
  application: ApplicationModel;
  isApplyDisabled: boolean = false;
  showBack: boolean = true;
  formLoadStatus: string;
  formLoadErrorMessage: string;
  progressSpinnerDialog: any = null;
  loaded: boolean = false;
  counter: number = 0;
  submitCounter: number = 0;
  loadCounter: number = 0;
  bankName: string;
  branchName: string;
  nameAsOnAccountError: boolean = false;
  bankAndConfirmBankAccountError: boolean = false;
  bankError: boolean = false;
  applicationNo: string;
  schemeCode: string;
  schemeName: string;
  categoryCode: string;
  categoryName: string;
  isDarkMode: boolean;

  showChequePassbookUpload: boolean = false;
  uploadedBankChequePassbookFile: string | ArrayBuffer;
  uploadedBankChequePassbookFileName: string;

  constructor(
    private preLotteryApplicationService: PreLotteryApplicationService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private toastController: ToastController,
    private themeService: ThemeService
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.applicationKey = +params["applicationKey"];

      this.loadData();
    });
    this.isDarkMode = this.themeService.isDarkMode();

    this.appForm = new FormGroup({
      refundMode: new FormControl(null, Validators.required),
      refundForm: new FormGroup({}),
    });
  }

  loadData() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchApplicationForEditRefund(this.applicationKey)
      .subscribe(
        (applicationRefundFormModel) => {
          this.progressSpinnerDialog.close();
          if (applicationRefundFormModel.status === "SUCCESS") {
            this.applicationRefundFormModel = applicationRefundFormModel;

            this.applicationNo = applicationRefundFormModel.applicationNo;
            this.schemeCode = applicationRefundFormModel.schemeCode;
            this.schemeName = applicationRefundFormModel.schemeName;
            this.categoryCode = applicationRefundFormModel.categoryCode;
            this.categoryName = applicationRefundFormModel.categoryName;

            this.showChequePassbookUpload =
              applicationRefundFormModel.showChequePassbookUpload;

            if (
              this.applicationRefundFormModel.bankVerification &&
              (this.applicationRefundFormModel.bankVerification ===
                "PENNY_TEST" ||
                this.applicationRefundFormModel.bankVerification ===
                  "NO_BANK_VERIFICATION")
            ) {
              this.appForm.patchValue({
                refundMode: "REFUND_TO_BANK",
              });
              this.showRefundDetails(true, applicationRefundFormModel);
            } else {
              this.appForm.patchValue({
                refundMode: applicationRefundFormModel.refundMode,
              });
              if (applicationRefundFormModel.refundMode === "REFUND_TO_BANK") {
                this.showRefundDetails(true, applicationRefundFormModel);
              }
            }

            this.formLoadStatus = applicationRefundFormModel.status;
            this.formLoadErrorMessage = applicationRefundFormModel.errorMessage;

            this.loaded = true;
          } else {
            this.showErrorToast(applicationRefundFormModel.errorMessage);
          }
        },
        (error) => {
          this.progressSpinnerDialog.close();
          if (this.counter < 1) {
            this.counter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(
                error,
                "error-application-refund-form-load"
              )
              .then((num) => {
                this.loadData();
              });
          }
        }
      );
  }

  onSubmit() {
    console.log(this.appForm.valid, this.appForm.value);
    if (this.appForm.valid) {
      this.submitCounter = 0;
      this.bankAndConfirmBankAccountError = false;
      this.nameAsOnAccountError = false;
      this.bankError = false;

      if (this.appForm.value.refundMode === "REFUND_TO_BANK") {
        if (this.bankName === null) {
          this.bankError = true;
          this.formValidMessage = false;
          return;
        }

        console.log(
          "bankAccountNo-confirmBankAccountNo---",
          this.appForm.value.refundForm?.bankAccountNo !==
            this.appForm.value.refundForm?.confirmBankAccountNo
        );
        if (
          this.appForm.value.refundForm?.bankAccountNo !==
          this.appForm.value.refundForm?.confirmBankAccountNo
        ) {
          this.bankAndConfirmBankAccountError = true;
          this.formValidMessage = false;
          return;
        }

        console.log(
          "nameAsOnBank--",
          !ValidateName(this.appForm.value.refundForm?.nameAsOnBank)
        );
        if (!ValidateName(this.appForm.value.refundForm?.nameAsOnBank)) {
          this.nameAsOnAccountError = true;
          this.formValidMessage = false;
          return;
        }
      }

      this.submitForm();
    } else {
      this.isApplyDisabled = false;
      this.formValidMessage = false;
    }
  }

  submitForm() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .saveApplicationRefundDetail(
        this.applicationKey,
        this.appForm.value.refundMode,
        this.appForm.value.refundForm?.nameAsOnBank,
        this.appForm.value.refundForm?.bankAccountNo,
        this.appForm.value.refundForm?.ifsc,
        this.uploadedBankChequePassbookFile
      )
      .subscribe(
        ({ status, errorMessage }) => {
          this.progressSpinnerDialog.close();
          if (status === "SUCCESS") {
            this.showBack = false;
            this.showSucessToast("Refund Request Submitted.");
            this.router.navigate(
              [
                "/app",
                "application-detail-lists"
              ],
              { replaceUrl: true }
            );
          } else {
            this.isApplyDisabled = false;
            this.showErrorToast(errorMessage);
          }
        },
        (error) => {
          this.progressSpinnerDialog.close();
          this.isApplyDisabled = false;
          if (this.submitCounter < 1) {
            this.submitCounter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(error, "error-application-form-submit")
              .then((num) => {
                this.submitForm();
              });
          }
        }
      );
  }

  showRefundDetails(
    flag: boolean,
    applicationRefundFormModel: ApplicationRefundFormModel
  ) {
    if (flag) {
      console.log("showRefundDetails flag", flag);
      let refundForm: FormGroup = this.appForm.get("refundForm") as FormGroup;
      refundForm.addControl(
        "nameAsOnBank",
        new FormControl(null, [Validators.required])
      );
      refundForm.addControl(
        "bankAccountNo",
        new FormControl(null, Validators.required)
      );
      refundForm.addControl(
        "confirmBankAccountNo",
        new FormControl(null, Validators.required)
      );
      refundForm.addControl(
        "ifsc",
        new FormControl(null, [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ])
      );

      if (this.showChequePassbookUpload) {
        refundForm.addControl(
          "uploadBankChequePassbookFile",
          new FormControl(null)
        );
      }

      if (applicationRefundFormModel) {
        refundForm.patchValue({
          nameAsOnBank: applicationRefundFormModel.nameAsOnBank,
          bankAccountNo: applicationRefundFormModel.bankAccountNo,
          confirmBankAccountNo: applicationRefundFormModel.bankAccountNo,
          ifsc: applicationRefundFormModel.ifsc,
        });
        this.bankName = applicationRefundFormModel.bankName;
        this.branchName = applicationRefundFormModel.branchName;
      }
    } else {
      let refundForm: FormGroup = this.appForm.get("refundForm") as FormGroup;
      refundForm.removeControl("nameAsOnBank");
      refundForm.removeControl("bankAccountNo");
      refundForm.removeControl("confirmBankAccountNo");
      refundForm.removeControl("ifsc");

      if (this.showChequePassbookUpload) {
        refundForm.removeControl("uploadBankChequePassbookFile");
      }
    }
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

  async showSucessToast(sucessMessage: string) {
    const toast = await this.toastController.create({
      message: sucessMessage,
      icon: "information-circle",
      position: "top",
      cssClass: "toast success-toast",
      duration: 4000,
    });
    toast.present();
  }

  fetchBankDetails() {
    console.log(this.appForm.value);
    this.bankName = null;
    this.branchName = null;
    if (
      this.appForm.value.refundForm?.ifsc &&
      this.appForm.value.refundForm?.ifsc.length === 11
    ) {
      this.displayProgressSpinner();

      this.preLotteryApplicationService
        .fetchBankDetailsForIFSC(this.appForm.value.refundForm?.ifsc)
        .subscribe(
          async (data) => {
            this.loadCounter = 0;
            this.progressSpinnerDialog.close();
            if (data.status === "SUCCESS") {
              this.bankName = data.bankName;
              this.branchName = data.branchName;
            } else {
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
                .checkErrorForExpiredToken(error, "error-unable-fetch-bank")
                .then((num) => {
                  this.fetchBankDetails();
                });
            }
          }
        );
    }
  }

  onBankChequePassbookFileSelect(event: any) {
    console.log("selected file", event.target.files[0]);
    this.uploadedBankChequePassbookFileName = null;
    if (event.target.files[0]) {
      if (event.target.files[0].size <= 1 * 1000 * 1024) {
        if (event.target.files[0].type === "application/pdf") {
          const reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = () => {
            this.uploadedBankChequePassbookFile = reader.result;
            this.uploadedBankChequePassbookFileName =
              event.target.files[0].name;
          };
        } else {
          this.showErrorToast("Please select PDF File");
        }
      } else {
        this.showErrorToast("Please select File upto - " + 1 + "MB");
      }
    }
  }

  viewRefundForm() {
    return this.appForm.get("refundForm") as FormGroup;
  }
}

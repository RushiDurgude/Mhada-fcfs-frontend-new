import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { ModalController, ToastController } from "@ionic/angular";
import { PreLotteryApplicationService } from "../../services/pre-lottery-application.service";
import { ViewPdfComponent } from "../../view-pdf/view-pdf.component";
import { LoaderComponent } from "src/app/loader/loader.component";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  selector: "app-applicant-hearing-view",
  templateUrl: "./applicant-hearing-view.component.html",
  styleUrls: ["../../pre-lottery.component.scss"],
})
export class ApplicantHearingViewComponent implements OnInit {
  applicationList: { [key: number]: string };
  progressSpinnerDialog: any = null;
  applicationNo: string;
  applicantName: string;
  additionalDocument: string;
  appealLetter: string;
  appealType: string;
  applicationKey: number;
  remark: string;
  appealHearingStatus: string;
  selectedFile: File;
  selectedFile1: File;
  demoFile1: string;
  remark1: string;
  rejectRemark: string;
  hearingRemark: string;

  demoFile2: string;
  orderDocumentFile: string;
  pageMode: string;
  form: FormGroup = new FormGroup({});
  isSubmitDisabled: boolean = false;
  fileUploadStatus: string;
  isLoading = false;

  appealLetterFile: string | ArrayBuffer;
  additionalDocumentFile: string | ArrayBuffer;

  constructor(
    private preLotteryApplicationService: PreLotteryApplicationService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private translocoService: TranslocoService
  ) {}

  ngOnInit() {
    console.log("View NOC Details component on init called");
    this.route.params.subscribe((params: Params) => {
      this.applicationKey = +params["applicationKey"];
      this.appealType = params["appealType"];

      console.log("applicationKey for View Details", this.appealType);

      this.preLotteryApplicationService
        .fetchapplicantdtlView(this.applicationKey, this.appealType)
        .subscribe((data) => {
          console.log("API status************", data);
          if (data.status === "SUCCESS") {
            this.applicationNo = data.applicationNo;
            this.applicantName = data.applicantName;
            this.applicationKey = data.applicationKey;
            this.remark1 = data.remark;
            this.rejectRemark = data.rejectRemark;
            this.hearingRemark = data.hearingRemark;
            this.demoFile1 = data.appealLetterFile;
            this.appealHearingStatus = data.appealHearingStatus;

            this.demoFile2 = data.additionalDocumentFile;
            this.orderDocumentFile = data.orderDocumentFile;
          } else {
          }
        });

      this.form = new FormGroup({
        appealLetterFile: new FormControl(null, Validators.required),
        additionalDocumentFile: new FormControl(),
        remark: new FormControl(null, Validators.required),

        file: new FormControl(null, Validators.required),
        file1: new FormControl(null, Validators.required),
      });
    });
  }

  onAppealFileSelect(event) {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile && this.selectedFile.type === "application/pdf") {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
          this.appealLetterFile = reader.result;
          const fileNameParts = this.selectedFile.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.appealLetter = fileNameWithoutExtension;
        };

        console.log("reader 1", reader.result);
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please select a valid PDF file."
        );
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 2MB."
      );
    }
  }
  onFileSelect(event) {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.selectedFile1 = event.target.files[0];
      if (this.selectedFile1 && this.selectedFile1.type === "application/pdf") {
        console.log("this.selectedFile", this.selectedFile1);
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile1);
        reader.onload = () => {
          this.additionalDocumentFile = reader.result;
          const fileNameParts = this.selectedFile1.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.additionalDocument = fileNameWithoutExtension;
        };

        console.log("reader 1", reader.result);
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please select a valid PDF file."
        );
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 2MB."
      );
    }
  }
  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }
  validateappealLetterFile() {
    return typeof this.appealLetterFile === "string" ? true : false;
  }
  validateadditionalDocumentFile() {
    return typeof this.additionalDocumentFile === "string" ? true : false;
  }
  submitAppeal() {
    console.log(" appealLetterFile", this.appealLetterFile);
    console.log(" this.additionalDocumentFile", this.additionalDocumentFile);
    if (this.form.value.remark !== null && this.form.value.remark !== "") {
      this.isLoading = true;
      if (!this.validateappealLetterFile()) {
        this.preLotteryApplicationService.showErrorToast(
          this.translocoService.translate("error-appealLetterFile-upload")
        );
        return;
      }
      if (!this.validateadditionalDocumentFile()) {
        this.preLotteryApplicationService.showErrorToast(
          this.translocoService.translate("error-appealDocFile-upload")
        );
        return;
      }
      console.log(" this.remark", this.form.value.remark);
      this.displayProgressSpinner();
      this.preLotteryApplicationService
        .uploadAppealDetails(
          this.applicationKey,
          this.appealLetterFile,
          this.additionalDocumentFile,
          this.applicationNo,
          this.applicantName,
          this.form.value.remark,

          this.additionalDocument,
          this.appealLetter,
          this.appealType
        )
        .subscribe(
          (data: any) => {
            this.progressSpinnerDialog.close();
            if (data.status === "SUCCESS") {
              this.preLotteryApplicationService.successToast(
                "Successfully Saved"
              );
              this.isLoading = true;
              this.isSubmitDisabled = false;
              this.router.navigate(["/app", "application-detail-list"]);
            } else {
              this.preLotteryApplicationService.showErrorToast(
                data.errorMessage
              ); // TODO success msg
            }
          },
          (error) => {
            this.progressSpinnerDialog.close();
            this.preLotteryApplicationService.showErrorToast(""); // TODO error msg
          }
        );
    } else {
      this.preLotteryApplicationService.showErrorToast("Remark is requied.");
    }
  }
  showOrderdocfile() {
    appealdocfile: String;
    this.isLoading = true;
    console.log("this.applicationKey", this.applicationKey);
    this.preLotteryApplicationService
      .fetchOrderdocfile("orderdocfile", this.applicationKey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          this.isLoading = false;
          if (status === "SUCCESS") {
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Order Document",
                fileName:
                  "ACKNOWLEDGEMENT_" +
                  this.applicationKey +
                  "_" +
                  new Date().getTime() +
                  ".pdf",
              },
            });
            modal.present();
          } else {
            //  this.preLotteryApplicationService.showErrorToast(errorMessage);
          }
        },
        (error) => {
          this.isLoading = false;
          //  this.preLotteryApplicationService.showErrorToast("Unable to fetch As File");
        }
      );
  }
  showappealdocfile() {
    appealdocfile: String;
    this.isLoading = true;
    console.log("this.applicationKey", this.applicationKey);
    this.preLotteryApplicationService
      .fetchAppealdocfile("appealdocfile", this.applicationKey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          this.isLoading = false;
          if (status === "SUCCESS") {
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Additional Appeal Document",
                fileName:
                  "ACKNOWLEDGEMENT_" +
                  this.applicationKey +
                  "_" +
                  new Date().getTime() +
                  ".pdf",
              },
            });
            modal.present();
          } else {
            //  this.preLotteryApplicationService.showErrorToast(errorMessage);
          }
        },
        (error) => {
          this.isLoading = false;
          //  this.preLotteryApplicationService.showErrorToast("Unable to fetch As File");
        }
      );
  }
  showappealfile() {
    appealdocfile: String;
    this.isLoading = true;
    console.log("this.applicationKey", this.applicationKey);
    this.preLotteryApplicationService
      .fetchAppealfile("appealfile", this.applicationKey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          this.isLoading = false;
          if (status === "SUCCESS") {
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Appeal Letter",
                fileName:
                  "ACKNOWLEDGEMENT_" +
                  this.applicationKey +
                  "_" +
                  new Date().getTime() +
                  ".pdf",
              },
            });
            modal.present();
          } else {
            //  this.preLotteryApplicationService.showErrorToast(errorMessage);
          }
        },
        (error) => {
          this.isLoading = false;
          //  this.preLotteryApplicationService.showErrorToast("Unable to fetch As File");
        }
      );
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
}

import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Route, Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ModalController, ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { MatDialog } from "@angular/material/dialog";
import { InstallmentListItemModel } from "../pre-lottery/models/installment-list-item.model";
import { MatTableDataSource } from "@angular/material/table";
import { Page } from "../pre-lottery/models/Page";
import { MatSort } from "@angular/material/sort";
import { PreLotteryApplicationService } from "../pre-lottery/services/pre-lottery-application.service";
import { ViewPdfComponent } from "../pre-lottery/view-pdf/view-pdf.component";
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: "app-tds-file-upload",
  templateUrl: "./tds-file-upload.component.html",
  styleUrls: ["./tds-file-upload.component.scss"],
})
export class TDSFileUploadComponent implements OnInit {
  applicationKey: number;
  dataLoaded: boolean = false;
  progressSpinnerDialog: any = null;
  form: FormGroup = new FormGroup({});
  counter: number = 0;
  isLoading = false;
  selectedFile: File;
  selectedFile1: File;
  selectedFile2: File;
  selectedFile3: File;
  // hidebutton: boolean = false;
  page: Page<InstallmentListItemModel>;
  // applicationKey: number;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('paginator') paginator: MatPaginator;

  cost: any;
  applicationNo: any;

  fileUploadStatus: string;

  qbFile: string | ArrayBuffer;

  asFile: string | ArrayBuffer;

  form16BFile: string | ArrayBuffer;

  challanFile: string | ArrayBuffer;

  demoFile: string;

  demoFile1: string;

  demoFile2: string;

  dataSource: MatTableDataSource<InstallmentListItemModel> =
    new MatTableDataSource();
  displayedColumns: string[] = [
    "id",
    "installment",
    "amount", //"amount","paidAmount","balanceAmount",
    "status",
    "dates", //"startDate","endDate",
    "action",
  ];

  pageSizeOptions: number[] = [25, 100];
  totalRows = 0;
  pageSize = 25;
  currentPage = 0;

  receiptCounter: number = 0;
  tdsRejectRemark: string;

  constructor(
    private route: ActivatedRoute,
    private toastController: ToastController,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController,
    private dialog: MatDialog,
    private translocoService: TranslocoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params["applicationKey"]) {
        this.applicationKey = +params["applicationKey"];
        // new to find tenementCost, verification status, file upload or not
        // new model tenementCost, verification status, file upload or not, applicationKey
        this.preLotteryApplicationService
          .fetchTdsDetilsForApplication(this.applicationKey)
          .subscribe((data) => {
            this.applicationNo = data.applicationNo;
            this.cost = data.tenementCost;
            console.log("data?.qbFile", data?.qbFile);
            console.log("data?.challanFile", data.challanFile);
            this.fileUploadStatus = data.verificationStatus;

            this.demoFile = data?.qbFile;
            console.log("this.demoFile", this.demoFile);

            this.demoFile1 = data?.asFile;
            console.log("this.demoFile1", this.demoFile1);

            this.demoFile2 = data?.challanFile;
            console.log("this.demoFile2", this.demoFile2);

            if (this.fileUploadStatus == null) {
              this.fileUploadStatus = "FILE_UPLOAD_PENDING";
            }
            this.tdsRejectRemark = data.tdsRejectRemark;

            console.log(this.fileUploadStatus);
            // if (this.fileUploadStatus == "FILE_UPLOADED" || "APPROVED") {
            //   this.hidebutton = true;
            // }

            console.log("TDSDetailsForApplicationModel", data.applicationNo);
            // TDSDetailsForApplicationModel
          });
      } else {
        // this.preLotteryApplicationService.showErrorToast(this.translocoService.translate("error-invalid-application"));
      }
    });

    this.form = new FormGroup({
      //applicationKey: new FormControl(null, Validators.required),
      file: new FormControl(null, Validators.required),
      file1: new FormControl(null, Validators.required),
      file2: new FormControl(null, Validators.required),
      file3: new FormControl(null, Validators.required),
    });
  }

  showReceipt(applicationKey: number) {}

  onLoad() {
    this.isLoading = true;
    this.preLotteryApplicationService
      .fetchInstallmentsForApplication(
        this.applicationKey,
        this.currentPage,
        this.pageSize
      )
      .subscribe(
        (data) => {
          this.cost = data.cost;
          this.fileUploadStatus = data.fileUploadStatus;

          let pageContent: InstallmentListItemModel[] = data.page.content;

          if (data.allowForTds) {
            pageContent.push(
              new InstallmentListItemModel(
                0,
                "TDS Certificate",
                "TDS_CERTIFICATE",
                data.cost,
                0,
                0,
                0,
                data.fileUploadStatus !== null
                  ? data.fileUploadStatus
                  : "FILE_UPLOAD_PENDING",
                null,
                data.tdsUploadEndDate,
                null,
                null,
                false,
                false,
                false,
                null,
                null,
                // null,
                null
              )
            );
          }

          setTimeout(() => {
            console.log("page", this.currentPage, data.page.totalElements);
          });
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          if (this.counter < 1) {
            this.counter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(error, "error-installment-list-load")
              .then((num) => {
                this.onLoad();
              });
          }
        }
      );
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  showqbfile() {
    // qbfile: String;
    this.isLoading = true;
    console.log("this.applicationKey", this.applicationKey);
    this.preLotteryApplicationService
      .fetchqbfile("qbfile", this.applicationKey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          this.isLoading = false;
          if (status === "SUCCESS") {
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "26QB File",
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

  showasfile() {
    asfile: String;
    this.isLoading = true;
    console.log("this.applicationKey", this.applicationKey);
    this.preLotteryApplicationService
      .fetchasfile("asfile", this.applicationKey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          this.isLoading = false;
          if (status === "SUCCESS") {
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "26AS File",
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
  showform16Bfile() {
    form16B: String;
    this.isLoading = true;
    console.log("this.applicationKey", this.applicationKey);
    this.preLotteryApplicationService
      .fetchform16Bfile("form16B", this.applicationKey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          this.isLoading = false;
          if (status === "SUCCESS") {
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Form 16-B File",
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

  showChallanfile() {
    challan: String;
    this.isLoading = true;
    console.log("this.applicationKey", this.applicationKey);
    this.preLotteryApplicationService
      .fetchChallanFile("challan", this.applicationKey)
      .subscribe(
        async ({ status, data, errorMessage }) => {
          this.isLoading = false;
          if (status === "SUCCESS") {
            const modal = await this.modalCtrl.create({
              component: ViewPdfComponent,
              componentProps: {
                base64: data,
                documentName: "Challan File",
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

  statusClass(status) {
    if (status === "APPROVED") {
      return "p-1 bg-green-500 text-white border-round-md shadow-4";
    } else if (status === "REJECTED") {
      return "p-1 bg-pink-500 text-white border-round-md shadow-4";
    } else {
      return "p-1 bg-yellow-500 text-white border-round-md shadow-4";
    }
  }

  onFileSelect(event) {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      console.log("Validattion if part Work");
      this.selectedFile = event.target.files[0];
      if (this.selectedFile && this.selectedFile.type === "application/pdf") {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
          this.qbFile = reader.result;
          console.log(this.qbFile);
        };
        console.log("reader 2", reader.result);
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please select a valid PDF file."
        );
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 2MB."
      );
      console.log("Validattion Else part Work");
    }
  }

  onFileSelect1(event) {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      console.log("Validattion if part Work");
      this.selectedFile1 = event.target.files[0];
      if (this.selectedFile1 && this.selectedFile1.type === "application/pdf") {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile1);
        reader.onload = () => {
          this.asFile = reader.result;
          console.log("this.asFile ", this.asFile);
        };
        console.log("reader 2", reader.result);
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please select a valid PDF file."
        );
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 2MB."
      );
      console.log("Validattion Else part Work");
    }
  }

  onFileSelect2(event) {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.selectedFile2 = event.target.files[0];
      if (this.selectedFile2 && this.selectedFile2.type === "application/pdf") {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile2);
        reader.onload = () => {
          this.form16BFile = reader.result;
          console.log("this.form16BFile ", this.form16BFile);
        };
        console.log("reader 3", reader.result);
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
  checkFileExtension4(): boolean {
    if (this.selectedFile3) {
      const fileName = this.selectedFile3.name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );

      return fileExtension.toLowerCase() === "pdf";
    }

    return false;
  }
  checkFileExtension1(): boolean {
    if (this.selectedFile2) {
      const fileName = this.selectedFile2.name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );
      return fileExtension.toLowerCase() === "pdf";
    }
    return false;
  }
  checkFileExtension2(): boolean {
    if (this.selectedFile) {
      const fileName = this.selectedFile.name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );
      return fileExtension.toLowerCase() === "pdf";
    }
    return false;
  }
  checkFileExtension3(): boolean {
    if (this.selectedFile1) {
      const fileName = this.selectedFile1.name;
      const fileExtension = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );
      return fileExtension.toLowerCase() === "pdf";
    }
    return false;
  }

  onFileSelect3(event) {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.selectedFile3 = event.target.files[0];
      if (this.selectedFile3 && this.selectedFile3.type === "application/pdf") {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile3);
        reader.onload = () => {
          this.challanFile = reader.result;
          console.log("this.challanFile ", this.challanFile);
        };
        console.log("reader 4", reader.result);
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

  validateQbFile1() {
    return typeof this.qbFile === "string" ? true : false;
  }

  /*  validateasFile() {
    return typeof this.asFile === "string" ? true : false;
  } */

  validateform16BFile() {
    return typeof this.form16BFile === "string" ? true : false;
  }

  /*  validatechallanFile() {
    return typeof this.challanFile === "string" ? true : false;
  }
 */
  async submitTDSFile() {
    // console.log('demonjrnuurvubvbufbvubruvubruvburfbvbrfvb')
    this.isLoading = true;
    if (!this.validateQbFile1()) {
      this.preLotteryApplicationService.showErrorToast(
        this.translocoService.translate("error-qbfile-upload")
      );

      return;
    }
    /* if (!this.validateasFile()) {
      this.preLotteryApplicationService.showErrorToast(
        this.translocoService.translate("error-asFile-upload")
      );
      return;
    } */

    if (!this.validateform16BFile()) {
      this.preLotteryApplicationService.showErrorToast(
        this.translocoService.translate("error-form16BFile-upload")
      );
      return;
    }

    /*  if (!this.validatechallanFile()) {
      this.preLotteryApplicationService.showErrorToast(
        this.translocoService.translate("error-challanFile-upload")
      );
      return;
    } */

    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .uploadTDSCertificateFile(
        this.applicationKey,
        this.qbFile,
        this.asFile,
        this.form16BFile,
        this.challanFile
      )
      .subscribe(
        (data: any) => {
          this.progressSpinnerDialog.close();
          if (data.status === "SUCCESS") {
            // this.isLoading = true;
            this.preLotteryApplicationService.successToast(
              "Successfully Saved"
            );
            /* this.hidebutton = true;  */
            // this.isLoading = false;
            this.router.navigate([
              "/app",
              "tds-certificate",
              this.applicationKey,
              "fetch",
            ]);
          } else {
            this.preLotteryApplicationService.showErrorToast(data.errorMessage); // TODO success msg
          }
        },
        (error) => {
          this.progressSpinnerDialog.close();
          this.preLotteryApplicationService.showErrorToast(""); // TODO error msg
        }
      );
  }

  verificationStatus() {
    if (this.fileUploadStatus === "FILE_UPLOAD_PENDING") {
      return "bg-yellow-500";
    } else if (this.fileUploadStatus === "FILE_UPLOADED") {
      return "bg-blue-500";
    } else if (this.fileUploadStatus === "APPROVED") {
      return "bg-green-500";
    } else if (this.fileUploadStatus === "REJECTED") {
      return "bg-pink-500";
    }
    return "";
  }
}

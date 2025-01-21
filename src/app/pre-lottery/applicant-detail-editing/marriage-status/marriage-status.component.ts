import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { PreLotteryApplicationService } from "../../services/pre-lottery-application.service";
import { LoaderComponent } from "src/app/loader/loader.component";
import { MatDialog } from "@angular/material/dialog";
import { ApplicantEditingDetailModel } from "../../models/ApplicantEditingDetailModel";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-marriage-status",
  templateUrl: "./marriage-status.component.html",
  styleUrls: ["./marriage-status.component.scss"],
})
export class MarriageStatusComponent implements OnInit {
  pageMode: string;
  counter: number = 0;
  oldMaritalStatus: string;
  selectedFile: File;
  selectedFile1: File;
  selectedFile2: File;
  selectedFile3: File;
  selectedFile4: File;
  spousePanPdf: string | ArrayBuffer;
  spouseAadharPdf: string | ArrayBuffer;
  spouseMarriageCertificatePdf: string | ArrayBuffer;
  courtOrderPdf: string | ArrayBuffer;
  deathCertificatePdf: string | ArrayBuffer;
  selectedOption: string;
  selectedOptionForMarital: string;
  applicationKey: number;
  fileNamePan: string;
  fileNameAaadhar: string;
  fileNameMarriageCertificate: string;
  fileNameCourtOrder: string;
  fileNameDeathCertificate: string;
  progressSpinnerDialog: any = null;
  @Input() selectedChild: any;
  data: ApplicantEditingDetailModel;
  form: FormGroup = new FormGroup({});
  isSubmitDisabled: boolean = false;

  constructor(
    private router: Router,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // this.onLoad();

    this.route.params.subscribe((params: Params) => {
      // this.displayProgressSpinner();

      this.applicationKey = +params["applicationNo"];
      // console.log("this.applicationNo", this.applicationKey);
      this.loadData(this.applicationKey);
      this.save(this.applicationKey, this.selectedChild);
    });

    this.form = new FormGroup({
      currentMaritalStatus: new FormControl("", Validators.required),
      newMaritalStatus: new FormControl([], Validators.required),
      spouseName: new FormControl(null, Validators.required),
      spousePan: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[ 0-9a-zA-Z]+$/),
        // Validators.minLength(10),
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
      spousePanFile: new FormControl("", Validators.required),
      spouseAadhaar: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        // Validators.minLength(10),
        Validators.maxLength(12),
        Validators.minLength(12),
      ]),
      spouseAadharFile: new FormControl("", Validators.required),
      marriageCertificateFile: new FormControl("", Validators.required),
      courtOrderFile: new FormControl("", Validators.required),
      file: new FormControl(null, Validators.required),
      deathCertificateFile: new FormControl("", Validators.required),
    });
  }

  loadData(applicationKey: number) {
    this.displayProgressSpinner();

    this.preLotteryApplicationService
      .fetchExistingMarriageStatus(applicationKey)
      .subscribe(
        (data) => {
          this.data = data;
          this.oldMaritalStatus = data.marriageStatus;
          this.progressSpinnerDialog.close();
        },
        (error) => {
          this.progressSpinnerDialog.close();

          console.log(error);

          if (this.counter < 1) {
            this.counter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(error, "error-application-list-load")
              .then((num) => {
                this.loadData(applicationKey);
              });
          }
        }
      );
  }

  onSubmit() {
    // console.log("save ="+this.form.value.lotteryKey?.key);

    this.save(this.applicationKey, this.selectedChild);
    // } else {
    // this.isSubmitDisabled = false;
    // }
  }

  save(applicationKey: number, selectedChild: string) {
    this.preLotteryApplicationService
      .saveMarriageStatus({
        applicationNo: this.applicationKey,
        oldMaritalStatus: this.oldMaritalStatus,
        newMaritalStatus: this.form.value.newMaritalStatus.value,
        spouseName: this.form.value.spouseName,
        spousePan: this.form.value.spousePan,
        spousePanFile: this.spousePanPdf,
        spouseAadhaar: this.form.value.spouseAadhaar,
        spouseAadharFile: this.spouseAadharPdf,
        marriageCertificateFile: this.spouseMarriageCertificatePdf,
        courtOrderFile: this.courtOrderPdf,
        deathCertificateFile: this.deathCertificatePdf,
        selectedType: selectedChild,
        fileNamePan: this.fileNamePan,
        fileNameAaadhar: this.fileNameAaadhar,
        fileNameMarriageCertificate: this.fileNameMarriageCertificate,
        fileNameCourtOrder: this.fileNameCourtOrder,
        fileNameDeathCertificate: this.fileNameDeathCertificate,
      })
      .subscribe(
        (data) => {
          if (data.status === "SUCCESS") {
            this.successToast("Marriage Status Saved Successfully");
            this.router.navigate(["/app/application-detail-list"]);
          } else {
            this.isSubmitDisabled = false;
            this.showErrorToast(data.errorMessage);
          }
        },
        (error) => {
          this.isSubmitDisabled = false;
          console.log(error);
          this.showErrorToast("Please Enter Valid Detail");
        }
      );
  }

  get sopConfigFromArray() {
    return this.form.get("sopConfigSubSteps")["controls"];
  }

  onSelectionChange(event) {
    this.selectedOptionForMarital = event;
  }

  // Function to check if the file type is an allowed image format
  isAllowedImageType(fileType: string): boolean {
    return /^image\/(png|jpeg|jpg)$/.test(fileType);
  }

  spousePanSelect(event) {
    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement = document.querySelector(
        "img#preview-selected-image-pan"
      );
      if (imagePreviewElement instanceof HTMLImageElement) {
        imagePreviewElement.src = imageSrc;
        imagePreviewElement.style.display = "block";
      }
    }
    if (event.target.files[0].size < 100 * 1024) {
      this.selectedFile = event.target.files[0];
      if (
        this.selectedFile &&
        this.isAllowedImageType(this.selectedFile.type)
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
          this.spousePanPdf = reader.result;
          const fileNameParts = this.selectedFile.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.fileNamePan = fileNameWithoutExtension;
          // console.log("this.form16BFile ", this.spousePanPdf);
        };
        // console.log("reader", reader.result);
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please select a valid Image file."
        );
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 100 KB."
      );
    }
  }

  spouseAadharSelect(event) {
    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement = document.querySelector(
        "img#preview-selected-image-aadhar"
      );
      if (imagePreviewElement instanceof HTMLImageElement) {
        imagePreviewElement.src = imageSrc;
        imagePreviewElement.style.display = "block";
      }
    }
    if (event.target.files[0].size < 100 * 1024) {
      this.selectedFile1 = event.target.files[0];
      if (
        this.selectedFile1 &&
        this.isAllowedImageType(this.selectedFile1.type)
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile1);
        reader.onload = () => {
          this.spouseAadharPdf = reader.result;
          const fileNameParts = this.selectedFile1.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.fileNameAaadhar = fileNameWithoutExtension;
          // console.log("this.form16BFile ", this.spousePanPdf);
        };
        // console.log("reader", reader.result);
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please select a valid Image file."
        );
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 100 KB."
      );
    }
  }

  spouseMarriageCertificateSelect(event) {
    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement = document.querySelector(
        "img#preview-selected-image-marriageCertificate"
      );
      if (imagePreviewElement instanceof HTMLImageElement) {
        imagePreviewElement.src = imageSrc;
        imagePreviewElement.style.display = "block";
      }
    }
    if (event.target.files[0].size < 100 * 1024) {
      this.selectedFile2 = event.target.files[0];
      if (
        this.selectedFile2 &&
        this.isAllowedImageType(this.selectedFile2.type)
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile2);
        reader.onload = () => {
          this.spouseMarriageCertificatePdf = reader.result;
          const fileNameParts = this.selectedFile2.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.fileNameMarriageCertificate = fileNameWithoutExtension;
          // console.log("this.form16BFile ", this.spousePanPdf);
        };
        // console.log("reader", reader.result);
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please select a valid Image file."
        );
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 100 KB."
      );
    }
  }

  courtOrderSelect(event) {
    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement = document.querySelector(
        "img#preview-selected-image-courtOrder"
      );
      if (imagePreviewElement instanceof HTMLImageElement) {
        imagePreviewElement.src = imageSrc;
        imagePreviewElement.style.display = "block";
      }
    }
    if (event.target.files[0].size < 100 * 1024) {
      this.selectedFile3 = event.target.files[0];
      if (
        this.selectedFile3 &&
        this.isAllowedImageType(this.selectedFile3.type)
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile3);
        reader.onload = () => {
          this.courtOrderPdf = reader.result;
          const fileNameParts = this.selectedFile3.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.fileNameCourtOrder = fileNameWithoutExtension;
          // console.log("this.form16BFile ", this.spousePanPdf);
        };
        // console.log("reader", reader.result);
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please select a valid Image file."
        );
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 100 KB."
      );
    }
  }

  deathCertificateSelect(event) {
    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement = document.querySelector(
        "img#preview-selected-image-deathCertificate"
      );
      if (imagePreviewElement instanceof HTMLImageElement) {
        imagePreviewElement.src = imageSrc;
        imagePreviewElement.style.display = "block";
      }
    }
    if (event.target.files[0].size < 100 * 1024) {
      this.selectedFile4 = event.target.files[0];
      if (
        this.selectedFile4 &&
        this.isAllowedImageType(this.selectedFile4.type)
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile4);
        reader.onload = () => {
          this.deathCertificatePdf = reader.result;
          const fileNameParts = this.selectedFile4.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.fileNameDeathCertificate = fileNameWithoutExtension;
          // console.log("this.form16BFile ", this.spousePanPdf);
        };
        // console.log("reader", reader.result);
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please select a valid Image file."
        );
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 100 KB."
      );
    }
  }

  onCheckboxChange(e: any) {
    if (e.target) {
      console.log("check box ticked");
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

  async warningToast() {
    await this._snackBar.open("", "Close", {
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: "warning-toast",
      duration: 3 * 1000,
    });
  }

  async errorToast(errorMessage: string, dur?: number) {
    await this._snackBar.open(errorMessage, "Close", {
      horizontalPosition: "right",
      verticalPosition: "top",
      panelClass: "error-toast",
      duration: dur ? dur : 3 * 1000,
    });
  }

  downloadFile(base64: string | ArrayBuffer, fileName: string) {
    const src = `${base64}`;
    const link = document.createElement("a");
    link.href = src;
    link.download = fileName;
    link.click();

    link.remove();
  }
}

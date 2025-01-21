import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ActionSheetController, ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { DocumentScanner, ResponseType } from "capacitor-document-scanner";
import { AuthenticationService } from "src/app/authentication/authentication.service";
import { LoaderComponent } from "src/app/loader/loader.component";
import { CropImageComponent } from "src/app/question-answer/crop-image/crop-image.component";
import { SharedService } from "src/app/toolbar/shared.service";
import { DigiMultipleNameCheckService } from "./digi-multiple-name-check.service";

@Component({
  selector: "app-digi-multiple-name-check",
  templateUrl: "./digi-multiple-name-check.component.html",
  styleUrls: ["./digi-multiple-name-check.component.scss"],
})
export class DigiMultipleNameCheckComponent implements OnInit {
  platform = localStorage.getItem("platform");
  progressSpinnerDialog: any = null;
  multipleNamesExist: boolean = false;
  siteKey: string = "6LeWlokqAAAAAACB5JwblsHJMN57Xd_G7-dSEFRQ";
  aadharName: string = "";
  panName: string = "";
  consentAccepted: boolean = false;
  activeLang: string = "";
  multipleNames: any = null;
  rgName1: string = "";
  rgName2: string = "";
  rgName3: string = "";
  @ViewChild("target") MyProp: ElementRef;
  addNewRecordBtnVisible: boolean = true;
  constructor(
    private dialog: MatDialog,
    public toastController: ToastController,
    private translocoService: TranslocoService,
    private digiMultipleNameCheckService: DigiMultipleNameCheckService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private sharedService: SharedService,
    public actionSheetController: ActionSheetController,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (
      (localStorage.getItem("digiAadharName") == undefined && localStorage.getItem("digiPanName") == undefined) ||
      (localStorage.getItem("digiAadharName") == "" && localStorage.getItem("digiPanName") == "")
    ) {
      this.router.navigate(["/question-answer"], { replaceUrl: true });
    } else {
      this.names = [
        {
          id: this.names.length + 1,
          name: "",
          selectedDocToUpload: "",
          selectedImage: "",
          selectedReason: "",
        },
      ];
      this.getReasons();
      localStorage.setItem("lastRoute", this.router.url);
      this.aadharName = localStorage.getItem("digiAadharName");
      this.panName = localStorage.getItem("digiPanName");
      if (
        localStorage.getItem("rgName1") != undefined &&
        localStorage.getItem("rgName1") != "" &&
        localStorage.getItem("rgName1") != null &&
        localStorage.getItem("rgName1") != "null"
      ) {
        this.rgName1 = localStorage.getItem("rgName1");
        this.addNewRecordBtnVisible = true;
      }
      if (
        localStorage.getItem("rgName2") != undefined &&
        localStorage.getItem("rgName2") != "" &&
        localStorage.getItem("rgName2") != null &&
        localStorage.getItem("rgName2") != "null"
      ) {
        this.rgName2 = localStorage.getItem("rgName2");
        this.addNewRecordBtnVisible = true;
      }
      if (
        localStorage.getItem("rgName3") != undefined &&
        localStorage.getItem("rgName3") != "" &&
        localStorage.getItem("rgName3") != null &&
        localStorage.getItem("rgName3") != "null"
      ) {
        this.rgName3 = localStorage.getItem("rgName3");
        this.addNewRecordBtnVisible = false;
      }
      this.sharedService.name.subscribe((data) => {
        this.activeLang = data;
      });
    }
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  // TOAST MESSAGES
  async successToast(message: string) {
    this.progressSpinnerDialog.close();
    const toast = await this.toastController.create({
      message: message,
      icon: "checkmark-circle-outline",
      position: "top",
      cssClass: "toast success-toast",
      duration: 5000,
    });
    toast.present();
  }

  async frontendWarningToast(message: string) {
    this.progressSpinnerDialog.close();
    this._snackBar.open(message, "", {
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: "warning-toast1",
      duration: 5000,
    });
  }

  async backendWarningToast(message: any) {
    this.progressSpinnerDialog.close();
    const toast = await this.toastController.create({
      message: message.error,
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 5000,
    });
    toast.present();
  }
  async backendWarningToastNew(message: any) {
    this.progressSpinnerDialog.close();
    const toast = await this.toastController.create({
      message: message,
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 5000,
    });
    toast.present();
  }

  async errorToast(error: any) {
    this.progressSpinnerDialog.close();
    const toast = await this.toastController.create({
      message: this.translocoService.translate("error-network-related"),
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 5000,
    });
    toast.present();
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  names: any[] = [];
  isUploadImageVisible: any = false;
  selectedImage: any = "";
  errorMessageVisible: any = false;
  fileUploadVisible = false;
  uploadFromEnMr: string = "Upload from";
  galleryEnMr: string = "Gallery";
  cameraEnMr: string = "Camera";
  frontImageBlob: any = null;
  selectedRecord: any = null;
  submitDisabled: boolean = true;
  addNewRecordDisabled: boolean = true;
  addNewDisabled: boolean = true;
  uploadedFilename: string = "";
  nameChangeList: any[] = [];
  isCardVisible: boolean = true;
  namePattern: string = "^[A-Za-z ]+$";
  reasons: any[] = [
    { id: 1, name: "Marriage" },
    { id: 2, name: "Divorce" },
    { id: 3, name: "Death" },
    { id: 4, name: "Other" },
  ];
  // @Output() multipleNames = new EventEmitter<any>();

  async getReasons() {
    // this.displayProgressSpinner();
    this.reasons = [];
    const response: any = await this.authenticationService.getReasons();
    if (response.length > 0) {
      this.reasons = response;
    } else {
      // this.frontendWarningToast(response);
    }
  }

  async presentActionSheet(record: any) {
    this.selectedRecord = record;
    this.fileUploadVisible = true;
    if (
      !window.location.href.toString().startsWith("https://cidcohousing.probitysoftware.in/") &&
      !window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/") &&
      !window.location.href.toString().startsWith("http://localhost:8100/") &&
      !window.location.href.toString().startsWith("https://housing.pmrda.gov.in/") &&
      !window.location.href.toString().startsWith("https://sqtchousing.mhada.gov.in/")
    ) {
      this.fileUploadVisible = true;
      const actionSheet = await this.actionSheetController.create({
        header: this.uploadFromEnMr,
        cssClass: "my-custom-class",
        buttons: [
          {
            text: this.galleryEnMr,
            icon: "images",
            data: "Data value",
            handler: () => {
              this.fileUpload();
            },
          },
          {
            text: this.cameraEnMr,
            icon: "camera",
            id: "delete-button",
            handler: () => {
              this.captureDocImage();
            },
          },
        ],
      });
      await actionSheet.present();
      const { role, data } = await actionSheet.onDidDismiss();
    } else {
      setTimeout(() => {
        this.fileUploadVisible = true;
        this.fileUpload();
      }, 200);
    }
  }

  // for opening input type file container
  fileUpload() {
    document.getElementById("fileupload").click();
  }

  // Capture Document Image from Camera
  async captureDocImage() {
    // start the document scanner
    const { scannedImages, status } = await DocumentScanner.scanDocument({
      maxNumDocuments: 1,
      responseType: ResponseType.Base64,
    });
    if (status == "success") {
      const base64 = scannedImages[0];
      const imageName = "name.png";
      this.uploadedFilename = "ILMS_" + new Date().getTime() + ".jpg";

      const imageBlob: any = this.dataURItoBlob(base64);
      const imageFile = new File([imageBlob], imageName, { type: "image/png" });
    }
  }

  // Converting base64 to Blob
  async dataURItoBlob(base64Image: any) {
    const byteString = window.atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpg" });
    const imageFile = new File([blob], "", { type: "image/jpg" });
    this.frontImageBlob = imageFile;

    for (let i = 0; i < this.names.length; i++) {
      if (this.names[i].id == this.selectedRecord.id) {
        this.names[i].selectedDocToUpload = imageFile;
        this.names[i].selectedImage = "data:image/jpg;base64," + base64Image;
        this.names[i].uploadedFilename = this.uploadedFilename;
        if (this.names[i].selectedReason == "" || this.names[i].name == "" || this.names[i].selectedImage == "") {
          this.submitDisabled = true;
          this.addNewRecordDisabled = true;
        } else {
          this.submitDisabled = false;
          this.addNewRecordDisabled = false;
        }
      }
    }

    this.selectedImage = "data:image/jpeg;base64," + base64Image;
  }

  // function to get image from device (gallery, downloads, etc.)
  async handleFileInput(event: any) {
    // this.selectedImage = '';
    this.uploadedFilename = "";
    this.fileUploadVisible = false;
    const files = event.target.files;
    if (files[0].type.split("/")[0] != "image") {
      this.errorMessageVisible = true;
    } else {
      this.uploadedFilename = files[0].name;
      const cropperDialog = this.dialog.open(CropImageComponent, {
        disableClose: true,
        width: "600px",
        // height: "100%",
        data: event,
      });
      cropperDialog.afterClosed().subscribe((result) => {
        if (result != "") {
          let data = result.split("data:image/png;base64,");
          this.base64ToBlob(data[1]);
        } else {
          this.reUploadImage(this.selectedRecord);
        }
      });
    }
  }

  // converting base64 to blob when user selects image from gallery or device
  async base64ToBlob(base64Image: any) {
    this.errorMessageVisible = false;
    const byteString = window.atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpg" });
    let fileName = "ILMS_" + new Date().getTime() + ".jpg";
    const imageFile = new File([blob], fileName, { type: "image/jpg" });
    this.fileUploadVisible = false;
    this.frontImageBlob = imageFile;

    for (let i = 0; i < this.names.length; i++) {
      if (this.names[i].id == this.selectedRecord.id) {
        this.names[i].selectedDocToUpload = imageFile;
        this.names[i].selectedImage = "data:image/jpg;base64," + base64Image;
        this.names[i].uploadedFilename = this.uploadedFilename;
        if (this.names[i].selectedReason == "" || this.names[i].name == "" || this.names[i].selectedImage == "") {
          this.submitDisabled = true;
          this.addNewRecordDisabled = true;
        } else {
          this.submitDisabled = false;
          this.addNewRecordDisabled = false;
        }
      }
    }
    this.selectedImage = "data:image/jpg;base64," + base64Image;
  }

  reUploadImage(record: any) {
    this.selectedRecord = record;
    for (let i = 0; i < this.names.length; i++) {
      if (this.names[i].id == record.id) {
        this.names[i].selectedDocToUpload = "";
        this.names[i].selectedImage = "";
        if (this.names[i].selectedReason == "" || this.names[i].name == "" || this.names[i].selectedImage == "") {
          this.submitDisabled = true;
          this.addNewRecordDisabled = true;
        } else {
          this.submitDisabled = false;
          this.addNewRecordDisabled = false;
        }
      }
    }
    // this.isUploadImageVisible = true;
    setTimeout(() => {
      this.isUploadImageVisible = false;
    }, 10);
    this.selectedImage = "";
    this.frontImageBlob = null;
    this.fileUploadVisible = true;
  }

  reasonChanged(name: any) {}

  addNewRecord() {
    this.isCardVisible = true;
    this.submitDisabled = true;
    this.addNewRecordDisabled = true;
    this.names.push({
      id: this.names.length + 1,
      name: "",
      selectedDocToUpload: "",
      selectedImage: "",
      selectedReason: "",
    });
  }

  removeLastRecord() {
    this.names.pop();
    this.nameChangeList = [...this.names];
  }

  multipleNamesList: any[] = [];
  async submit() {
    this.multipleNamesList = [];
    this.isCardVisible = false;
    let counter = 0;
    this.submitDisabled = true;
    this.addNewRecordDisabled = false;
    if (
      this.rgName1 != undefined &&
      this.rgName1 != "" &&
      this.rgName1 != null &&
      this.rgName1 != "null" &&
      this.names.length == 2
    ) {
      this.addNewRecordBtnVisible = false;
    } else if (
      this.rgName2 != undefined &&
      this.rgName2 != "" &&
      this.rgName2 != null &&
      this.rgName2 != "null" &&
      this.names.length == 1
    ) {
      this.addNewRecordBtnVisible = false;
    } else if (
      this.rgName3 != undefined &&
      this.rgName3 != "" &&
      this.rgName3 != null &&
      this.rgName3 != "null" &&
      this.names.length == 0
    ) {
      this.addNewRecordBtnVisible = false;
    }
    for (let i = 0; i < this.names.length; i++) {
      if (this.names[i].selectedReason == "" || this.names[i].name == "" || this.names[i].selectedImage == "") {
        // this.submitDisabled = true;
        counter++;
        alert("Please fill all the fields");
        return;
      }
    }

    if (counter == 0) {
      // this.submitDisabled = false;
      let image1 = null;
      let image2 = null;
      let image3 = null;
      if (this.names.length == 3) {
        image1 = this.names[0].selectedDocToUpload;
        image2 = this.names[1].selectedDocToUpload;
        image3 = this.names[2].selectedDocToUpload;
      } else if (this.names.length == 2) {
        image1 = this.names[0].selectedDocToUpload;
        image2 = this.names[1].selectedDocToUpload;
      } else if (this.names.length == 1) {
        image1 = this.names[0].selectedDocToUpload;
      } else {
        image1 = "null";
        image2 = "null";
        image3 = "null";
      }
      let finalDetails: any[] = [];
      for (let i = 0; i < this.names.length; i++) {
        let obj = {
          name: this.names[i].name,
          reason: this.names[i].selectedReason,
        };
        finalDetails.push(obj);
      }

      let data = [{ image1: image1, image2: image2, image3: image3, data: finalDetails }];
      const toast = await this.toastController.create({
        message: "Details added successfully.",
        icon: "checkmark-circle-outline",
        position: "top",
        cssClass: "toast success-toast",
        duration: 5000,
      });
      toast.present();
      this.nameChangeList = [...this.names];
      this.multipleNamesList = data[0]["data"];
      this.multipleNames = data;
    }
  }

  async proceed() {
    this.displayProgressSpinner();
    if (this.multipleNamesExist) {
      if (this.names.length > this.multipleNamesList.length) {
        for (let i = 0; i < this.names.length; i++) {
          if (this.names[i].name == "") {
            this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
            this.frontendWarningToast(this.translocoService.translate("signup-multiple-name-enter-name-warning"));
            return;
          } else if (this.names[i].selectedReason == "") {
            this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
            this.frontendWarningToast(this.translocoService.translate("signup-multiple-name-select-reason-warning"));
            return;
          }
          if (this.names[i].selectedImage == "") {
            this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
            this.frontendWarningToast(this.translocoService.translate("signup-multiple-name-select-document-warning"));
            return;
          }
        }
        this.MyProp.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });
        this.frontendWarningToast(this.translocoService.translate("signup-multiple-name-submit-warning"));
        return;
      } else {
        for (let i = 0; i < this.names.length; i++) {
          if (this.names[i].name == "" || this.names[i].selectedReason == "" || this.names[i].selectedImage == "") {
            this.frontendWarningToast(this.translocoService.translate("error-required-fields"));
            return;
          }
        }
      }
    }
    let file1 = "null";
    let file2 = "null";
    let file3 = "null";
    let data = "";
    if (this.multipleNamesExist) {
      file1 = this.multipleNames[0]["image1"];
      file2 = this.multipleNames[0]["image2"];
      file3 = this.multipleNames[0]["image3"];
      data = this.multipleNames[0]["data"];
    } else {
      file1 = "null";
      file2 = "null";
      file3 = "null";
      data = "";
    }

    const otherNames = {
      hasMultipleNamesYn: this.multipleNamesExist ? "Y" : "N",
      data: data,
    };
    const response: any = await this.digiMultipleNameCheckService.setMultipleCheckConsent(
      JSON.stringify(otherNames),
      file1,
      file2,
      file3,
      localStorage.getItem("digiResponse")
    );

    console.log(response);

    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        localStorage.setItem("userExists", "true");
        this.successToast(this.translocoService.translate("detail-saved-success"));
        this.router.navigate(["/question-answer"], { replaceUrl: true });
        localStorage.setItem("lastRoute", "/question-answer");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        this.backendWarningToastNew(response?.status);
        // this.backendWarningToastNew("Oops, something went wrong, please try after sometime.");
      }
    } else {
      localStorage.removeItem("otpVerificationPending");
      this.errorToast(response);
    }
  }
}

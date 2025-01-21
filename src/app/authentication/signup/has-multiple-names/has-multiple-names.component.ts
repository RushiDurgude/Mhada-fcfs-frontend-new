import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActionSheetController, ToastController } from "@ionic/angular";
import { DocumentScanner, ResponseType } from "capacitor-document-scanner";
import { CropImageComponent } from "src/app/question-answer/crop-image/crop-image.component";
import { AuthenticationService } from "../../authentication.service";

@Component({
  selector: "app-has-multiple-names",
  templateUrl: "./has-multiple-names.component.html",
  styleUrls: ["./has-multiple-names.component.scss"],
})
export class HasMultipleNamesComponent implements OnInit {
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
  reasons: any[] = [
    { id: 1, name: "Marriage" },
    { id: 2, name: "Divorce" },
    { id: 3, name: "Death" },
    { id: 4, name: "Other" },
  ];
  @Output() multipleNames = new EventEmitter<any>();

  constructor(
    public actionSheetController: ActionSheetController,
    private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    public toastController: ToastController
  ) {}

  ngOnInit() {
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
  }

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

  async submit() {
    this.isCardVisible = false;
    let counter = 0;
    this.submitDisabled = true;
    this.addNewRecordDisabled = false;
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
      this.multipleNames.emit(data);
    }
  }
}

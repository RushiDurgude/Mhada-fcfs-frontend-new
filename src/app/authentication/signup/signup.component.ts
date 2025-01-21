import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { ActionSheetController, ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { DocumentScanner, ResponseType } from "capacitor-document-scanner";
import { RecaptchaComponent } from "ng-recaptcha";
import { LoaderComponent } from "src/app/loader/loader.component";
import { CropImageComponent } from "src/app/question-answer/crop-image/crop-image.component";
import { SharedService } from "src/app/toolbar/shared.service";
import { AuthenticationService } from "../authentication.service";
import { PreLotteryApplicationService } from "src/app/pre-lottery/services/pre-lottery-application.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  platform = localStorage.getItem("platform");

  signUpPanNo: string = "";
  signUpName: string = "";
  signUpMobileNo: string = "";
  signUpEmailId: string = "";
  signUpPassword: string = "";
  signupConfirmPassword: string = "";
  emailPattern: any = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$";
  passwordPattern: any = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";
  panPattern: string = "^[A-Z]{5}[0-9]{4}[A-Z]$";
  mobilePattern: any = "^[0-9]{10}$";
  signUpPanVerified: boolean = true;
  contentVisible: boolean = false;
  emailOtp: string = "";
  mobileOtp: string = "";
  userName: string = "";
  signupPassword: string = "";

  panVerificationResponse: any = "";

  progressSpinnerDialog: any = null;

  timerOn = true;
  resendOtpIn: any = null;
  isResendOtpButtonVisible: boolean = false;
  isOtpVerificationVisible: any = false;
  isEmailVisible: any = false;
  resendOtp: string = "N";
  multipleNamesExist: boolean = false;
  siteKey: string = "6LeWlokqAAAAAACB5JwblsHJMN57Xd_G7-dSEFRQ";
  @ViewChild("target") MyProp: ElementRef;
  constructor(
    private dialog: MatDialog,
    public toastController: ToastController,
    private translocoService: TranslocoService,
    private authenticationService: AuthenticationService,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private router: Router,
    private sharedService: SharedService,
    public actionSheetController: ActionSheetController,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.generateCaptcha();
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
    if (localStorage.getItem("otpVerificationPending") == "true") {
      // this.successToast(this.translocoService.translate("success-otp-sent"));
      this.resendOtpTimer(120);
      this.signUpPanVerified = false;
      this.isOtpVerificationVisible = true;
      
      if (localStorage.getItem("loginPan") != null) {
        this.signUpPanNo = localStorage.getItem("loginPan");
        this.resendOtpFn();
      }
    } else if (localStorage.getItem("loginPan") != null) {
      this.signUpPanNo = localStorage.getItem("loginPan");
    }
    localStorage.setItem("lastRoute", this.router.url);
  }

  async verifyPanOld() {    
    this.displayProgressSpinner();
    if (this.isCaptchaClicked) {
      let date = new Date().getDate();
      let password = "8S$@1t7R6D3M#9Wq";
      let hours = new Date().getHours();
      let string = this.signUpPanNo.toUpperCase() + "|" + password;
      const utf8 = new TextEncoder().encode(string);
      const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((bytes) => bytes.toString(16).padStart(2, "0")).join("");
      const response: any = await this.authenticationService.verifyRegistrationPan(
        this.signUpPanNo.toUpperCase(),
        // hashHex,
        this.captcha
      );
      // const response: any = await this.authenticationService.verifyRegistrationPan(
      //   this.signUpPanNo.toUpperCase(),
      //   hashHex
      // );
      
      if (response != null && !response.error) {
        if (response.status == "SUCCESS") {
          localStorage.setItem("loginPan", this.signUpPanNo);
          this.isCaptchaVisible = false;
          this.userName = response.firstName + " " + response.middlename + " " + response.lastName;
          this.panVerificationResponse = response;
          this.contentVisible = true;
          this.successToast(this.translocoService.translate("pan-card-success"));
        } else if (response.status.toLowerCase() == "already exists") {
          this.isCaptchaVisible = false;
          localStorage.setItem("loginPan", this.signUpPanNo);
          this.frontendWarningToast(this.translocoService.translate("pan-already-registered"));
          this.router.navigate(["/signIn"], { replaceUrl: true });
        } else if (response.status.toLowerCase() == "pan-api-fail") {
          this.isCaptchaVisible = false;
          setTimeout(() => {
            this.isCaptchaVisible = true;
          }, 100);
          this.progressSpinnerDialog.close();
          alert(this.translocoService.translate("pan-api-fail"));
        } else if (response.status.toLowerCase() == "internal-error") {
          this.isCaptchaVisible = false;
          setTimeout(() => {
            this.isCaptchaVisible = true;
          }, 100);
          // when sha mismatch
          this.progressSpinnerDialog.close();
          alert(this.translocoService.translate("pan-api-fail"));
        } else if (response.status == "Invalid-Captcha") {
          this.isCaptchaVisible = false;
          setTimeout(() => {
            this.isCaptchaVisible = true;
          }, 100);
          this.progressSpinnerDialog.close();
          alert(response.status);
        } else {
          this.isCaptchaVisible = false;
          setTimeout(() => {
            this.isCaptchaVisible = true;
          }, 100);
          this.contentVisible = false;
          this.frontendWarningToast(this.translocoService.translate("error-invalid-pan"));
        }
      } else {
        this.isCaptchaVisible = false;
        setTimeout(() => {
          this.isCaptchaVisible = true;
        }, 100);
        this.contentVisible = false;
        this.errorToast(response);
      }
    } else {
      this.frontendWarningToast("Invalid-Captcha");
      return;
    }
  }

  // sending OTP to entered mobile number and email id
  async sendOtpOld() {
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
    let str = this.signUpPassword;
    let hash: any = "";
    for (var i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i).toString(16);
    }
    this.emailOtp = "";
    this.mobileOtp = "";
    this.displayProgressSpinner();

    let file1 = "null";
    let file2 = "null";
    let file3 = "null";
    let data = "null";
    if (this.multipleNamesExist) {
      file1 = this.multipleNames[0]["image1"];
      file2 = this.multipleNames[0]["image2"];
      file3 = this.multipleNames[0]["image3"];
      data = this.multipleNames[0]["data"];
    } else {
      file1 = "null";
      file2 = "null";
      file3 = "null";
      data = "null";
    }

    const TabRegDto = {
      panNo: this.signUpPanNo.toUpperCase(),
      password: hash,
      email: this.signUpEmailId,
      emailOtp: "",
      reOtpValidity: "",
      mobileNo: this.signUpMobileNo,
      mobileOtp: "",
      status: "",
      panVerificationReponseString: this.panVerificationResponse,
    };
    const otherNames = {
      hasMultipleNamesYn: this.multipleNamesExist ? "Y" : "N",
      data: data,
    };
    const response: any = await this.authenticationService.signup(
      JSON.stringify(TabRegDto),
      JSON.stringify(otherNames),
      file1,
      file2,
      file3
    );
    if (response != null && !response.error) {
      if (response.status.toLowerCase() == "success") {
        this.resendOtpTimer(120);
        this.isOtpVerificationVisible = true;
        this.signUpPanVerified = false;
        this.contentVisible = false;
        localStorage.setItem("otpVerificationPending", "true");
        this.successToast(this.translocoService.translate("success-otp-sent"));
      } else if (response.status.toLowerCase() == "exists") {
        this.frontendWarningToast("This PAN is already registered with MHADA, kindly login.");
      } else if (response.status.toLowerCase() == "failure") {
        localStorage.removeItem("otpVerificationPending");
        this.frontendWarningToast(response.message);
      } else {
        this.backendWarningToast("Unable to send OTP.");
      }
    } else {
      localStorage.removeItem("otpVerificationPending");
      this.errorToast(response);
    }
  }

  // RESEND OTP TIMER
  resendOtpTimer(remaining: any) {
    var m: any = Math.floor(remaining / 60);
    var s: any = remaining % 60;

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    this.resendOtpIn = m + ":" + s;
    localStorage.setItem("otpResendTimeLeft", this.resendOtpIn);
    remaining -= 1;

    if (remaining >= 0 && this.timerOn) {
      setTimeout(() => {
        this.resendOtpTimer(remaining);
      }, 1000);
      return;
    }

    if (!this.timerOn) {
      // Do validate stuff here
      return;
    } else {
      // Do timeout stuff here
      // alert('Timeout for otp');
      this.isResendOtpButtonVisible = true;
    }
  }

  // verifying entered OTP
  

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

  async errorToast(error: any) {
    this.progressSpinnerDialog.close();
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
  
  async errorMessageToast(error: any) {
    this.progressSpinnerDialog.close();
    const toast = await this.toastController.create({
      message: error,
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 5000,
    });
    toast.present();
  }

  onResendOtpClick() {
    this.resendOtp = "Y";
    this.isResendOtpButtonVisible = false;
    this.resendOtpFn();
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  multipleNames: any = null;
  multipleNamesFromChild(event: any) {
    this.multipleNames = event;
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

  async verifyOtpOld() {
    this.displayProgressSpinner();

    if (localStorage.getItem("otpVerificationPending") == "true") {
      const TabRegDto = {
        panNo: this.signUpPanNo.toUpperCase(),
        password: this.signUpPassword,
        email: this.signUpEmailId,
        emailOtp: this.emailOtp,
        reOtpValidity: "",
        mobileNo: this.signUpMobileNo,
        mobileOtp: this.mobileOtp,
        status: "",
        panVerificationReponseString: null,
      };
      const response: any = await this.authenticationService.verifyEmailDetails(JSON.stringify(TabRegDto));
      if (response.status.toLowerCase() == "success") {
        localStorage.setItem("token", response.message);
        localStorage.removeItem("otpVerificationPending");
        localStorage.setItem("panNo", this.signUpPanNo);
        this.successToast("OTP verified.");
        localStorage.setItem("session-started", "true");
        localStorage.setItem("regId", "0");
        this.sharedService.setAuthentication(true);
        this.router.navigate(["/registration-step"]);
      } else {
        this.isOtpVerificationVisible = true;
        this.isEmailVisible = false;
        this.frontendWarningToast(response.message);
      }
    } else {
      const TabRegDto = {
        panNo: this.signUpPanNo.toUpperCase(),
        password: this.signUpPassword,
        email: this.signUpEmailId,
        emailOtp: this.emailOtp,
        reOtpValidity: "",
        mobileNo: this.signUpMobileNo,
        mobileOtp: this.mobileOtp,
        status: "",
        panVerificationReponseString: this.panVerificationResponse,
      };
      const response: any = await this.authenticationService.verifyOtp(JSON.stringify(TabRegDto));
      if (response.status.toLowerCase() == "success") {
        localStorage.setItem("token", response.message);
        localStorage.setItem("panNo", this.signUpPanNo);
        this.successToast("OTP verified.");
        localStorage.setItem("session-started", "true");
        localStorage.setItem("regId", "0");
        this.sharedService.setAuthentication(true);
        this.router.navigate(["/question-answer"]);
      } else {
        this.isOtpVerificationVisible = true;
        this.isEmailVisible = false;
        this.frontendWarningToast(response.message);
      }
    }
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
          file : this.names[i].selectedImage,
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
      // this.multipleNames.emit(data);
      this.multipleNamesList = data[0]["data"];
      this.multipleNames = data;
    }
  }

  captchaKey: number;
  captchaImg: string;
  captchaText: string ="";

  isCaptchaClicked: boolean = false;
  captcha: string = "";
  isCaptchaVisible: boolean = true;
  @ViewChild("captchaElem") captchaElem: RecaptchaComponent;
  resolved(captchaResponse: string) {
    if (captchaResponse !== null) {
      this.captcha = captchaResponse;
      this.isCaptchaClicked = true;
      // `${captchaResponse.substring(0, 7)}...${captchaResponse.substring(captchaResponse.length - 7)}`;
    } else {
      this.isCaptchaVisible = false;
      this.isCaptchaClicked = false;
      this.captcha = "";
      setTimeout(() => {
        this.isCaptchaVisible = true;
      }, 100);
    }
  }


  // NEW CODE

  async closeProgressSpinner() {
    this.progressSpinnerDialog.close;
  }

  verifyPan() {
    this.displayProgressSpinner();
    if (this.isCaptchaClicked) {

      this.authenticationService.verifyRegistrationPan(this.signUpPanNo.toUpperCase(), this.captcha)
        .subscribe(data => {
          this.closeProgressSpinner();

          if (data.status === 'SUCCESS') {

            if (data.registrationStatus === 'NEW_REGISTRATION') {
              localStorage.setItem("loginPan", this.signUpPanNo);
              this.isCaptchaVisible = false;
              this.userName = data.panName;
              this.contentVisible = true;
              this.successToast(this.translocoService.translate("pan-card-success"));
            } else if (data.registrationStatus === 'ALREADY_EXISTS') {
              this.isCaptchaVisible = false;
              localStorage.setItem("loginPan", this.signUpPanNo);
              this.frontendWarningToast(this.translocoService.translate("pan-already-registered"));
              this.router.navigate(["/signIn"], { replaceUrl: true });
            }

          } else {
            this.isCaptchaVisible = false;
            setTimeout(() => {
              this.isCaptchaVisible = true;
            }, 100);
            this.contentVisible = false;
            this.errorMessageToast(data.errorMessage); // TODO
          }

        }, async error => {
          this.isCaptchaVisible = false;
            setTimeout(() => {
              this.isCaptchaVisible = true;
            }, 100);
          this.closeProgressSpinner();
          this.errorMessageToast("Load error for verify pan."); // TODO
        });

    } else {
      this.frontendWarningToast("Invalid-Captcha");
      return;
    }
  }

  verifyPanNew() {
    console.log("verifyPan Data-Pan",this.signUpPanNo.toUpperCase());
    console.log("verifyPan Data-capcha old",this.captcha);
    console.log("verifyPan Data-captchaText",this.captchaText);
    console.log("verifyPan Data-this.captchaKey",this.captchaKey);

    this.displayProgressSpinner();
    if (this.isCaptchaClicked) {

      this.authenticationService.verifyRegistrationPanNew(this.signUpPanNo.toUpperCase(), this.captchaText,this.captchaKey)
        .subscribe(data => {
          this.closeProgressSpinner();

          if (data.status === 'SUCCESS') {

            if (data.registrationStatus === 'NEW_REGISTRATION') {
              localStorage.setItem("loginPan", this.signUpPanNo);
              this.isCaptchaVisible = false;
              this.userName = data.panName;
              this.contentVisible = true;
              this.successToast(this.translocoService.translate("pan-card-success"));
            } else if (data.registrationStatus === 'ALREADY_EXISTS') {
              this.isCaptchaVisible = false;
              localStorage.setItem("loginPan", this.signUpPanNo);
              this.frontendWarningToast(this.translocoService.translate("pan-already-registered"));
              this.router.navigate(["/signIn"], { replaceUrl: true });
            }

          } else {
            this.isCaptchaVisible = false;
            setTimeout(() => {
              this.isCaptchaVisible = true;
            }, 100);
            this.contentVisible = false;
            this.errorMessageToast(data.errorMessage); // TODO
          }

        }, async error => {
          this.isCaptchaVisible = false;
            setTimeout(() => {
              this.isCaptchaVisible = true;
            }, 100);
          this.closeProgressSpinner();
          this.errorMessageToast("Load error for verify pan."); // TODO
        });

    } else {
      this.frontendWarningToast("Invalid-Captcha");
      return;
    }
  }

  async sendOtp() {
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

    let str = this.signUpPassword;
    let hash: any = "";
    for (var i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i).toString(16);
    }
    this.displayProgressSpinner();

    let data = null;

    if (this.multipleNamesExist) {
      data = this.multipleNames[0]["data"];
    }

    const otherNames = {
      hasMultipleNamesYn: this.multipleNamesExist ? "Y" : "N",
      data: data,
    };

    this.authenticationService
      .signUpNew(this.signUpPanNo.toUpperCase(), hash, this.signUpEmailId, this.signUpMobileNo, otherNames)
      .subscribe(data => {
        this.closeProgressSpinner();
        if (data.status == 'SUCCESS') {
          this.resendOtpTimer(120);
          this.isOtpVerificationVisible = true;
          this.signUpPanVerified = false;
          this.contentVisible = false;
          localStorage.setItem("otpVerificationPending", "true");
          this.successToast(this.translocoService.translate("success-otp-sent"));
        } else {
          this.contentVisible = false;
          this.errorMessageToast(data.errorMessage);
          localStorage.removeItem("otpVerificationPending");
        }
        
      }, async error => {
        this.contentVisible = false;
        localStorage.removeItem("otpVerificationPending");
        this.closeProgressSpinner();
        this.errorMessageToast("Load error for registration."); // TODO
      });
  }

  async verifyOtp() {
    this.displayProgressSpinner();

    this.authenticationService
      .verifyOtpNew(this.signUpPanNo.toUpperCase(), this.mobileOtp, this.emailOtp)
      .subscribe(data => {
        this.closeProgressSpinner();
        if (data.status == 'SUCCESS') {
          localStorage.setItem("token", data.token);
          localStorage.setItem("session-started", "true");
          localStorage.setItem("expiresIn", data.expiresIn);
          localStorage.setItem("panNo", this.signUpPanNo);
          localStorage.removeItem("otpVerificationPending");
          this.sharedService.setAuthentication(true);
          this.successToast("OTP verified.");
          this.router.navigate(["/registration-step"]);
        } else {
          this.isOtpVerificationVisible = true;
          this.isEmailVisible = false;
          this.errorMessageToast(data.errorMessage);
        }
      }, async error => {
        this.closeProgressSpinner();
        this.isOtpVerificationVisible = true;
        this.isEmailVisible = false;
        this.frontendWarningToast(error?.error?.errorMessage);
      });
  }

  async resendOtpFn() {
    this.displayProgressSpinner();

    this.authenticationService
      .resendOtpNew(this.signUpPanNo.toUpperCase())
      .subscribe(data => {
        this.closeProgressSpinner();
        if (data.status == 'SUCCESS') {
          this.resendOtpTimer(120);
          this.isOtpVerificationVisible = true;
          this.signUpPanVerified = false;
          this.contentVisible = false;
          localStorage.setItem("otpVerificationPending", "true");
          this.successToast(this.translocoService.translate("success-otp-sent"));
        } else {
          this.errorMessageToast(data.errorMessage);
        }
      }, async error => {
        this.closeProgressSpinner();
        this.frontendWarningToast(error?.error?.errorMessage);
      });
  }

  generateCaptcha() {
    this.preLotteryApplicationService.generateCaptcha()
    .subscribe(data => {
      if(data.status === 'SUCCESS') {
        this.captchaKey = data.captchaKey;
        // this.captchaImg = data.captchaImg; 
        this.isCaptchaClicked =true;
        this.captchaImg = `data:image/png;base64,${data.captchaImg}`;
        console.log("captchaImg",this.captchaImg);
        
      }
      else {
        setTimeout(() => {
          this.generateCaptcha();
        }, 150000);
      }
    }, error => {
      
    });
  }

  playAudioCaptcha() {
    if(this.captchaKey) {
      const audioElement = document.getElementById('audioCaptcha') as HTMLAudioElement;
      this.preLotteryApplicationService.playAudioCaptcha(this.captchaKey)
      .subscribe((audioBlob: Blob) => {
        console.log(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        audioElement.src = audioUrl;
        audioElement.play();
      }, error => {
        console.log(error);
      });
    }
  }
}

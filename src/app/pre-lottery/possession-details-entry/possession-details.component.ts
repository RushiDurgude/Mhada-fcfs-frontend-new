import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import {
  ActionSheetController,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { PossessionDetailModel } from "../models/PossessionDetailModel";
import { LoaderComponent } from "src/app/loader/loader.component";
import { MatDialog } from "@angular/material/dialog";
import { ViewPdfComponent } from "../view-pdf/view-pdf.component";
import { ViewPossessionPdfComponent } from "./view-possession-pdf/view-pdf.component";
import { CropImageComponent } from "src/app/question-answer/crop-image/crop-image.component";
import { DocumentScanner, ResponseType } from "capacitor-document-scanner";
// import { UserResponseModel } from "src/app/model/UserResponseModel";

@Component({
  selector: "app-secure-user-au",
  templateUrl: "./possession-details.component.html",
  styleUrls: ["./possession-details.component.scss"],
})
export class PossessionDetailsComponent implements OnInit {
  userKey: number;
  applicationNo: number;
  registrationKey: number;
  pageMode: string;
  // userModel: UserResponseModel;
  selectedFile: File;
  SpousePhotoFile: File;
  familyPhotoFile: File;
  form: FormGroup = new FormGroup({});
  isSubmitDisabled: boolean = false;
  roles: { [key: number]: string };
  boards: { [key: number]: string };
  boardWiseDepartments: { [key: number]: { [key: number]: string } };
  departmentWiseDesignations: { [key: number]: { [key: number]: string } };
  applicantPhoto: string | ArrayBuffer;
  spousePhoto: string | ArrayBuffer;
  familyPhoto: string | ArrayBuffer;
  ApplicantPhotoName: string;
  SpousePhotoName: string;
  FamilyPhotoName: string;
  progressSpinnerDialog: any = null;
  counter: number = 0;
  maritalStatus: string;
  gender: string;
  data: PossessionDetailModel;
  possApplicantName: string[];
  applicantName: any;
  polCounter: number = 0;
  isButtonVisible: boolean = false;
  isSpouseButtonVisible: boolean = false;
  fileUploadVisible = false;
  fileUploadVisibleFamily = false;
  fileUploadVisibleSpouse = false;
  errorMessageVisible: any = false;
  errorMessageVisibleFamily: any = false;
  errorMessageVisibleSpouse: any = false;
  predefinedDocEditFlowOcrDone = false;
  isEdit = localStorage.getItem("isEdit");
  ocrIdOnImage: any = "";
  ocrMessage: string = "";
  uploadFromEnMr: string = "Upload from";
  galleryEnMr: string = "Gallery";
  cameraEnMr: string = "Camera";
  selectedImage: any = "";
  isUploadImageVisible: any = false;
  frontImageBlob: any = null;
  backImageBlob: any = null;
  selectedBackImage: any = "";
  isOtpVerificationVisible: any = false;
  isImageVisible: boolean = false;
  constructor(
    private preLotteryApplicationService: PreLotteryApplicationService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private dialog: MatDialog,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.applicationNo = +params["applicationNo"];
      this.registrationKey = +params["registrationKey"];

      this.loadData(this.applicationNo);
      this.getApplicantNames(this.registrationKey, this.applicationNo);
    });

    this.form = new FormGroup({
      applicantPhoto: new FormControl("", Validators.required),
      possApplicantName: new FormControl("", Validators.required),
      spouseAadhaar: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        // Validators.minLength(10),
        Validators.maxLength(12),
        Validators.minLength(12),
      ]),
      spousePhoto: new FormControl("", Validators.required),
      familyPhoto: new FormControl("", Validators.required),
      spouseEmailId: new FormControl("", [
        Validators.required,
        Validators.email,
      ]),
      spouseName: new FormControl("", Validators.required),
      checkboxForm: new FormControl("", Validators.required),
      checkboxFormSpouse: new FormControl(
        this.isSpouseButtonVisible,
        Validators.required
      ),
      userResponsibilityLst: new FormArray([]),
    });

    let selectedUserResponsibilityLst: FormArray = this.form.get(
      "userResponsibilityLst"
    ) as FormArray;
    selectedUserResponsibilityLst.push(
      new FormGroup({
        key: new FormControl(null),
        memberName: new FormControl(null, Validators.required),
        memberAge: new FormControl(null, Validators.required),
        memberRelation: new FormControl(null, Validators.required),
      })
    );
  }

  loadData(applicationKey: number) {
    this.displayProgressSpinner();

    this.preLotteryApplicationService
      .existingMarriageStatus(applicationKey)
      .subscribe(
        (data) => {
          this.data = data;
          this.maritalStatus = data.marriageStatus;
          this.gender = data.gender;
          if (
            (this.gender === "FEMALE" && this.maritalStatus === "Married") ||
            (this.gender === "MALE" && this.maritalStatus === "Married")
          ) {
            this.form
              .get("checkboxFormSpouse")
              ?.setValue(
                this.gender === "FEMALE" && this.maritalStatus === "Married"
              );
            this.onSpouseNameApplicableButton({ target: { checked: true } });
          } else {
            this.onSpouseNameApplicableButton({ target: { checked: false } });
          }

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

  getApplicantNames(registrationKey: number, applicationNo: number) {
    // this.displayProgressSpinner();
    this.preLotteryApplicationService
      .existingApplicantName(registrationKey, applicationNo)
      .subscribe(
        (data) => {
          // this.data = data;
          this.applicantName = data.possApplicantName;

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
                this.getApplicantNames(registrationKey, applicationNo);
              });
          }
        }
      );
  }

  onSubmit() {
    this.save();
  }

  async save() {
    if (this.allRowsFilled()) {
      if (
        this.form.value.possApplicantName !== null &&
        this.form.value.possApplicantName !== ""
      ) {
        if (
          this.maritalStatus === "Unmarried" ||
          this.maritalStatus === "Divorcee" ||
          this.maritalStatus === "Widow" ||
          this.maritalStatus === "Widower" ||
          (this.maritalStatus === "Married" &&
            this.form.value.spousePhoto !== undefined &&
            this.form.value.spousePhoto !== "" &&
            this.form.value.spouseName !== "" &&
            this.form.value.spouseName !== null &&
            this.form.value.spouseEmailId !== "" &&
            this.form.value.spouseEmailId !== null)
        ) {
          this.preLotteryApplicationService
            .savePossessionDetails({
              key: null,
              /* this.form.value.applicantPhoto */
              gender: this.gender,
              applicableSpouseName: this.isSpouseButtonVisible ? "Y" : "N",
              applicationNo: this.applicationNo,
              marriageStatus: this.maritalStatus,
              NewMaritalStatus: this.maritalStatus,
              applicantPhoto: this.applicantPhoto,
              applicantPhotoName: this.ApplicantPhotoName,
              spousePhoto: this.spousePhoto,
              spousePhotoName: this.SpousePhotoName,
              familyPhoto: this.familyPhoto,
              familyPhotoName: this.FamilyPhotoName,
              spouseEmailId: this.form.value.spouseEmailId,
              spouseName: this.form.value.spouseName,
              possApplicantName: this.form.value.possApplicantName,

              userResponsibilityLst: this.form.value.userResponsibilityLst.map(
                (ur) => ({
                  key: ur.key,
                  applicationNo: this.applicationNo,
                  memberName: ur.memberName,
                  memberAge: ur.memberAge,
                  memberRelation: ur.memberRelation,
                })
              ),
            })
            .subscribe(
              (data: any) => {
                if (data.status === "SUCCESS") {
                  this.successToast("Data Saved Successfully");
                  this.router.navigate([
                    "/app",
                    "application-detail-lists",
                  ]);
                } else {
                  this.isSubmitDisabled = false;
                  this.showErrorToast(data.errorMessage);
                  // this.showErrorToast("Please Select Required Detail");
                }
              },
              (error) => {
                this.isSubmitDisabled = false;
                console.log(error);
                this.showErrorToast("Please Select Required Detail");
              }
            );
        } else {
          this.preLotteryApplicationService.showErrorToast(
            "Please Fill in All Required Details"
          );
        }
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please Fill in All Required Details"
        );
      }
    } else {
      if (this.form.value.userResponsibilityLst.length === 0) {
        this.preLotteryApplicationService.showErrorToast(
          "Please Add Atleast One Family Member Details"
        );
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please Fill in All Required Family Member Details"
        );
      }
      this.isSubmitDisabled = false;
    }
  }

  allRowsFilled(): boolean {
    const selectedUserResponsibilityLst: FormArray = this.form.get(
      "userResponsibilityLst"
    ) as FormArray;

    let atLeastOneRowFilled = false;
    let hasEmptyRow = false;
    for (const control of selectedUserResponsibilityLst.controls) {
      if (
        control.get("memberName").value !== null &&
        control.get("memberAge").value !== null &&
        control.get("memberRelation").value !== null
      ) {
        atLeastOneRowFilled = true;
        this.isSubmitDisabled = false;
      }

      if (
        !(
          control.get("memberName").value &&
          control.get("memberAge").value &&
          control.get("memberRelation").value
        )
      ) {
        return false;
      }
    }
    return atLeastOneRowFilled;
  }

  validateInput(event: any) {
    var regex = /^[a-zA-Z\s]*$/;
    var searchValue = event.value || event.target.value;
    if (!regex.test(searchValue)) {
      this.showErrorToast("Only English characters are Allowed.");
      // alert("Only English characters are Allowed.");
      if (typeof searchValue === "string") {
        searchValue = searchValue.replace(/[^a-zA-Z\s]/g, "");
        event.target.value = searchValue;
      }
    }
  }

  showApplicantName(o1: any, o2: any) {
    if (o1 && o2 && o1 == o2) {
      return o1;
    } else {
      return "";
    }
  }

  async viewDocumentPdf() {
    if (this.allRowsFilled()) {
      if (
        this.form.value.possApplicantName !== null &&
        this.form.value.possApplicantName !== ""
      ) {
        if (
          this.maritalStatus === "Unmarried" ||
          this.maritalStatus === "Divorcee" ||
          this.maritalStatus === "Widow" ||
          this.maritalStatus === "Widower" ||
          (this.maritalStatus === "Married" &&
            this.form.value.spousePhoto !== undefined &&
            this.form.value.spousePhoto !== "" &&
            this.form.value.spouseName !== "" &&
            this.form.value.spouseName !== null &&
            this.form.value.spouseEmailId !== "" &&
            this.form.value.spouseEmailId !== null)
        ) {
          this.preLotteryApplicationService
            .generatePossessionLetter({
              key: null,
              /* this.form.value.applicantPhoto */
              gender: this.gender,
              applicableSpouseName: this.isSpouseButtonVisible ? "N" : "Y",
              applicationNo: this.applicationNo,
              marriageStatus: this.maritalStatus,
              NewMaritalStatus: this.maritalStatus,
              applicantPhoto: this.applicantPhoto,
              applicantPhotoName: this.ApplicantPhotoName,
              spousePhoto: this.spousePhoto,
              spousePhotoName: this.SpousePhotoName,
              familyPhoto: this.familyPhoto,
              familyPhotoName: this.FamilyPhotoName,
              spouseEmailId: this.form.value.spouseEmailId,
              spouseName: this.form.value.spouseName,
              possApplicantName: this.form.value.possApplicantName,

              userResponsibilityLst: this.form.value.userResponsibilityLst.map(
                (ur) => ({
                  key: ur.key,
                  applicationNo: this.applicationNo,
                  memberName: ur.memberName,
                  memberAge: ur.memberAge,
                  memberRelation: ur.memberRelation,
                })
              ),
            })
            .subscribe(
              (data: any) => {
                console.log("Data for base64", data);
                this.viewBaseDocumentPdf(data);
                // if (data.status === "SUCCESS") {
                //   this.successToast("Data Saved Successfully");
                //   // this.router.navigate([
                //   //   "/app",
                //   //   "application-detail-list",
                //   // ]);
                // } else {
                //   this.isSubmitDisabled = false;
                //   this.showErrorToast(data.errorMessage);
                //   // this.showErrorToast("Please Select Required Detail");
                // }
              },
              (error) => {
                this.isSubmitDisabled = false;
                console.log(error);
                this.showErrorToast("Failed to Load Pdf");
              }
            );
        } else {
          this.preLotteryApplicationService.showErrorToast(
            "Please Fill in All Required Details"
          );
        }
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please Fill in All Required Details"
        );
      }
    } else {
      if (this.form.value.userResponsibilityLst.length === 0) {
        this.preLotteryApplicationService.showErrorToast(
          "Please Add Atleast One Family Member Details"
        );
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please Fill in All Required Family Member Details"
        );
      }
      this.isSubmitDisabled = false;
    }
  }

  async presentActionSheetForSpouse() {
    this.fileUploadVisibleSpouse = true;
    this.ocrMessage = "";
    this.ocrIdOnImage = "";
    if (
      !window.location.href
        .toString()
        .startsWith("https://cidcohousing.probitysoftware.in/") &&
      !window.location.href
        .toString()
        .startsWith("https://uatilms.mhada.gov.in/") &&
      !window.location.href.toString().startsWith("http://localhost:8100/") &&
      !window.location.href
        .toString()
        .startsWith("https://housing.pmrda.gov.in/") &&
      !window.location.href
        .toString()
        .startsWith("https://sqtchousing.mhada.gov.in/")
    ) {
      this.fileUploadVisibleSpouse = true;
      this.ocrIdOnImage = "";
      const actionSheet = await this.actionSheetController.create({
        header: this.uploadFromEnMr,
        cssClass: "my-custom-class",
        buttons: [
          {
            text: this.galleryEnMr,
            icon: "images",
            data: "Data value",
            handler: () => {
              this.fileUploadForSpouse();
            },
          },
          {
            text: this.cameraEnMr,
            icon: "camera",
            id: "delete-button",
            handler: () => {
              this.captureDocImageForSpouse();
            },
          },
        ],
      });
      await actionSheet.present();
      const { role, data } = await actionSheet.onDidDismiss();
    } else {
      setTimeout(() => {
        this.fileUploadVisibleSpouse = true;
        this.fileUploadForSpouse();
      }, 200);
    }
  }

  async presentActionSheetForFamily() {
    this.fileUploadVisibleFamily = true;
    this.ocrMessage = "";
    this.ocrIdOnImage = "";
    if (
      !window.location.href
        .toString()
        .startsWith("https://cidcohousing.probitysoftware.in/") &&
      !window.location.href
        .toString()
        .startsWith("https://uatilms.mhada.gov.in/") &&
      !window.location.href.toString().startsWith("http://localhost:8100/") &&
      !window.location.href
        .toString()
        .startsWith("https://housing.pmrda.gov.in/") &&
      !window.location.href
        .toString()
        .startsWith("https://sqtchousing.mhada.gov.in/")
    ) {
      this.fileUploadVisibleFamily = true;
      this.ocrIdOnImage = "";
      const actionSheet = await this.actionSheetController.create({
        header: this.uploadFromEnMr,
        cssClass: "my-custom-class",
        buttons: [
          {
            text: this.galleryEnMr,
            icon: "images",
            data: "Data value",
            handler: () => {
              this.fileUploadForFamily();
            },
          },
          {
            text: this.cameraEnMr,
            icon: "camera",
            id: "delete-button",
            handler: () => {
              this.captureDocImageForFamily();
            },
          },
        ],
      });
      await actionSheet.present();
      const { role, data } = await actionSheet.onDidDismiss();
    } else {
      setTimeout(() => {
        this.fileUploadVisibleFamily = true;
        this.fileUploadForFamily();
      }, 200);
    }
  }

  async presentActionSheet() {
    this.fileUploadVisible = true;
    this.ocrMessage = "";
    this.ocrIdOnImage = "";
    if (
      !window.location.href
        .toString()
        .startsWith("https://cidcohousing.probitysoftware.in/") &&
      !window.location.href
        .toString()
        .startsWith("https://uatilms.mhada.gov.in/") &&
      !window.location.href.toString().startsWith("http://localhost:8100/") &&
      !window.location.href
        .toString()
        .startsWith("https://housing.pmrda.gov.in/") &&
      !window.location.href
        .toString()
        .startsWith("https://sqtchousing.mhada.gov.in/")
    ) {
      this.fileUploadVisible = true;
      this.ocrIdOnImage = "";
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

  async handleFileInput(event: any) {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.applicantPhoto = "";
      this.fileUploadVisible = false;
      const files = event.target.files;
      if (files[0].type.split("/")[0] != "image") {
        this.errorMessageVisible = true;
      } else {
        const cropperDialog = this.dialog.open(CropImageComponent, {
          disableClose: true,
          width: "600px",
          // height: "100%",
          data: event,
        });
        cropperDialog.afterClosed().subscribe((result) => {
          if (result != "") {
            if (this.isEdit == "true") {
              this.predefinedDocEditFlowOcrDone = false;
            }
            let data = result.split("data:image/png;base64,");
            this.base64ToBlob(data[1]);
          } else {
            this.reUploadImage();
          }
        });
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 2MB."
      );
    }
  }

  async handleFileInputForFamily(event: any) {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.familyPhoto = "";
      this.fileUploadVisibleFamily = false;
      const files = event.target.files;
      if (files[0].type.split("/")[0] != "image") {
        this.errorMessageVisibleFamily = true;
      } else {
        const cropperDialog = this.dialog.open(CropImageComponent, {
          disableClose: true,
          width: "600px",
          // height: "100%",
          data: event,
        });
        cropperDialog.afterClosed().subscribe((result) => {
          if (result != "") {
            if (this.isEdit == "true") {
              this.predefinedDocEditFlowOcrDone = false;
            }
            let data = result.split("data:image/png;base64,");
            this.base64ToBlobForFamily(data[1]);
          } else {
            this.reUploadImageForFamily();
          }
        });
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 2MB."
      );
    }
  }

  async handleFileInputForSpouse(event: any) {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.spousePhoto = "";
      this.fileUploadVisibleSpouse = false;
      const files = event.target.files;
      if (files[0].type.split("/")[0] != "image") {
        this.errorMessageVisibleSpouse = true;
      } else {
        const cropperDialog = this.dialog.open(CropImageComponent, {
          disableClose: true,
          width: "600px",
          // height: "100%",
          data: event,
        });
        cropperDialog.afterClosed().subscribe((result) => {
          if (result != "") {
            if (this.isEdit == "true") {
              this.predefinedDocEditFlowOcrDone = false;
            }
            let data = result.split("data:image/png;base64,");
            this.base64ToBlobForSpouse(data[1]);
          } else {
            this.reUploadImageForSpouse();
          }
        });
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 2MB."
      );
    }
  }

  // converting base64 to blob when user selects image from gallery or device
  async base64ToBlob(base64Image: any) {
    this.errorMessageVisible = false;
    this.isOtpVerificationVisible = false;
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
    if (this.applicantPhoto == "") {
      this.frontImageBlob = imageFile;
      this.applicantPhoto = "data:image/jpg;base64," + base64Image;
      // if (this.displayedQuestion.qsCode != "Q_AADHAR") {
      //   this.uploadDocuments();
      // }
    } else {
      this.applicantPhoto = "data:image/jpg;base64," + base64Image;
      this.backImageBlob = imageFile;
      // this.uploadDocuments();
    }
  }

  async base64ToBlobForFamily(base64Image: any) {
    this.errorMessageVisibleFamily = false;
    this.isOtpVerificationVisible = false;
    const byteString = window.atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpg" });
    let fileName = "ILMS_" + new Date().getTime() + ".jpg";
    const imageFile = new File([blob], fileName, { type: "image/jpg" });
    this.fileUploadVisibleFamily = false;
    if (this.familyPhoto == "") {
      this.frontImageBlob = imageFile;
      this.familyPhoto = "data:image/jpg;base64," + base64Image;
      // if (this.displayedQuestion.qsCode != "Q_AADHAR") {
      //   this.uploadDocuments();
      // }
    } else {
      this.familyPhoto = "data:image/jpg;base64," + base64Image;
      this.backImageBlob = imageFile;
      // this.uploadDocuments();
    }
  }

  async base64ToBlobForSpouse(base64Image: any) {
    this.errorMessageVisibleSpouse = false;
    this.isOtpVerificationVisible = false;
    const byteString = window.atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpg" });
    let fileName = "ILMS_" + new Date().getTime() + ".jpg";
    const imageFile = new File([blob], fileName, { type: "image/jpg" });
    this.fileUploadVisibleSpouse = false;
    if (this.spousePhoto == "") {
      this.frontImageBlob = imageFile;
      this.spousePhoto = "data:image/jpg;base64," + base64Image;
      // if (this.displayedQuestion.qsCode != "Q_AADHAR") {
      //   this.uploadDocuments();
      // }
    } else {
      this.spousePhoto = "data:image/jpg;base64," + base64Image;
      this.backImageBlob = imageFile;
      // this.uploadDocuments();
    }
  }

  reUploadImage() {
    setTimeout(() => {
      this.isUploadImageVisible = false;
    }, 10);
    this.applicantPhoto = "";
    this.selectedBackImage = "";
    this.frontImageBlob = null;
    this.backImageBlob = null;
    this.ocrMessage = "";
    this.fileUploadVisible = true;
    this.ocrIdOnImage = "";

    // this.selectedRadioOption = "";
    // this.exServicemanImageReuploaded = true;
    if (this.isEdit == "true") {
      this.predefinedDocEditFlowOcrDone = false;
    }
  }

  reUploadImageForFamily() {
    setTimeout(() => {
      this.isUploadImageVisible = false;
    }, 10);
    this.familyPhoto = "";
    this.selectedBackImage = "";
    this.frontImageBlob = null;
    this.backImageBlob = null;
    this.ocrMessage = "";
    this.fileUploadVisibleFamily = true;
    this.ocrIdOnImage = "";

    // this.selectedRadioOption = "";
    // this.exServicemanImageReuploaded = true;
    if (this.isEdit == "true") {
      this.predefinedDocEditFlowOcrDone = false;
    }
  }

  reUploadImageForSpouse() {
    setTimeout(() => {
      this.isUploadImageVisible = false;
    }, 10);
    this.spousePhoto = "";
    this.selectedBackImage = "";
    this.frontImageBlob = null;
    this.backImageBlob = null;
    this.ocrMessage = "";
    this.fileUploadVisibleSpouse = true;
    this.ocrIdOnImage = "";

    // this.selectedRadioOption = "";
    // this.exServicemanImageReuploaded = true;
    if (this.isEdit == "true") {
      this.predefinedDocEditFlowOcrDone = false;
    }
  }

  fileUpload() {
    document.getElementById("fileupload").click();
  }

  fileUploadForFamily() {
    document.getElementById("fileupload1").click();
  }

  fileUploadForSpouse() {
    document.getElementById("fileupload2").click();
  }

  // Capture Document Image from Camera
  async captureDocImage() {
    // start the document scanner
    const { scannedImages, status } = await DocumentScanner.scanDocument({
      maxNumDocuments: 1,
      responseType: ResponseType.Base64,
    });
    if (status == "success") {
      if (this.isEdit == "true") {
        this.predefinedDocEditFlowOcrDone = false;
      }
      const base64 = scannedImages[0];
      const imageName = "name.png";

      const imageBlob: any = this.dataURItoBlob(base64);
      const imageFile = new File([imageBlob], imageName, { type: "image/png" });
    }
  }

  async captureDocImageForFamily() {
    const { scannedImages, status } = await DocumentScanner.scanDocument({
      maxNumDocuments: 1,
      responseType: ResponseType.Base64,
    });
    if (status == "success") {
      if (this.isEdit == "true") {
        this.predefinedDocEditFlowOcrDone = false;
      }
      const base64 = scannedImages[0];
      const imageName = "name.png";

      const imageBlob: any = this.dataURItoBlobForFamily(base64);
      const imageFile = new File([imageBlob], imageName, { type: "image/png" });
    }
  }

  async captureDocImageForSpouse() {
    const { scannedImages, status } = await DocumentScanner.scanDocument({
      maxNumDocuments: 1,
      responseType: ResponseType.Base64,
    });
    if (status == "success") {
      if (this.isEdit == "true") {
        this.predefinedDocEditFlowOcrDone = false;
      }
      const base64 = scannedImages[0];
      const imageName = "name.png";

      const imageBlob: any = this.dataURItoBlobForSpouse(base64);
      const imageFile = new File([imageBlob], imageName, { type: "image/png" });
    }
  }

  async dataURItoBlob(base64Image: any) {
    const byteString = window.atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpg" });
    const imageFile = new File([blob], "", { type: "image/jpg" });
    if (this.applicantPhoto == "") {
      this.frontImageBlob = imageFile;
      this.applicantPhoto = "data:image/jpeg;base64," + base64Image;
      // if (this.displayedQuestion.qsCode != "Q_AADHAR") {
      //   this.uploadDocuments();
      // }
    } else {
      this.selectedBackImage = "data:image/jpeg;base64," + base64Image;
      this.backImageBlob = imageFile;
      // this.uploadDocuments();
    }
  }

  async dataURItoBlobForFamily(base64Image: any) {
    const byteString = window.atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpg" });
    const imageFile = new File([blob], "", { type: "image/jpg" });
    if (this.familyPhoto == "") {
      this.frontImageBlob = imageFile;
      this.familyPhoto = "data:image/jpeg;base64," + base64Image;
      // if (this.displayedQuestion.qsCode != "Q_AADHAR") {
      //   this.uploadDocuments();
      // }
    } else {
      this.familyPhoto = "data:image/jpeg;base64," + base64Image;
      this.backImageBlob = imageFile;
      // this.uploadDocuments();
    }
  }

  async dataURItoBlobForSpouse(base64Image: any) {
    const byteString = window.atob(base64Image);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image/jpg" });
    const imageFile = new File([blob], "", { type: "image/jpg" });
    if (this.spousePhoto == "") {
      this.frontImageBlob = imageFile;
      this.spousePhoto = "data:image/jpeg;base64," + base64Image;
      // if (this.displayedQuestion.qsCode != "Q_AADHAR") {
      //   this.uploadDocuments();
      // }
    } else {
      this.spousePhoto = "data:image/jpeg;base64," + base64Image;
      this.backImageBlob = imageFile;
      // this.uploadDocuments();
    }
  }

  previewImage = (event) => {
    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement = document.querySelector(
        "img#preview-selected-image"
      );
      if (imagePreviewElement instanceof HTMLImageElement) {
        imagePreviewElement.src = imageSrc;
        imagePreviewElement.style.display = "block";
      }
    }
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.selectedFile = event.target.files[0];
      if (
        this.selectedFile &&
        this.isAllowedImageType(this.selectedFile.type)
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
          this.applicantPhoto = reader.result;
          const fileNameParts = this.selectedFile.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.ApplicantPhotoName = fileNameWithoutExtension;
          console.log("this.form16BFile ", this.applicantPhoto);
        };
        // console.log("reader", reader.result);
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please select a valid Image file."
        );
      }
    } else {
      this.preLotteryApplicationService.showErrorToast(
        "File size exceeds 2MB."
      );
    }
  };

  async viewBaseDocumentPdf(data: any) {
    this.displayProgressSpinner();
    if (data?.status === "SUCCESS") {
      this.progressSpinnerDialog.close();
      const modal = await this.modalCtrl.create({
        component: ViewPossessionPdfComponent,
        componentProps: {
          base64: data?.data,
          documentName: "POSSESSION LETTER",
          fileName: "PROVISIONAL_OFFER_LETTER_" + new Date().getTime() + ".pdf",
        },
      });
      modal.present();
    } else {
      this.progressSpinnerDialog.close();
      const toast = await this.toastController.create({
        // message: errorMessage,
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 4000,
      });
      toast.present();
    }
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  onCheckboxChangeButton(e: any) {
    if (e.target) {
      this.isButtonVisible = e.target.checked;
      console.log("check box ticked");
    }
  }

  onSpouseNameApplicableButton(e: any) {
    if (e.target) {
      this.isSpouseButtonVisible = e.target.checked;
      console.log("check box ticked for condition", this.isSpouseButtonVisible);
    }
  }

  isAllowedImageType(fileType: string): boolean {
    return /^image\/(png|jpeg|jpg)$/.test(fileType);
  }

  applicantPhotoSelect(event) {
    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement = document.querySelector(
        "img#preview-selected-image"
      );
      if (imagePreviewElement instanceof HTMLImageElement) {
        imagePreviewElement.src = imageSrc;
        imagePreviewElement.style.display = "block";
      }
    }
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.selectedFile = event.target.files[0];
      if (
        this.selectedFile &&
        this.isAllowedImageType(this.selectedFile.type)
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
          this.applicantPhoto = reader.result;
          const fileNameParts = this.selectedFile.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.ApplicantPhotoName = fileNameWithoutExtension;
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
        "File size exceeds 2MB."
      );
    }
  }

  spousePhotoSelect(event) {
    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement = document.querySelector(
        "img#preview-selected-image-spouse"
      );
      if (imagePreviewElement instanceof HTMLImageElement) {
        imagePreviewElement.src = imageSrc;
        imagePreviewElement.style.display = "block";
      }
    }
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.SpousePhotoFile = event.target.files[0];
      if (
        this.SpousePhotoFile &&
        this.isAllowedImageType(this.SpousePhotoFile.type)
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(this.SpousePhotoFile);
        reader.onload = () => {
          this.spousePhoto = reader.result;
          const fileNameParts = this.SpousePhotoFile.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.SpousePhotoName = fileNameWithoutExtension;
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
        "File size exceeds 2MB."
      );
    }
  }

  familyPhotoSelect(event) {
    const imageFiles = event.target.files;
    const imageFilesLength = imageFiles.length;
    if (imageFilesLength > 0) {
      const imageSrc = URL.createObjectURL(imageFiles[0]);
      const imagePreviewElement = document.querySelector(
        "img#preview-selected-image-family"
      );
      if (imagePreviewElement instanceof HTMLImageElement) {
        imagePreviewElement.src = imageSrc;
        imagePreviewElement.style.display = "block";
      }
    }
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      this.familyPhotoFile = event.target.files[0];
      if (
        this.familyPhotoFile &&
        this.isAllowedImageType(this.familyPhotoFile.type)
      ) {
        const reader = new FileReader();
        reader.readAsDataURL(this.familyPhotoFile);
        reader.onload = () => {
          this.familyPhoto = reader.result;
          const fileNameParts = this.familyPhotoFile.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.FamilyPhotoName = fileNameWithoutExtension;
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
        "File size exceeds 2MB."
      );
    }
  }

  addFamilyMemberDetails() {
    let selectedUserResponsibilityLst: FormArray = this.form.get(
      "userResponsibilityLst"
    ) as FormArray;
    if (selectedUserResponsibilityLst.length < 10) {
      selectedUserResponsibilityLst.push(
        new FormGroup({
          key: new FormControl(null),
          memberName: new FormControl(null, Validators.required),
          memberAge: new FormControl(null, Validators.required),
          memberRelation: new FormControl(null, Validators.required),
        })
      );
    } else {
      this.preLotteryApplicationService.showErrorToast("Maximum limit reached");
    }
  }

  deleteResponsibility(i: number) {
    let selectedUserResponsibilityLst: FormArray = this.form.get(
      "userResponsibilityLst"
    ) as FormArray;
    selectedUserResponsibilityLst.removeAt(i);
  }

  get DetailOfFamilyMembers() {
    return this.form.get("userResponsibilityLst")["controls"];
  }

  departments(i: number) {
    let selectedUserResponsibilityLst: FormArray = this.form.get(
      "userResponsibilityLst"
    ) as FormArray;
    return this.boardWiseDepartments[
      selectedUserResponsibilityLst.controls[i].value.boardKey?.key
    ];
  }

  designations(i: number) {
    let selectedUserResponsibilityLst: FormArray = this.form.get(
      "userResponsibilityLst"
    ) as FormArray;
    return this.departmentWiseDesignations[
      selectedUserResponsibilityLst.controls[i].value.departmentKey?.key
    ];
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

  // async errorToast(errorMessage: string, dur?: number) {
  //   await this._snackBar.open(errorMessage, "Close", {
  //     horizontalPosition: "right",
  //     verticalPosition: "top",
  //     panelClass: "error-toast",
  //     duration: dur ? dur : 3 * 1000,
  //   });
  // }

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
}

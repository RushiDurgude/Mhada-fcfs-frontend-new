import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { ModalController, ToastController } from "@ionic/angular";
import { PossessionDetailModel } from "../models/PossessionDetailModel";
import { LoaderComponent } from "src/app/loader/loader.component";
import { MatDialog } from "@angular/material/dialog";
import { ApplicationOtherDocumentModel } from "../models/applicationOtherDocumentModel";
import { ViewPdfComponent } from "../view-pdf/view-pdf.component";
import { ThemeService } from "src/app/theme.service";
// import { UserResponseModel } from "src/app/model/UserResponseModel";

@Component({
  selector: "app-secure-user-au",
  templateUrl: "./application-other-document.component.html",
  styleUrls: ["./application-other-document.component.scss"],
})
export class ApplicationOtherDocumentComponent implements OnInit {
  userKey: number;
  applicationNo: number;
  applicationId: number;
  registrationKey: number;
  pageMode: string;
  // userModel: UserResponseModel;
  selectedFile: File;
  selectedFiles: File[] = [];
  selectedFileNames: string[] = [];
  form: FormGroup = new FormGroup({});
  isSubmitDisabled: boolean = false;
  showUploadButton1: boolean = false;
  progressSpinnerDialog: any = null;
  counter: number = 0;
  configDetails: any;
  data: ApplicationOtherDocumentModel;
  editConfigResponse: ApplicationOtherDocumentModel;
  applicantName: any;
  documentOtherFiles: string[] = [];
  documentFiles: (string | ArrayBuffer)[] = [];
  selectedOptionForDocument: string;
  polCounter: number = 0;
  exchangeList: any[] = [
    { name: "Exchange Tenement", value: "EXCHANGE_TENEMENT" },
    {
      name: "Swap Tenement ",
      value: "SWAP_TENEMENT",
    },
  ];
  configType: string = "APPLICATION_OTHER_DOCUMENT";
  showUploadButtonForRow: { [key: number]: boolean } = {};
  isDarkMode: boolean;

  constructor(
    private preLotteryApplicationService: PreLotteryApplicationService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private dialog: MatDialog,
    private modalCtrl: ModalController,
    private themeService: ThemeService
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.applicationId = +params["key"];
      this.displayProgressSpinner();
      this.isDarkMode = this.themeService.isDarkMode();
      console.log("this.isDarkMode+++++++++++++", this.isDarkMode);

      this.preLotteryApplicationService
        .fetchOtherDocumentStatus(this.configType)
        .subscribe(
          (data) => {
            this.configDetails = data.configDetails;

            this.progressSpinnerDialog.close();

            this.preLotteryApplicationService
              .fetchOtherDocumentForEdit(this.applicationId)
              .subscribe((data) => {
                if (data.status === "SUCCESS") {
                  this.pageMode = "Edit";
                  this.editConfigResponse = data;
                  if (this.editConfigResponse.otherDocumentLst.length > 0) {
                    this.form.patchValue({
                      documentName:
                        this.editConfigResponse.otherDocumentLst.map((item) => {
                          const matchingConfig = this.configDetails.find(
                            (config) => config.configKey === item.documentName
                          );
                          return matchingConfig
                            ? matchingConfig.configValue
                            : null;
                        }),
                    });

                    let selectedOtherDocumentLst: FormArray = this.form.get(
                      "otherDocumentLst"
                    ) as FormArray;

                    selectedOtherDocumentLst.clear();

                    this.editConfigResponse.otherDocumentLst.forEach(
                      (document, index) => {
                        const rowKey = document.key;
                        selectedOtherDocumentLst.push(
                          new FormGroup({
                            key: new FormControl(document.key),
                            documentName: new FormControl(
                              document.documentName,
                              Validators.required
                            ),
                            file: new FormControl(
                              document.documentPdfFile,
                              Validators.required
                            ),
                            fileName: new FormControl(document.documentPdfFile),
                          })
                        );
                        this.showUploadButtonForRow[rowKey] = false;
                        const fileName = document.documentPdfFile
                          .split("/")
                          .pop();
                        this.selectedFileNames[index] = fileName;
                        selectedOtherDocumentLst
                          .at(index)
                          .get("file")
                          .setValue("");
                      }
                    );
                  } else {
                    this.pageMode = "Add";
                  }
                }
              });
          },
          (error) => {
            this.progressSpinnerDialog.close();

            console.log(error);

            if (this.counter < 1) {
              this.counter++;
              this.preLotteryApplicationService
                .checkErrorForExpiredToken(error, "error-application-list-load")
                .then((num) => {
                  this.ngOnInit();
                });
            }
          }
        );

      //   this.getApplicantNames(this.registrationKey);
    });

    this.form = new FormGroup({
      otherDocumentLst: new FormArray([]),
    });

    let selectedOtherDocumentLst: FormArray = this.form.get(
      "otherDocumentLst"
    ) as FormArray;
    selectedOtherDocumentLst.push(
      new FormGroup({
        key: new FormControl(null),
        documentName: new FormControl(null, Validators.required),
        file: new FormControl(null, Validators.required),
        fileName: new FormControl(null),
      })
    );
  }

  showDocumentName(o1: any, o2: any) {
    // console.log("o1, o2 ", o1, o2);
    if (o1 && o2 && o1 === o2) {
      return o1;
    } else {
      return "";
    }
  }

  onSelectionChange(event) {
    // this.selectedOptionForDocument = event;
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selectedOptionForDocument = selectedValue;
    console.log("selectedOptionForDocument", this.selectedOptionForDocument);
  }

  onSubmit() {
    // this.save();

    if (this.pageMode === "Add") {
      this.save();
    } else {
      this.update();
    }
  }

  hasDuplicates(array: any[]): boolean {
    return new Set(array).size !== array.length;
  }

  async update() {
    if (this.allRowsFilled1()) {
      const documentNames = this.form.value.otherDocumentLst.map(
        (ur) => ur.documentName
      );
      const isDuplicate = this.hasDuplicates(documentNames);

      if (isDuplicate) {
        this.showErrorToast("Duplicate Document is not Allowed");
        this.isSubmitDisabled = false;
        return;
      }
      this.preLotteryApplicationService
        .updateDocumentDetails({
          configDetails: null,
          status: null,
          key: null,
          otherDocumentLst: this.form.value.otherDocumentLst.map(
            (ur, index) => ({
              key: ur.key,
              applicationId: this.applicationId,
              documentName: ur.documentName,
              documentPdfFile: this.documentFiles[index],
            })
          ),
        })
        .subscribe(
          (data: any) => {
            if (data.status === "SUCCESS") {
              this.successToast("Data Saved Successfully");
              this.router.navigate(["/app", "application-detail-list"]);
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
    }
    // } else {
    //   // if (this.form.value.otherDocumentLst.length === 0) {
    //   this.preLotteryApplicationService.showErrorToast(
    //     "Please Add Atleast One Family Member Details"
    //   );
    // } else {
    //   this.preLotteryApplicationService.showErrorToast(
    //     "Please Fill in All Required Family Member Details"
    //   );
    // }
    else {
      if (this.form.value.otherDocumentLst.length === 0) {
        this.preLotteryApplicationService.showErrorToast(
          "Please Add Atleast One Document Details"
        );
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please Fill in All Required Document Details"
        );
      }
      this.isSubmitDisabled = false;
    }
    this.isSubmitDisabled = false;
    // }
  }

  async save() {
    if (this.allRowsFilled()) {
      const documentNames = this.form.value.otherDocumentLst.map(
        (ur) => ur.documentName
      );
      const isDuplicate = this.hasDuplicates(documentNames);

      if (isDuplicate) {
        this.showErrorToast("Duplicate Document is not Allowed");
        this.isSubmitDisabled = false;
        return;
      }
      this.preLotteryApplicationService
        .saveOtherDocumentDetails({
          configDetails: null,
          status: null,
          key: null,
          otherDocumentLst: this.form.value.otherDocumentLst.map(
            (ur, index) => ({
              key: ur.key,
              applicationId: this.applicationId,
              documentName: ur.documentName,
              documentPdfFile: this.documentFiles[index],
            })
          ),
        })
        .subscribe(
          (data: any) => {
            if (data.status === "SUCCESS") {
              this.successToast("Data Saved Successfully");
              this.router.navigate(["/app", "application-detail-list"]);
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
    }
    // else {
    //   // if (this.form.value.otherDocumentLst.length === 0) {
    //   this.preLotteryApplicationService.showErrorToast(
    //     "Please Add Atleast One Family Member Details"
    //   );
    // }
    else {
      if (this.form.value.otherDocumentLst.length === 0) {
        this.preLotteryApplicationService.showErrorToast(
          "Please Add Atleast One Document Details"
        );
      } else {
        this.preLotteryApplicationService.showErrorToast(
          "Please Fill in All Required Document Details"
        );
      }
      this.isSubmitDisabled = false;
    }
    this.isSubmitDisabled = false;
    // }
  }

  allRowsFilled(): boolean {
    const selectedOtherDocumentLst: FormArray = this.form.get(
      "otherDocumentLst"
    ) as FormArray;

    let atLeastOneRowFilled = false;
    let hasEmptyRow = false;
    for (const control of selectedOtherDocumentLst.controls) {
      if (
        control.get("documentName").value !== null &&
        control.get("file").value !== null
      ) {
        atLeastOneRowFilled = true;
        this.isSubmitDisabled = false;
      }

      if (!(control.get("documentName").value && control.get("file").value)) {
        return false;
      }
    }
    return atLeastOneRowFilled;
  }

  allRowsFilled1(): boolean {
    const selectedOtherDocumentLst: FormArray = this.form.get(
      "otherDocumentLst"
    ) as FormArray;

    let atLeastOneRowFilled = false;

    for (const control of selectedOtherDocumentLst.controls) {
      const documentName = control.get("documentName").value;
      const fileValue = control.get("file")?.value;
      const fileName = control.get("fileName")?.value;
      console.log("fileValue", fileValue);
      console.log("fileName", fileName);
      console.log("documentName", documentName);

      if (
        documentName !== null &&
        documentName !== "" &&
        (fileValue || fileName)
      ) {
        atLeastOneRowFilled = true;
        this.isSubmitDisabled = false;
      }

      if (!(documentName && (fileValue || fileName))) {
        return false;
      }
    }

    return atLeastOneRowFilled;
  }

  // showUploadButton(e) {
  //   this.showUploadButton1 = true;
  // }
  showUploadButton(key: number) {
    this.showUploadButtonForRow[key] = true;
  }

  viewDocumentPdf(key: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchPdfDocument(key).subscribe(
      async ({ status, data, errorMessage }) => {
        if (status === "SUCCESS") {
          this.progressSpinnerDialog.close();
          const modal = await this.modalCtrl.create({
            component: ViewPdfComponent,
            componentProps: {
              base64: data,
              documentName: "Other Document",
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
              this.viewDocumentPdf(key);
            });
        }
      }
    );
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

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  showRoles(o1: any, o2: any) {
    console.log(o1, o2);
    if (o1 && o2 && o1.key == o2.key) {
      return o1.value;
    } else {
      return "";
    }
  }

  showBDD(o1: any, o2: any) {
    if (o1 && o2 && o1.key == o2.key) {
      return o1.value;
    } else {
      return "";
    }
  }

  isAllowedImageType(fileType: string): boolean {
    return /^image\/(png|jpeg|jpg)$/.test(fileType);
  }

  addOtherDocuments() {
    let selectedOtherDocumentLst: FormArray = this.form.get(
      "otherDocumentLst"
    ) as FormArray;
    if (selectedOtherDocumentLst.length < 3) {
      selectedOtherDocumentLst.push(
        new FormGroup({
          key: new FormControl(null),
          documentName: new FormControl(null, Validators.required),
          file: new FormControl(null, Validators.required),
        })
      );
    } else {
      this.preLotteryApplicationService.showErrorToast("Maximum limit reached");
    }
  }

  deleteResponsibility(i: number) {
    let selectedOtherDocumentLst: FormArray = this.form.get(
      "otherDocumentLst"
    ) as FormArray;
    selectedOtherDocumentLst.removeAt(i);
  }

  get DetailOfDocumentEnter() {
    return this.form.get("otherDocumentLst")["controls"];
  }

  // onDocumentFileSelect(event, index) {
  //   if (event.target.files[0].size < 2 * 1024 * 1024) {
  //     this.selectedFile = event.target.files[0];
  //     if (this.selectedFile && this.selectedFile.type === "application/pdf") {
  //       console.log("this.selectedFile", this.selectedFile);
  //       const reader = new FileReader();
  //       reader.readAsDataURL(this.selectedFile);
  //       reader.onload = () => {
  //         this.documentFile = reader.result;
  //         const fileNameParts = this.selectedFile.name.split(".");
  //         const fileNameWithoutExtension = fileNameParts[0];
  //         this.documentOtherFile = fileNameWithoutExtension;
  //       };
  //     } else {
  //       this.preLotteryApplicationService.showErrorToast(
  //         "Please select a valid PDF file."
  //       );
  //     }
  //   } else {
  //     this.preLotteryApplicationService.showErrorToast(
  //       "File size exceeds 2MB."
  //     );
  //   }
  // }
  onDocumentFileSelect(event: any, index: number) {
    if (event.target.files[0].size < 2 * 1024 * 1024) {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.type === "application/pdf") {
        console.log("Selected File for Row", index, ":", selectedFile);

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
          // Assuming you have an array to store document files for each row
          this.documentFiles[index] = reader.result;
          const fileNameParts = selectedFile.name.split(".");
          const fileNameWithoutExtension = fileNameParts[0];
          this.documentOtherFiles[index] = fileNameWithoutExtension;
        };

        // Store the selected file for the corresponding row
        this.selectedFiles[index] = selectedFile;
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

  // Add a method to trigger the file input click
  triggerFileInputClick(index: number) {
    const fileInput = document.getElementById(
      `fileInput${index}`
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
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

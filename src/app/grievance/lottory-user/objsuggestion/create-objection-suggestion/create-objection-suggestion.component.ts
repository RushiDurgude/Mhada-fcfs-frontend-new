import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ActionSheetController, ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { DocumentScanner, ResponseType } from "capacitor-document-scanner";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AttachmentErrorDialogComponent } from "src/app/grievance/attachment-error-dialog/attachment-error-dialog.component";
import { Board, ObjSuggestionType, Lottery, ApplicationInterface, PaymentInterface } from "src/app/grievance/interface/common-interface";
import { ObjectionSuccessDialogComponent } from "src/app/grievance/objection-success-dialog/objection-success-dialog.component";
import { OsOtpDialogComponent } from "src/app/grievance/os-otp-dialog/os-otp-dialog.component";
import { ProjectConstants } from "src/app/grievance/project-constants";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ProfileService } from "src/app/profile/profile.service";
import { SharedService } from "src/app/toolbar/shared.service";
import { CreateObjectionSuggestionService } from "./create-objection-suggestion.service";

@Component({
  selector: "app-create-objection-suggestion",
  templateUrl: "./create-objection-suggestion.component.html",
  styleUrls: ["./create-objection-suggestion.component.scss"],
})
export class CreateObjectionSuggestionComponent implements OnInit {
  protected boards: Board[] = [];
  public boardCtrl: FormControl = new FormControl();
  public boardFilterCtrl: FormControl = new FormControl();
  public filteredboards: ReplaySubject<Board[]> = new ReplaySubject<Board[]>(1);

  protected objectionSuggestion: ObjSuggestionType[] = [];
  public objectionSuggestionCtrl: FormControl = new FormControl();
  public objectionSuggestionFilterCtrl: FormControl = new FormControl();
  public filteredObjectionSuggestion: ReplaySubject<ObjSuggestionType[]> = new ReplaySubject<ObjSuggestionType[]>(1);

  protected lotteryData: Lottery[] = [];
  public lotteryCtrl: FormControl = new FormControl();
  public lotteryFilterCtrl: FormControl = new FormControl();
  public filteredLottery: ReplaySubject<Lottery[]> = new ReplaySubject<Lottery[]>(1);

  @ViewChild("attachments") attachments: any;
  @ViewChild("attachments1") attachments1: any;
  @ViewChild("attachments2") attachments2: any;
  isShowClose: boolean = false;
  isShowClose1: boolean = false;
  isShowClose2: boolean = false;

  filefirst: boolean = false;
  fileSecond: boolean = false;
  filethird: boolean = false;
  file: File = null;
  file1: File = null;
  file2: File = null;
  filenm: any;
  filenm1: any;
  filenm2: any;

  fileBase64: any;
  fileBase1_64: any;
  fileBase2_64: any;
  uploadFromEnMr: string = ProjectConstants.uploadFromEn
  galleryEnMr: string = ProjectConstants.galleryEn;
  cameraEnMr: string = ProjectConstants.cameraEn;
  tokenExpireMsg = ProjectConstants.tokenExpireMrMsg
  networkErrorMsg = ProjectConstants.networkErrorEnMsg

  activeLang: string = "";
  progressSpinnerDialog: any = null;
  platform: string = "";
  protected _onDestroy = new Subject<void>();

  protected applicationData: ApplicationInterface[] = [];
  public applicationCtrl: FormControl = new FormControl();
  public applicationFilterCtrl: FormControl = new FormControl();
  public filteredApplication: ReplaySubject<ApplicationInterface[]> = new ReplaySubject<ApplicationInterface[]>(1);

  protected paymentData: PaymentInterface[] = [];
  public paymentCtrl: FormControl = new FormControl();
  public paymentFilterCtrl: FormControl = new FormControl();
  public filteredPayment: ReplaySubject<PaymentInterface[]> = new ReplaySubject<PaymentInterface[]>(1);
  lan: string;
  constructor(
    public _formBuilder: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public toastController: ToastController,
    private profileService: ProfileService,
    private service: TranslocoService,
    public actionSheetController: ActionSheetController,
    private sharedService: SharedService,
    public createobjservice: CreateObjectionSuggestionService
  ) { }

  firstFormGroup = this._formBuilder.group({
    boardCtrl: ["", [Validators.required]],
    lotteryCtrl: [""],
    paymentCtrl: [""],
    applicationCtrl: [""],
    objectionSuggestionCtrl: ["", [Validators.required]],
    subjectCtrl: ["", [Validators.required]],
    remarkCtrl: ["", [Validators.required]],
  });
  ngOnInit() {
    localStorage.setItem("lastRoute", this.router.url);
    //call to load board
    this.showFile();
    this.platform = localStorage.getItem("platform");
    this.loadPreData();
  }

  async loadPreData() {
    this.displayProgressSpinner();
    const response: any = await this.createobjservice.loadBoard();
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.length != 0) {
        if (response[0].status == ProjectConstants.responseStatusSuccess) {
          this.boards = response;
          //set boards in array
          this.boardCtrl.setValue(this.boards[10]);
          this.filteredboards.next(this.boards.slice());
          this.boardFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
            this.filterboards();
          });
          //
        } else if (response[0].status == ProjectConstants.responseStatusFailure) {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg);
        } else {
          this.errorToast(response);
        }
      }
    } else {
      this.errorToast(response);
    }
  }

  // filter boards
  protected filterboards() {
    if (!this.boards) {
      return;
    }
    let search = this.boardFilterCtrl.value;
    if (!search) {
      this.filteredboards.next(this.boards.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredboards.next(this.boards.filter((board) => board.boardName.toLowerCase().indexOf(search) > -1));
  }
  //

  // select board dependant on grievance type
  async selectBoard(boards: any) {
    this.displayProgressSpinner();
    const response: any = await this.createobjservice.loadObjSuggestionType(boards);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status == ProjectConstants.responseStatusSuccess) {
        this.objectionSuggestion = response.tabObjectionAndSuggestionTypes;
        this.objectionSuggestionCtrl.setValue(this.objectionSuggestion[10]);
        this.filteredObjectionSuggestion.next(this.objectionSuggestion.slice());
        this.objectionSuggestionFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
          this.filtereObjectionSuggestionType();
        });
        this.lotteryData = response.lotteryEvents;
        this.lotteryCtrl.setValue(this.lotteryData[10]);
        this.filteredLottery.next(this.lotteryData.slice());
        this.lotteryFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
          this.filtereLottery();
        });
      } else {
        this.checkActiveLanguage()
        this.exceptionErrorToast(this.networkErrorMsg);
      }
    } else {
      this.errorToast(response);
    }
  }
  //
  //objection-suggestion type filter
  protected filtereObjectionSuggestionType() {
    if (!this.objectionSuggestion) {
      return;
    }
    let search = this.objectionSuggestionFilterCtrl.value;
    if (!search) {
      this.filteredObjectionSuggestion.next(this.objectionSuggestion.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredObjectionSuggestion.next(
      this.objectionSuggestion.filter((obj) => obj.objectionSuggestion.toLowerCase().indexOf(search) > -1)
    );
  }
  //

  //submit button
  async submitForm(): Promise<void> {
    if (this.firstFormGroup.valid) {
      var lottery;
      if (this.firstFormGroup.controls["lotteryCtrl"].value == "") {
        lottery = null;
      } else {
        lottery = this.firstFormGroup.controls["lotteryCtrl"].value;
      }
      if (this.filenm != null) {
        var file1_extension = "." + this.filenm.split(".")[this.filenm.split(".").length - 1];
      }
      if (this.filenm1 != null) {
        var file2_extension = "." + this.filenm1.split(".")[this.filenm1.split(".").length - 1];
      }
      if (this.filenm2 != null) {
        var file3_extension = "." + this.filenm2.split(".")[this.filenm2.split(".").length - 1];
      }
      const data = {
        fkBdid: this.firstFormGroup.controls["boardCtrl"].value,
        fkOstid: this.firstFormGroup.controls["objectionSuggestionCtrl"].value,
        osDetails: this.firstFormGroup.controls["remarkCtrl"].value,
        osSubject: this.firstFormGroup.controls["subjectCtrl"].value,
        fkLotteryid: lottery,
        file1: this.fileBase64,
        file1Ext: file1_extension,
        file2: this.fileBase1_64,
        file2Ext: file2_extension,
        file3: this.fileBase2_64,
        file3Ext: file3_extension,
        file1Name: this.filenm,
        file2Name: this.filenm1,
        file3Name: this.filenm2,
      };
      this.displayProgressSpinner();
      const response: any = await this.createobjservice.submitObjectionSuggestion(data);
      this.progressSpinnerDialog.close();
      if (response != null && !response.error) {
        if (response.status == ProjectConstants.responseStatusSuccess) {
          const dialogRef = this.dialog.open(OsOtpDialogComponent, {
            width: "fit-content",
            disableClose: true,
            data: { id: response.pkOsid, type: "Objections/Suggestion" },
          });
          dialogRef.afterClosed().subscribe(async (result) => {
            if (result == ProjectConstants.dialogCloseYes) {
              const dialogRef = this.dialog.open(ObjectionSuccessDialogComponent, {
                width: "fit-content",
                disableClose: true,
                data: { id: response.pkOsid },
              });
              dialogRef.afterClosed().subscribe((result) => {
                this.router.navigate(["my-objection-suggestion"]);
              });
            } else {
              this.router.navigate(["my-objection-suggestion"]);
            }
          });
        } else {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg);
        }
      } else {
        this.errorToast(response);
      }
    }
  }
  //

  async upload1() {
    if (
      !window.location.href.toString().startsWith("https://cidcohousing.probitysoftware.in/") &&
      !window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/") &&
      !window.location.href.toString().startsWith("http://localhost:8100/")
    ) {
      this.checkActiveLanguage();
      const actionSheet = await this.actionSheetController.create({
        header: this.uploadFromEnMr,
        cssClass: "my-custom-class",
        buttons: [
          {
            text: this.galleryEnMr,
            icon: "images",
            data: "Data value",
            handler: () => {
              this.fileUpload1();
            },
          },
          {
            text: this.cameraEnMr,
            icon: "camera",
            id: "delete-button",
            handler: () => {
              this.captureDocImage(1);
            },
          },
        ],
      });
      await actionSheet.present();
      const { role, data } = await actionSheet.onDidDismiss();
    } else {
      this.fileUpload1();
    }
  }

  //file upload 1
  async onChange(event) {
    this.file = event.target.files[0];
    var type = event.target.files[0].type;
    var size = event.target.files[0].size;
    var ext = type.split("/")[1];
    switch (ext) {
      case "jpg":
      case "png":
      case "pdf":
      case "jpeg":
        if (size <= ProjectConstants.maxFileSize) {
          if (this.file == null) {
            this.isShowClose = false;
            this.filenm = "";
          } else {
            this.filenm = this.file.name;
            this.isShowClose = true;
            this.showFile();
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString(this.file);
          }
        } else {
          this.file = null;
          this.isShowClose = false;
          this.filenm = "";
          const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
            width: "fit-content",
            data: { isSize: ProjectConstants.isSizeChecktrue },
          });
          event.target.value = "";
        }
        break;
      default:
        this.file = null;
        const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
          width: "fit-content",
          data: { isSize: ProjectConstants.isSizeCheckfalse  },
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          var returnval = result;
          event.target.value = "";
          if (this.file == null) {
            this.isShowClose = false;
          } else {
            this.filenm = this.file.name;
            this.isShowClose = true;
            this.showFile();
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString(this.file);
          }
        });
    }
  }

  fileUpload1() {
    document.getElementById("file1").click();
  }

  async captureDocImage(num) {
    // start the document scanner
    const { scannedImages, status } = await DocumentScanner.scanDocument({
      maxNumDocuments: 1,
      responseType: ResponseType.Base64,
    });
    if (status == "success") {
      const base64 = scannedImages[0];
      if (num == 1) {
        this.file = null;
        this.fileBase64 = base64;
        this.filenm = "capture1.jpeg";
        this.isShowClose = true;
        this.showFile();
      } else if (num == 2) {
        this.fileBase1_64 = base64;
        this.filenm1 = "capture2.jpeg";
        this.isShowClose1 = true;
        this.showFile();
      } else {
        this.fileBase2_64 = base64;
        this.filenm2 = "capture3.jpeg";
        this.isShowClose2 = true;
        this.showFile();
      }
    }
  }

  async upload2() {
    if (
      !window.location.href.toString().startsWith("https://cidcohousing.probitysoftware.in/") &&
      !window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/") &&
      !window.location.href.toString().startsWith("http://localhost:8100/")
    ) {
      this.checkActiveLanguage();
      const actionSheet = await this.actionSheetController.create({
        header: this.uploadFromEnMr,
        cssClass: "my-custom-class",
        buttons: [
          {
            text: this.galleryEnMr,
            icon: "images",
            data: "Data value",
            handler: () => {
              this.fileUpload2();
            },
          },
          {
            text: this.cameraEnMr,
            icon: "camera",
            id: "delete-button",
            handler: () => {
              this.captureDocImage(2);
            },
          },
        ],
      });
      await actionSheet.present();
      const { role, data } = await actionSheet.onDidDismiss();
    } else {
      this.fileUpload2();
    }
  }

  //file upload 2
  async onChange1(event) {
    this.file1 = event.target.files[0];
    var size = event.target.files[0].size;
    var type = event.target.files[0].type;
    var ext = type.split("/")[1];
    switch (ext) {
      case "jpg":
      case "png":
      case "pdf":
      case "jpeg":
        if (size <= ProjectConstants.maxFileSize) {
          if (this.file1 == null) {
            this.isShowClose1 = false;
            this.filenm1 = "";
          } else {
            this.filenm1 = this.file1.name;
            this.isShowClose1 = true;
            this.showFile();
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded1.bind(this);
            reader.readAsBinaryString(this.file1);
          }
        } else {
          this.file1 = null;
          this.isShowClose1 = false;
          this.filenm1 = "";
          const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
            width: "fit-content",
            data: { isSize: ProjectConstants.isSizeChecktrue },
          });
          event.target.value = "";
        }
        break;
      default:
        this.file1 = null;
        const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
          width: "fit-content",
          data: { isSize: ProjectConstants.isSizeCheckfalse  },
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          var returnval = result;
          event.target.value = "";
          if (this.file1 == null) {
            this.isShowClose1 = false;
          } else {
            this.isShowClose1 = true;
            this.showFile();
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded1.bind(this);
            reader.readAsBinaryString(this.file1);
          }
        });
    }
  }
  //

  fileUpload2() {
    document.getElementById("file2").click();
  }

  //file upload 3
  async onChange2(event) {
    this.file2 = event.target.files[0];
    var size = event.target.files[0].size;
    var type = event.target.files[0].type;
    var ext = type.split("/")[1];
    switch (ext) {
      case "jpg":
      case "png":
      case "pdf":
      case "jpeg":
        if (size <= ProjectConstants.maxFileSize) {
          if (this.file2 == null) {
            this.isShowClose2 = false;
            this.filenm2 = "";
          } else {
            this.filenm2 = this.file2.name;
            this.isShowClose2 = true;
            this.showFile();
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded2.bind(this);
            reader.readAsBinaryString(this.file2);
          }
        } else {
          this.file2 = null;
          this.isShowClose2 = false;
          this.filenm2 = "";
          const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
            width: "fit-content",
            data: { isSize:ProjectConstants.isSizeChecktrue },
          });
          event.target.value = "";
        }
        break;
      default:
        this.file2 = null;
        const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
          width: "fit-content",
          data: { isSize: ProjectConstants.isSizeCheckfalse  },
        });
        dialogRef.afterClosed().subscribe(async (result) => {
          var returnval = result;
          event.target.value = "";
          if (this.file2 == null) {
            this.isShowClose2 = false;
          } else {
            this.isShowClose2 = true;
            this.showFile();
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded2.bind(this);
            reader.readAsBinaryString(this.file2);
          }
        });
    }
  }
  //

  async upload3() {
    if (
      !window.location.href.toString().startsWith("https://cidcohousing.probitysoftware.in/") &&
      !window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/") &&
      !window.location.href.toString().startsWith("http://localhost:8100/")
    ) {
      this.checkActiveLanguage();
      const actionSheet = await this.actionSheetController.create({
        header: this.uploadFromEnMr,
        cssClass: "my-custom-class",
        buttons: [
          {
            text: this.galleryEnMr,
            icon: "images",
            data: "Data value",
            handler: () => {
              this.fileUpload3();
            },
          },
          {
            text: this.cameraEnMr,
            icon: "camera",
            id: "delete-button",
            handler: () => {
              this.captureDocImage(3);
            },
          },
        ],
      });
      await actionSheet.present();
      const { role, data } = await actionSheet.onDidDismiss();
    } else {
      this.fileUpload3();
    }
  }

  fileUpload3() {
    document.getElementById("file3").click();
  }

  checkActiveLanguage() {
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
      if (this.activeLang == "en") {
        this.uploadFromEnMr = ProjectConstants.uploadFromEn;
        this.galleryEnMr = ProjectConstants.galleryEn;
        this.cameraEnMr = ProjectConstants.cameraEn;
        this.networkErrorMsg = ProjectConstants.networkErrorEnMsg
        this.tokenExpireMsg=ProjectConstants.tokenExpireEnMsg
      } else {
        this.uploadFromEnMr = ProjectConstants.uploadFromMr;
        this.galleryEnMr = ProjectConstants.galleryMr;
        this.cameraEnMr = ProjectConstants.cameraMr;
        this.networkErrorMsg = ProjectConstants.networkErrorMrMsg
        this.tokenExpireMsg=ProjectConstants.tokenExpireMrMsg
      }
    });
  }

  //  file base 64 1
  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.fileBase64 = btoa(binaryString);
  }
  //

  //  file base 64 2
  _handleReaderLoaded1(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.fileBase1_64 = btoa(binaryString);
  }
  //

  //  file base 64 3
  _handleReaderLoaded2(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.fileBase2_64 = btoa(binaryString);
  }
  //

  //upload file manage function
  showFile() {
    if (this.filenm == null && this.filenm1 == null && this.filenm2 == null) {
      this.filefirst = true;
      this.fileSecond = false;
      this.filethird = false;
    } else if (this.filenm == null && this.filenm1 == null && this.filenm2 != null) {
      this.filefirst = true;
      this.fileSecond = false;
      this.filethird = false;
    } else if (this.filenm == null && this.filenm1 != null && this.filenm2 == null) {
      this.filefirst = true;
      this.fileSecond = false;
      this.filethird = false;
    } else if (this.filenm == null && this.filenm1 != null && this.filenm2 != null) {
      this.filefirst = true;
      this.fileSecond = false;
      this.filethird = false;
    } else if (this.filenm != null && this.filenm1 == null && this.filenm2 == null) {
      this.filefirst = false;
      this.fileSecond = true;
      this.filethird = false;
    } else if (this.filenm != null && this.filenm1 == null && this.filenm2 != null) {
      this.filefirst = false;
      this.fileSecond = true;
      this.filethird = false;
    } else if (this.filenm != null && this.filenm1 != null && this.filenm2 == null) {
      this.filefirst = false;
      this.fileSecond = false;
      this.filethird = true;
    } else if (this.filenm != null && this.filenm1 != null && this.filenm2 != null) {
      this.filefirst = false;
      this.fileSecond = false;
      this.filethird = false;
    }
  }
  //

  // remove upload
  removeAttachment() {
    if (this.file1 != null) {
      this.file = this.file1;
      this.filenm = this.filenm1;
      this.fileBase64 = this.fileBase1_64;
      if (this.file2 != null) {
        this.file1 = this.file2;
        this.filenm1 = this.filenm2;
        this.fileBase1_64 = this.fileBase2_64;
        this.isShowClose2 = false;
        this.file2 = null;
        this.fileBase2_64 = null;
        this.filenm2 = null;
      } else {
        this.attachments.nativeElement.value = "";
        this.file1 = null;
        this.fileBase1_64 = null;
        this.filenm1 = null;
        this.isShowClose1 = false;
      }
    } else {
      this.attachments.nativeElement.value = "";
      this.file = null;
      this.fileBase64 = null;
      this.filenm = null;
      this.isShowClose = false;
    }
    this.showFile();
  }
  //

  // remove upload
  removeAttachment1() {
    if (this.file2 != null) {
      this.file1 = this.file2;
      this.file2 = null;
      this.fileBase1_64 = this.fileBase2_64;
      this.fileBase2_64 = null;
      this.filenm1 = this.filenm2;
      this.filenm2 = null;
      this.isShowClose2 = false;
    } else {
      this.attachments1.nativeElement.value = "";
      this.isShowClose1 = false;
      this.file1 = null;
      this.filenm1 = null;
      this.fileBase1_64 = null;
    }
    this.showFile();
  }
  //

  // remove upload
  removeAttachment2() {
    this.attachments2.nativeElement.value = "";
    this.isShowClose2 = false;
    this.file2 = null;
    this.filenm2 = null;
    this.fileBase2_64 = null;
    this.showFile();
  }
  //

  //progress bar
  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }
  //

  //error toast
  async errorToast(error: any) {
    this.checkActiveLanguage()
    if (error.error.message != undefined) {
      if (error.error.message.includes("JWT expired")) {
        if (this.platform == "browser" || this.platform == "browser-local") {
          alert(this.tokenExpireMsg);
          localStorage.clear();
          this.router.navigate(["/"]);
          window.location.reload();
        } else {
          const response: any = await this.profileService.refreshtoken();
          localStorage.setItem("token", response.token);
          // window.location.reload();
          this.ngOnInit();
        }
      } else {
        const toast = await this.toastController.create({
          message: this.networkErrorMsg,
          icon: "information-circle",
          position: "top",
          cssClass: "toast error-toast",
          duration: 5000,
        });
        toast.present();
        setTimeout(() => {
          this.progressSpinnerDialog.close();
          this.router.navigate(["my-objection-suggestion"]);
        }, 2000);
      }
    } else {
      const toast = await this.toastController.create({
        message: this.networkErrorMsg,
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 5000,
      });
      toast.present();
      // this.router.navigate([''])
      toast.present();
      setTimeout(() => {
        this.progressSpinnerDialog.close();
        this.router.navigate(["my-objection-suggestion"]);
      }, 2000);
    }
  }
  //

  async exceptionErrorToast(msg) {
    const toast = await this.toastController.create({
      message:msg,
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 5000,
    });
    toast.present();
    setTimeout(() => {
      this.router.navigate(["my-objection-suggestion"]);
    }, 2000);
  }

  //lottery filter
  protected filtereLottery() {
    if (!this.lotteryData) {
      return;
    }
    let search = this.lotteryFilterCtrl.value;
    if (!search) {
      this.filteredLottery.next(this.lotteryData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredLottery.next(
      this.lotteryData.filter((lotteryData) => lotteryData.lotteryName.toLowerCase().indexOf(search) > -1)
    );
  }
  //

  //for ui header scroll fixed
  scrollToTopVisible = false;
  @ViewChild("divToScroll") divToScroll: ElementRef;
  onScroll(event): void {
    if (this.divToScroll.nativeElement.scrollTop > 500) {
      this.scrollToTopVisible = true;
    } else {
      this.scrollToTopVisible = false;
    }
  }
  //
}

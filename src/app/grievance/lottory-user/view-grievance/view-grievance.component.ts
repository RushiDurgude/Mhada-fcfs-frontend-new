import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ProfileService } from 'src/app/profile/profile.service';
import { AttachmentErrorDialogComponent } from '../../attachment-error-dialog/attachment-error-dialog.component';
import { CloseGrievanceDialogComponent } from '../../close-grievance-dialog/close-grievance-dialog.component';
import { ViewattachmentComponent } from '../../viewattachment/viewattachment.component';
import { ViewGrievanceService } from './view-grievance.service';
import { Directory, Filesystem } from "@capacitor/filesystem";
import { DatePipe, formatDate } from '@angular/common';
import { TranslocoService } from '@ngneat/transloco';
import { SharedService } from 'src/app/toolbar/shared.service';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner';
import { ProjectConstants } from '../../project-constants';
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { Device } from "@capacitor/device";

//import jsPDF from 'jspdf';
//import domToImage from 'dom-to-image';
// import moment from 'moment';
//import htmlToPdfmake from 'html-to-pdfmake'
//import pdfMake from 'pdfmake/build/pdfmake';
//import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-grievance',
  templateUrl: './view-grievance.component.html',
  styleUrls: ['./view-grievance.component.scss'],
})
export class ViewGrievanceComponent implements OnInit {
  myid: any;
  grievancesId: any;
  grievanceHistory = [];
  grievanceId: any;
  boardName: any;
  grievanceType: any;
  id: any;
  status: any;
  subject: any;
  remark: any;
  resstatus: any;
  document: any;
  documentList: any = []
  createdOn: any;
  applicationName: any;
  lotteryName: any;
  paymentAmount: any;
  docType: string;
  isShowReply: boolean = false;
  replyCtrl = new FormControl();
  closeCheckbox: boolean = false
  reopenCheckbox: boolean = false
  docSplit = ProjectConstants.docSplit
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('attachments') attachments: any;
  @ViewChild('attachments1') attachments1: any;
  @ViewChild('attachments2') attachments2: any;
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

  platform: string = "";
  closeGrievance: any
  reOpenGrievance: any
  progressSpinnerDialog: any = null;
  date: any;
  lan: string;

  uploadFromEnMr: string = ProjectConstants.uploadFromEn
  galleryEnMr: string = ProjectConstants.galleryEn;
  cameraEnMr: string = ProjectConstants.cameraEn;
  activeLang: string = "";
  saveEnMrMSg: string = ProjectConstants.fileDownloadSuccessEn
  successReplyEnMr = ProjectConstants.replySuccessEn
  fileError = ProjectConstants.fileDownloadErrorEn
  tokenExpireMsg = ProjectConstants.tokenExpireMrMsg
  networkErrorMsg = ProjectConstants.networkErrorEnMsg
  constructor(public activatedRoute: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public actionSheetController: ActionSheetController,
    private sharedService: SharedService,
    private service: TranslocoService,
    public toastController: ToastController,
    private profileService: ProfileService,
    private fileOpener: FileOpener,
    public viewGrievanceService: ViewGrievanceService) { }

  ngOnInit() {
    localStorage.setItem('lastRoute', this.router.url);
    this.grievancesId = this.activatedRoute.snapshot.paramMap.get('myid');
    this.platform = localStorage.getItem("platform");
    this.loadGrievanceHistory();
    this.showFile()
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  //auto scroll history
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  //

  //exception toast
  async exceptionErrorToast(msg, isNavigate) {
    const toast = await this.toastController.create({
      message: msg,
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 5000,
    });
    toast.present();
    if (isNavigate) {
      setTimeout(() => {
        this.router.navigate(['my-grievances'])
      }, 2000);
    }
  }
  //

  //
  async loadGrievanceHistory() {
    this.displayProgressSpinner();
    const response: any = await this.viewGrievanceService.loadGrievanceHistoryById(this.grievancesId);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status == ProjectConstants.responseStatusSuccess) {
        if (response.tabUserGrievance.length != 0) {
          this.grievanceId = response.tabUserGrievance.pkUsgrid;
          this.boardName = response.tabUserGrievance.boardName;
          this.grievanceType = response.tabUserGrievance.grivType;
          this.subject = response.tabUserGrievance.usGriSubject;
          this.remark = response.tabUserGrievance.usGriDetails;
          this.createdOn = response.tabUserGrievance.createdOn;
          // this.grievanceHistory = response.tabGrievanceHistory.sort((a, b) => a.pkGhid > b.pkGhid ? 1 : -1)
          this.grievanceHistory = response.tabGrievanceHistory.map((item) => {
            if (item.ghDocument1 != null) {
               item.ghDocument1 = item.ghDocument1
            }
            if (item.ghDocument2 != null) {
               item.ghDocument2 = item.ghDocument2
            }
            if (item.ghDocument3 != null) {
               item.ghDocument3 = item.ghDocument3
            }
            return item
          })
      
          this.resstatus = response.tabUserGrievance.statusName;
          this.document = response.tabUserGrievance.usGriDocument1
          this.applicationName = response.tabUserGrievance.applicationNo
          this.lotteryName = response.tabUserGrievance.lotteryName
          this.paymentAmount = response.tabUserGrievance.onlinePaymentName
          if (response.tabUserGrievance.fkStid != 9 && response.tabUserGrievance.fkStid != 5 && response.tabUserGrievance.fkStid != 8) {
            this.closeCheckbox = true
          }
          if (response.tabUserGrievance.fkStid == 5 || response.tabUserGrievance.fkStid == 8) {
            this.reopenCheckbox = true
          }
          if (response.tabUserGrievance.usGriDocument1 != null) {
            this.documentList.push(response.tabUserGrievance.usGriDocument1)
          }
          if (response.tabUserGrievance.usGriDocument2 != null) {
            this.documentList.push(response.tabUserGrievance.usGriDocument2)
          }
          if (response.tabUserGrievance.usGriDocument3 != null) {
            this.documentList.push(response.tabUserGrievance.usGriDocument3)
          }
          if (response.tabUserGrievance.fkStid == 3) {
            this.isShowReply = true;
          }
        }
      } else if (response.status == ProjectConstants.responseStatusFailure) {
        this.checkActiveLanguage()
        this.exceptionErrorToast(this.networkErrorMsg, true)
      } else {
        this.errorToast(response)
      }
    } else {
      this.errorToast(response)
    }
  }

  async replyTosupport() {
    if (this.filenm != null) {
      var file1_extension = '.' + this.filenm.split('.')[this.filenm.split('.').length - 1]
    }
    if (this.filenm1 != null) {
      var file2_extension = '.' + this.filenm1.split('.')[this.filenm1.split('.').length - 1]
    }
    if (this.filenm2 != null) {
      var file3_extension = '.' + this.filenm2.split('.')[this.filenm2.split('.').length - 1]
    }
    if (this.replyCtrl.value != null) {
      const data = {
        'ghRemark': this.replyCtrl.value,
        'fkUsGriid': this.grievancesId,
        'file1': this.fileBase64,
        'file1Ext': file1_extension,
        'file2': this.fileBase1_64,
        'file2Ext': file2_extension,
        'file3': this.fileBase2_64,
        'file3Ext': file3_extension,
        'file1Name': this.filenm,
        'file2Name': this.filenm1,
        'file3Name': this.filenm2
      }

      this.displayProgressSpinner();
      const response: any = await this.viewGrievanceService.replyGrievance(data);
      this.progressSpinnerDialog.close();
      if (response != null && !response.error) {
        if (response.status == ProjectConstants.responseStatusSuccess) {
          this.checkActiveLanguage
          this.successToast(this.successReplyEnMr)
          this.gotoList()
        } else if (response.status == ProjectConstants.responseStatusFailure) {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg, true)
        } else {
          this.errorToast(response)
        }
      } else {
        this.errorToast(response)
      }
    }
  }

  gotoList() {
    this.router.navigate(['/my-grievances'])
  }



  //view attached document when click on eye icon
  async ViewdownloadAttachment(ghDocument) {
    if (ghDocument.split('.').pop() == 'jpg' || ghDocument.split('.').pop() == 'jpeg' || ghDocument.split('.').pop() == 'png') {
      this.docType = "image/" + ghDocument.split('.').pop()
    } else if (ghDocument.split('.').pop() == 'pdf') {
      this.docType = "application/pdf"
    }
    this.displayProgressSpinner();
    const response: any = await this.viewGrievanceService.downloadView(ghDocument.split("/").pop());
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status == ProjectConstants.responseStatusSuccess) {
        const dialog = this.dialog.open(ViewattachmentComponent, {
          disableClose: true,
          width: "600px",
          data: [response.imgResponseString, this.grievancesId, this.docType, ghDocument]
        });
      } else if (response.status == ProjectConstants.responseStatusFailure) {
        if (response.code = ProjectConstants.noAbleToDownloadErCode) {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.fileError, false)
        } else {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg, true)
        }
      }
    } else {
      this.errorToast(response)
    }
  }
  //


  //download attached document directly
  async downloadAttachment(ghDocument) {
    this.displayProgressSpinner();
    if (ghDocument.split('.').pop() == 'jpg' || ghDocument.split('.').pop() == 'jpeg' || ghDocument.split('.').pop() == 'png') {
      this.docType = "image/" + ghDocument.split('.').pop()
    } else if (ghDocument.split('.').pop() == 'pdf') {
      this.docType = "application/pdf"
    }
    const response: any = await this.viewGrievanceService.downloadView(ghDocument.split("/").pop());
    this.progressSpinnerDialog.close();
    // alert(ghDocument.split('.').pop())
    if (response != null && !response.error) {
      if (response.status == ProjectConstants.responseStatusSuccess) {
        let folder = Directory.Documents;
        let device = await Device.getInfo();
        if (device.operatingSystem == "android" && device.platform == "android" && device.osVersion >= "11") {
          if (device.osVersion >= "13") {
            folder = Directory.External;
          } else {
            folder = Directory.Documents;
          }
        }

        let platform = localStorage.getItem("platform");
        if (platform == "android" || platform == "ios") {
          if (device.osVersion < "13" || device.platform == "ios") {
          try {
            let ret = await Filesystem.mkdir({
              path: "ihlms",
              directory: Directory.Documents,
              recursive: false,
            });
          } catch (e) {
            console.log("Folder already exists");
          }
        }
        const date = new Date().toDateString(),
            time = new Date().getTime()

        let docName= "ihlms/" +
        this.grievancesId + "_" + date + "_" + time +
        '.' + ghDocument.split('.').pop()

        if (device.osVersion >= "13") {
          docName = docName.replace("ihlms/", "");
        }
          await Filesystem.writeFile({
            path:docName,
            data: "data:" + this.docType + ";base64," + response.imgResponseString,
            // directory: Directory.Documents,
            directory:folder
          }).then((path: any) => {
            // if (device.osVersion >= "13" && device.platform == "android") {
            this.openFile(path.uri,"data:" + this.docType + ";base64,");
            // }
          });
          this.successToast(this.saveEnMrMSg)
        } else {
          const byteArray = new Uint8Array(
            atob(response.imgResponseString)
              .split("")
              .map((char) => char.charCodeAt(0))
          );
          const date = new Date().toDateString(),
            time = new Date().getTime()
          let blob = new Blob([byteArray], { type: this.docType });
          var src = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = src;
          link.download = this.grievancesId + "_" + date + "_" + time +
            '.' + ghDocument.split('.').pop();
          // link.download = ghDocument.split("\\")[ghDocument.split("\\").length - 1];
          link.click();
          this.successToast(this.saveEnMrMSg)
        }
      } else if (response.status == ProjectConstants.responseStatusFailure) {
        if (response.code = ProjectConstants.noAbleToDownloadErCode) {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.fileError, false)
        } else {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg, true)
        }
      }
    } else {
      this.errorToast(response)
    }
  }
  //


  async openFile(path: string,docType:string) {
    try {
      this.fileOpener
        .open(path, docType)
        .then(() => console.log("File is opened"))
        .catch((e) => console.log("Error opening file"));
    } catch (error) {
      console.log("open file error : ");
    }
  }

  async successToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      icon: "checkmark-circle-outline",
      position: "top",
      cssClass: "toast success-toast",
      duration: 5000,
    });
    toast.present();
  }



  // remove upload
  removeAttachment() {
    if (this.file1 != null) {
      this.file = this.file1
      this.filenm = this.filenm1
      this.fileBase64 = this.fileBase1_64
      if (this.file2 != null) {
        this.file1 = this.file2
        this.filenm1 = this.filenm2
        this.fileBase1_64 = this.fileBase2_64
        this.isShowClose2 = false;
        this.file2 = null
        this.fileBase2_64 = null
        this.filenm2 = null
      } else {
        this.attachments.nativeElement.value = '';
        this.file1 = null
        this.fileBase1_64 = null
        this.filenm1 = null
        this.isShowClose1 = false;
      }
    } else {
      this.attachments.nativeElement.value = '';
      this.file = null
      this.fileBase64 = null
      this.filenm = null
      this.isShowClose = false;
    }
    this.showFile()
  }
  //

  // remove upload
  removeAttachment1() {
    if (this.file2 != null) {
      this.file1 = this.file2
      this.file2 = null
      this.fileBase1_64 = this.fileBase2_64
      this.fileBase2_64 = null
      this.filenm1 = this.filenm2
      this.filenm2 = null
      this.isShowClose2 = false;
    } else {
      this.attachments1.nativeElement.value = '';
      this.isShowClose1 = false;
      this.file1 = null
      this.filenm1 = null
      this.fileBase1_64 = null
    }
    this.showFile()
  }
  //

  // remove upload
  removeAttachment2() {
    this.attachments2.nativeElement.value = '';
    this.isShowClose2 = false;
    this.file2 = null
    this.filenm2 = null
    this.fileBase2_64 = null
    this.showFile()
  }
  //

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.fileBase64 = btoa(binaryString);
  }

  _handleReaderLoaded1(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.fileBase1_64 = btoa(binaryString);
  }

  _handleReaderLoaded2(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.fileBase2_64 = btoa(binaryString);
  }

  //file upload 1
  async upload1() {
    if (
      !window.location.href.toString().startsWith("https://cidcohousing.probitysoftware.in/") &&
      !window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/") &&
      !window.location.href.toString().startsWith("http://localhost:8100/")
    ) {
      this.checkActiveLanguage()
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
      this.fileUpload1()
    }
  }

  //file upload 1
  async onChange(event) {
    this.file = event.target.files[0];
    var type = event.target.files[0].type;
    var size = event.target.files[0].size;
    var ext = type.split("/")[1];
    switch (ext) {
      case 'jpg':
      case 'png':
      case 'pdf':
      case 'jpeg':
        if (size <= ProjectConstants.maxFileSize) {
          if (this.file == null) {
            this.isShowClose = false;
            this.filenm = ""
          } else {
            this.filenm = this.file.name
            this.isShowClose = true;
            this.showFile()
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsBinaryString(this.file);
          }
        } else {
          this.file = null;
          this.isShowClose = false;
          this.filenm = ""
          const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
            width: 'fit-content',
            data: { isSize: ProjectConstants.isSizeChecktrue },
          });
          event.target.value = "";
        }
        break;
      default:
        this.file = null;
        const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
          width: 'fit-content',
          data: { isSize: ProjectConstants.isSizeCheckfalse },
        });
        dialogRef.afterClosed().subscribe(async result => {
          var returnval = result;
          event.target.value = "";
          event.target.value = "";
          if (this.file == null) {
            this.isShowClose = false;
          } else {
            this.filenm = this.file.name
            this.isShowClose = true;
            this.showFile()
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
        this.file = null
        this.fileBase64 = base64
        this.filenm = "capture1.jpeg"
        this.isShowClose = true;
        this.showFile()
      } else if (num == 2) {
        this.fileBase1_64 = base64
        this.filenm1 = "capture2.jpeg"
        this.isShowClose1 = true;
        this.showFile()
      } else {
        this.fileBase2_64 = base64
        this.filenm2 = "capture3.jpeg"
        this.isShowClose2 = true;
        this.showFile()
      }
    }
  }

  async upload2() {
    if (
      !window.location.href.toString().startsWith("https://cidcohousing.probitysoftware.in/") &&
      !window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/") &&
      !window.location.href.toString().startsWith("http://localhost:8100/")
    ) {
      this.checkActiveLanguage()
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
      this.fileUpload2()
    }
  }

  //file upload 2
  async onChange1(event) {
    this.file1 = event.target.files[0];
    var size = event.target.files[0].size;
    var type = event.target.files[0].type;
    var ext = type.split("/")[1];
    switch (ext) {
      case 'jpg':
      case 'png':
      case 'pdf':
      case 'jpeg':
        if (size <= ProjectConstants.maxFileSize) {
          if (this.file1 == null) {
            this.isShowClose1 = false;
            this.filenm1 = ""
          } else {
            this.filenm1 = this.file1.name
            this.isShowClose1 = true;
            this.showFile()
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded1.bind(this);
            reader.readAsBinaryString(this.file1);
          }
        } else {
          this.file1 = null;
          this.isShowClose1 = false;
          this.filenm1 = ""
          const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
            width: 'fit-content',
            data: { isSize: ProjectConstants.isSizeChecktrue },
          });
          event.target.value = "";
        }
        break;
      default:
        this.file1 = null;
        const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
          width: 'fit-content',
          data: { isSize: ProjectConstants.isSizeCheckfalse },
        });
        dialogRef.afterClosed().subscribe(async result => {
          var returnval = result;
          event.target.value = "";
          if (this.file1 == null) {
            this.isShowClose1 = false;
          } else {
            this.isShowClose1 = true;
            this.showFile()
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
      case 'jpg':
      case 'png':
      case 'pdf':
      case 'jpeg':
        if (size <= ProjectConstants.maxFileSize) {
          if (this.file2 == null) {
            this.isShowClose2 = false;
            this.filenm2 = ""
          } else {
            this.filenm2 = this.file2.name
            this.isShowClose2 = true;
            this.showFile()
            var reader = new FileReader();
            reader.onload = this._handleReaderLoaded2.bind(this);
            reader.readAsBinaryString(this.file2);
          }
        } else {
          this.file2 = null;
          this.isShowClose2 = false;
          this.filenm2 = ""
          const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
            width: 'fit-content',
            data: { isSize: ProjectConstants.isSizeChecktrue },
          });
          event.target.value = "";
        }
        break;
      default:
        this.file2 = null;
        const dialogRef = this.dialog.open(AttachmentErrorDialogComponent, {
          width: 'fit-content',
          data: { isSize: ProjectConstants.isSizeCheckfalse },
        });
        dialogRef.afterClosed().subscribe(async result => {
          var returnval = result;
          event.target.value = "";
          if (this.file2 == null) {
            this.isShowClose2 = false;
          } else {
            this.isShowClose2 = true;
            this.showFile()
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
      this.checkActiveLanguage()
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
      this.fileUpload3()
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
        this.saveEnMrMSg = ProjectConstants.fileDownloadSuccessEn
        this.fileError = ProjectConstants.fileDownloadErrorEn
        this.successReplyEnMr = ProjectConstants.replySuccessEn
        this.networkErrorMsg = ProjectConstants.networkErrorEnMsg
        this.tokenExpireMsg = ProjectConstants.tokenExpireEnMsg
      } else {
        this.uploadFromEnMr = ProjectConstants.uploadFromEn;
        this.galleryEnMr = ProjectConstants.galleryEn;
        this.cameraEnMr = ProjectConstants.cameraEn;
        this.saveEnMrMSg = ProjectConstants.fileDownloadSuccessMr
        this.fileError = ProjectConstants.fileDownloadErrorMr
        this.successReplyEnMr = ProjectConstants.replySuccessMr
        this.networkErrorMsg = ProjectConstants.networkErrorMrMsg
        this.tokenExpireMsg = ProjectConstants.tokenExpireMrMsg
      }
    });
  }

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
    }
    else if (this.filenm != null && this.filenm1 == null && this.filenm2 == null) {
      this.filefirst = false;
      this.fileSecond = true;
      this.filethird = false;
    }
    else if (this.filenm != null && this.filenm1 == null && this.filenm2 != null) {
      this.filefirst = false;
      this.fileSecond = true;
      this.filethird = false;
    }
    else if (this.filenm != null && this.filenm1 != null && this.filenm2 == null) {
      this.filefirst = false;
      this.fileSecond = false;
      this.filethird = true;
    }
    else if (this.filenm != null && this.filenm1 != null && this.filenm2 != null) {
      this.filefirst = false;
      this.fileSecond = false;
      this.filethird = false;
    }
  }
  //

  //close grievance
  UpdatecloseGrievance() {
    const dialogRef = this.dialog.open(CloseGrievanceDialogComponent, {
      width: 'fit-content',
      data: { id: 'Close' },
    });

    dialogRef.afterClosed().subscribe(async result => {
      var returnval = result;
      if (returnval == ProjectConstants.noMsg) {
        this.closeGrievance = false
      } else {
        this.closeGrievance = true
        this.displayProgressSpinner();
        const response: any = await this.viewGrievanceService.cancelGrievance(this.grievancesId);
        this.progressSpinnerDialog.close();
        if (response != null && !response.error) {
          if (response.status == ProjectConstants.responseStatusSuccess) {
            this.router.navigate(['/my-grievances'])
          } else if (response.status == ProjectConstants.responseStatusFailure) {
            this.checkActiveLanguage()
            this.exceptionErrorToast(this.networkErrorMsg, true)
          } else {
            this.errorToast(response)
          }
        } else {
          this.errorToast(response)
        }
      }
    });
  }
  //

  //reopen grievance
  UpdateReopenGrievance() {
    const dialogRef = this.dialog.open(CloseGrievanceDialogComponent, {
      width: 'fit-content',
      data: { id: 'Reopen' },
    });
    dialogRef.afterClosed().subscribe(async result => {
      var returnval = result;
      if (returnval == ProjectConstants.noMsg) {
        this.reOpenGrievance = false
      } else {
        this.reOpenGrievance = true
        this.displayProgressSpinner();
        const response: any = await this.viewGrievanceService.reopenGrievance(this.grievancesId);
        this.progressSpinnerDialog.close();
        if (response != null && !response.error) {
          if (response.status == ProjectConstants.responseStatusSuccess) {
            this.router.navigate(['/my-grievances'])
          } else if (response.status == ProjectConstants.responseStatusFailure) {
            this.checkActiveLanguage()
            this.exceptionErrorToast(this.networkErrorMsg, false)
          } else {
            this.errorToast(response)
          }
        } else {
          this.errorToast(response)
        }
      }
    });
  }
  //

  //error toast
  async errorToast(error: any) {
    this.checkActiveLanguage()
    if (error.error.message != undefined) {
      if (error.error.message.includes("JWT expired")) {
        if (this.platform == "browser" || this.platform == "browser-local") {
          alert(this.tokenExpireMsg)
          localStorage.clear();
          this.router.navigate(["/"]);
          window.location.reload();
        } else {
          const response: any = await this.profileService.refreshtoken();
          // localStorage.setItem("token", response.token);
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
          this.router.navigate(['my-grievances'])
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
      setTimeout(() => {
        this.progressSpinnerDialog.close();
        this.router.navigate(['my-grievances'])
      }, 2000);
    }
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


  scrollToTopVisible = false;
  @ViewChild("divToScroll") divToScroll: ElementRef;
  onScroll(event): void {
    if (this.divToScroll.nativeElement.scrollTop > 500) {
      this.scrollToTopVisible = true;
    } else {
      this.scrollToTopVisible = false;
    }
  }
}




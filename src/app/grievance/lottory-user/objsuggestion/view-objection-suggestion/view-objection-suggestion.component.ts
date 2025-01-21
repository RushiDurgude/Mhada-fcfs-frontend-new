import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner';
import { AttachmentErrorDialogComponent } from 'src/app/grievance/attachment-error-dialog/attachment-error-dialog.component';
import { ProjectConstants } from 'src/app/grievance/project-constants';
import { ViewattachmentComponent } from 'src/app/grievance/viewattachment/viewattachment.component';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ProfileService } from 'src/app/profile/profile.service';
import { SharedService } from 'src/app/toolbar/shared.service';
import { ViewObjectionSuggestionService } from './view-objection-suggestion.service';
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { Device } from "@capacitor/device";

@Component({
  selector: 'app-view-objection-suggestion',
  templateUrl: './view-objection-suggestion.component.html',
  styleUrls: ['./view-objection-suggestion.component.scss'],
})
export class ViewObjectionSuggestionComponent implements OnInit {
  myid: any;
  osId: any;
  osHistory: any = [];
  osid: any;
  boardName: any;
  osType: any;
  id: any;
  status: any;
  subject: any;
  remark: any;
  resstatus: any;
  document: any;
  createdOn: any;
  documentList: any = []
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
  docType: string;
  isShowReply: boolean = false;
  replyCtrl = new FormControl();
  platform: string = "";

  fileBase64: any;
  fileBase1_64: any;
  fileBase2_64: any;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('attachments') attachment: any;
  progressSpinnerDialog: any = null;
  lan: any;
  tokenExpireMsg = ProjectConstants.tokenExpireMrMsg
  networkErrorMsg = ProjectConstants.networkErrorEnMsg
  uploadFromEnMr: string = ProjectConstants.uploadFromEn
  galleryEnMr: string = ProjectConstants.galleryEn;
  cameraEnMr: string = ProjectConstants.cameraEn;
 
  activeLang: string = "";
  saveEnMrMSg: string = ProjectConstants.fileDownloadSuccessEn
  successReplyEnMr = ProjectConstants.replySuccessEn
  fileError = ProjectConstants.fileDownloadErrorEn

  constructor(public activatedRoute: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    private service: TranslocoService,
    public toastController: ToastController,
    private profileService: ProfileService,
    public actionSheetController: ActionSheetController,
    private sharedService: SharedService,
    private fileOpener: FileOpener,
    public viewObjeSuggestionService: ViewObjectionSuggestionService) { }

  ngOnInit() {
    localStorage.setItem('lastRoute', this.router.url);
    this.osId = this.activatedRoute.snapshot.paramMap.get('myid');
    this.showFile()
    this.platform = localStorage.getItem("platform");
    this.loadObjSuggesionHistory();
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }


  async loadObjSuggesionHistory() {
    this.displayProgressSpinner();
    const response: any = await this.viewObjeSuggestionService.loadObjectionSuggestionHistoryById(this.osId);
    this.progressSpinnerDialog.close()
    if (response != null && !response.error) {
      if (response.status == ProjectConstants.responseStatusSuccess) {
        if (response.tabUserObjectionSuggestion.length != 0) {
          this.osid = response.tabUserObjectionSuggestion.pkOsid;
          this.boardName = response.tabUserObjectionSuggestion.boardName;
          this.osType = response.tabUserObjectionSuggestion.objectionSuggestionName;
          this.subject = response.tabUserObjectionSuggestion.osSubject;
          this.remark = response.tabUserObjectionSuggestion.osDetails;
          this.createdOn = response.tabUserObjectionSuggestion.createdOn;
          // this.osHistory = response.tabOSHistories.sort((a, b) => a.pkOshId > b.pkOshId ? 1 : -1)
          this.osHistory = response.tabOSHistories.map((item) => {
            if (item.ohDocument1 != null) {
               item.ohDocument1 = item.ohDocument1
            }
            if (item.ohDocument2 != null) {
               item.ohDocument2 = item.ohDocument2
            }
            if (item.ohDocument3 != null) {
               item.ohDocument3 = item.ohDocument3
            }
            return item
          })
          this.resstatus = response.tabUserObjectionSuggestion.statusName;
          if (response.tabUserObjectionSuggestion.osDocument1 != null) {
            this.documentList.push(response.tabUserObjectionSuggestion.osDocument1)
          }
          if (response.tabUserObjectionSuggestion.osDocument2 != null) {
            this.documentList.push(response.tabUserObjectionSuggestion.osDocument2)
          }
          if (response.tabUserObjectionSuggestion.osDocument3 != null) {
            this.documentList.push(response.tabUserObjectionSuggestion.osDocument3)
          }
          if (response.tabUserObjectionSuggestion.statusName == "In Progress" && response.tabUserObjectionSuggestion.uosType == "Objection") {
            this.isShowReply = true;
          }
        }
      } else {
        this.checkActiveLanguage()
        this.exceptionErrorToast(this.networkErrorMsg,true)
      }

    } else {
      this.errorToast(response)
    }
  }


  //view attached document when click on eye icon
  async ViewdownloadAttachment(ghDocument) {
    if (ghDocument.split('.').pop() == 'jpg' || ghDocument.split('.').pop() == 'jpeg' || ghDocument.split('.').pop() == 'png') {
      this.docType = "image/" + ghDocument.split('.').pop()
    } else if (ghDocument.split('.').pop() == 'pdf') {
      this.docType = "application/pdf"
    }
    const response: any = await this.viewObjeSuggestionService.downloadView(ghDocument);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status == ProjectConstants.responseStatusSuccess) {
        const dialog = this.dialog.open(ViewattachmentComponent, {
          disableClose: true,
          width: "600px",
          data: [response.imgResponseString, this.osId, this.docType, ghDocument]
        });
      } else if (response.status == ProjectConstants.responseStatusFailure) {
        if (response.code = ProjectConstants.noAbleToDownloadErCode) {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.fileError,false)
        } else {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg,true)
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
    const response: any = await this.viewObjeSuggestionService.downloadView(ghDocument);
    this.progressSpinnerDialog.close();
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
            this.osId + "_" + date + "_" + time +
            '.' + ghDocument.split('.').pop()

            if (device.osVersion >= "13") {
              docName = docName.replace("ihlms/", "");
            }
          await Filesystem.writeFile({
            path:docName,
            data: "data:" + this.docType + ";base64," + response.imgResponseString,
            directory: Directory.Documents,
          }).then((path: any) => {
            // if (device.osVersion >= "13" && device.platform == "android") {
            this.openFile(path.uri,"data:" + this.docType + ";base64,");
            // }
          })

        
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
          link.download = this.osId+ "_" +date+"_"+time+
          '.' + ghDocument.split('.').pop();
          // link.download = ghDocument.split("\\")[ghDocument.split("\\").length - 1];
            link.click();
          this.checkActiveLanguage()
          this.successToast(this.saveEnMrMSg)
        }
      } else if (response.status == ProjectConstants.responseStatusFailure) {
        if (response.code = ProjectConstants.noAbleToDownloadErCode) {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.fileError,false)
        } else {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg,true)
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

  //progress bar
  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }
  //


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
    if(this.replyCtrl.value!=null){
      const data = {
        'ohRemark': this.replyCtrl.value,
        'fkUsOsid': this.osId,
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
      const response: any = await this.viewObjeSuggestionService.replyObjection(data);
      this.progressSpinnerDialog.close()
      if (response != null && !response.error) {
        this.checkActiveLanguage()
        this.successToast(this.successReplyEnMr)
        this.gotoList()
      } else {
        this.errorToast(response)
      }
    }
   
  }

  async successToast(msg) {
    const toast = await this.toastController.create({
      message:msg,
      icon: "checkmark-circle-outline",
      position: "top",
      cssClass: "toast success-toast",
      duration: 5000,
    });
    toast.present();
  }

  gotoList() {
    this.router.navigate(['/my-objection-suggestion'])
  }


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

  //check langauage
  // checkLan() {
  //   this.lan = this.service.getActiveLang();
  //   if (this.lan == "en") {
  //     return "There was network related or instance related error understanding the request. Please try doing it again."
  //   } else {
  //     return "विनंती समजून घेण्यात नेटवर्कशी संबंधित किंवा उदाहरण संबंधित त्रुटी आली. कृपया ते पुन्हा करण्याचा प्रयत्न करा."
  //   }
  // }


  // checkLanTokenExpire() {
  //   this.lan = this.service.getActiveLang();
  //   if (this.lan == "en") {
  //     return "Security Token is expired, please relogin with DigiLocker"
  //   } else {
  //     return "सुरक्षा टोकन कालबाह्य झाले आहे, कृपया DigiLocker सह पुन्हा लॉगिन करा"
  //   }
  // }
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
        // this.router.navigate([''])
        toast.present();
        setTimeout(() => {
          // localStorage.clear();
          this.progressSpinnerDialog.close();
          this.router.navigate(['my-objection-suggestion'])
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
        // localStorage.clear();
        this.progressSpinnerDialog.close();
        this.router.navigate(['my-objection-suggestion'])
      }, 2000);
    }
  }
  //

  async exceptionErrorToast(msg, isNavigate) {
    const toast = await this.toastController.create({
      message: msg,
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 5000,
    });
    toast.present();
    if(isNavigate){
      setTimeout(() => {
        this.router.navigate(['my-objection-suggestion'])
      }, 2000);
    }
  }

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

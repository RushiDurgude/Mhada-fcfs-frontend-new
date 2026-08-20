import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { DocumentScanner, ResponseType } from 'capacitor-document-scanner';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ProfileService } from 'src/app/profile/profile.service';
import { SharedService } from 'src/app/toolbar/shared.service';
import { AttachmentErrorDialogComponent } from '../../attachment-error-dialog/attachment-error-dialog.component';
import { FaqDialogComponent } from '../../faq-dialog/faq-dialog.component';
import { GrievanceDialogComponent } from '../../grievance-dialog/grievance-dialog.component';
import { GrievanceExistDialogComponent } from '../../grievance-exist-dialog/grievance-exist-dialog.component';
import { Board, GrievanceType, Lottery, ApplicationInterface, PaymentInterface } from '../../interface/common-interface';
import { OtpDialogComponent } from '../../otp-dialog/otp-dialog.component';
import { ProjectConstants } from '../../project-constants';
import { CreateGrievanceService } from './create-grievance.service';

@Component({
  selector: 'app-create-grievance',
  templateUrl: './create-grievance.component.html',
  styleUrls: ['./create-grievance.component.scss'],
})
export class CreateGrievanceComponent implements OnInit {
  protected boards: Board[] = [];
  grievanceTypeId: any
  scrollToTopVisible = false;
  showFAQ: boolean = false;
  FaqLink: String;
  uploadFromEnMr: string = ProjectConstants.uploadFromEn
  galleryEnMr: string = ProjectConstants.galleryEn;
  cameraEnMr: string = ProjectConstants.cameraEn;
  activeLang: string = "";

  noGtypeSelectedBoard = ProjectConstants.nogtypeInSelectedBoardEn
  regExceptionMsg = ProjectConstants.registrationExceptionEnMsg
  tokenExpireMsg = ProjectConstants.tokenExpireMrMsg
  networkErrorMsg = ProjectConstants.networkErrorEnMsg
  public boardCtrl: FormControl = new FormControl();
  public boardFilterCtrl: FormControl = new FormControl();
  public filteredboards: ReplaySubject<Board[]> = new ReplaySubject<Board[]>(1);

  protected grievance: GrievanceType[] = [];
  public grievanceCtrl: FormControl = new FormControl();
  public grievanceFilterCtrl: FormControl = new FormControl();
  public filteredGrievance: ReplaySubject<GrievanceType[]> = new ReplaySubject<GrievanceType[]>(1);

  protected lotteryData: Lottery[] = [];
  public lotteryCtrl: FormControl = new FormControl();
  public lotteryFilterCtrl: FormControl = new FormControl();
  public filteredLottery: ReplaySubject<Lottery[]> = new ReplaySubject<Lottery[]>(1);

  protected applicationData: ApplicationInterface[] = [];
  public applicationCtrl: FormControl = new FormControl();
  public applicationFilterCtrl: FormControl = new FormControl();
  public filteredApplication: ReplaySubject<ApplicationInterface[]> = new ReplaySubject<ApplicationInterface[]>(1);

  protected paymentData: PaymentInterface[] = [];
  public paymentCtrl: FormControl = new FormControl();
  public paymentFilterCtrl: FormControl = new FormControl();
  public filteredPayment: ReplaySubject<PaymentInterface[]> = new ReplaySubject<PaymentInterface[]>(1);

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
  progressSpinnerDialog: any = null;
  lan: any
  protected _onDestroy = new Subject<void>();
  mymodel: any
  platform: string = "";

  firstFormGroup = this._formBuilder.group({
    boardCtrl: ['', [Validators.required]],
    lotteryCtrl: [''],
    applicationCtrl: [''],
    // paymentCtrl: [''],
    grievanceCtrl: ['', [Validators.required]],
    subjectCtrl: ['', [Validators.required]],
    remarkCtrl: ['', [Validators.required]]
  })

  constructor(public _formBuilder: FormBuilder,
    public toastController: ToastController,
    private profileService: ProfileService,
    public dialog: MatDialog,
    public router: Router,
    public actionSheetController: ActionSheetController,
    private sharedService: SharedService,
    public createService: CreateGrievanceService,
  ) { }

  async ngOnInit() {
    localStorage.setItem('lastRoute', this.router.url);
    this.platform = localStorage.getItem("platform");
    this.showFile()
    //call to load board
    this.loadPreData()
   
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  async loadPreData() {
    this.displayProgressSpinner();
    const response: any = await this.createService.loadBoard();
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.length != 0) {
        if (response[0].status == ProjectConstants.responseStatusSuccess) {
          this.boards = response
          //set boards in array  
          this.boardCtrl.setValue(this.boards[10]);
          this.filteredboards.next(this.boards.slice());
          this.boardFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filterboards();
            });
          //
        } else if (response[0].status == ProjectConstants.responseStatusFailure) {
          
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg,true)
        } else {
          this.errorToast(response)
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
    this.filteredboards.next(
      this.boards.filter(board => board.boardName.toLowerCase().indexOf(search) > -1)
    );
  }
  //

  // select board dependant on grievance type
  async selectBoard(boards: any) {
    this.showFAQ = false
    this.displayProgressSpinner();
    const response: any = await this.createService.loadGrievanceTypeAndLottery(boards);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status == ProjectConstants.responseStatusSuccess) {
        this.grievance = response.grievanceTypes;
        if (this.grievance.length != 0) {
          this.grievanceCtrl.setValue(this.grievance[10]);
          this.filteredGrievance.next(this.grievance.slice());
          this.grievanceFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filtereGrievances();
            })
        } else {
          this.grievance = []
          this.grievanceCtrl.setValue(this.grievance[10]);
          this.filteredGrievance.next(this.grievance.slice());
          this.grievanceFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filtereGrievances();
            })
            this.checkActiveLanguage()
          this.exceptionErrorToast(this.noGtypeSelectedBoard,false)
        }
        this.lotteryData = response.lotteryEvents;
        this.lotteryCtrl.setValue(this.lotteryData[10]);
        this.filteredLottery.next(this.lotteryData.slice());
        this.lotteryFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filtereLottery();
          })
      } else if (response.status == ProjectConstants.responseStatusFailure) {
        this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg,true)
      } else {
        this.errorToast(response);
      }
    } else {
      this.errorToast(response);
    }
  }
  //

  //grievance type filter
  protected filtereGrievances() {
    if (!this.grievance) {
      return;
    }
    let search = this.grievanceFilterCtrl.value;
    if (!search) {
      this.filteredGrievance.next(this.grievance.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredGrievance.next(
      this.grievance.filter(grievance => grievance.gtGrievanceType.toLowerCase().indexOf(search) > -1)
    );
  }
  //

  //load application by lottery id
  async selectLottery(lotteryId: any) {
    this.displayProgressSpinner();
    const response: any = await this.createService.loadApplications(lotteryId);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.length != 0) {
        if (response[0].status == ProjectConstants.responseStatusSuccess) {
          this.applicationData = response;
          this.applicationCtrl.setValue(this.applicationData[10]);
          this.filteredApplication.next(this.applicationData.slice());
          this.applicationFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
              this.filtereApplication();
            })
        } else if (response[0].status == ProjectConstants.responseStatusFailure) {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg,true)
        } else {
          this.errorToast(response);
        }
      }
    }
    else {
      this.errorToast(response);
    }
  }
  //

  // load payment by application id
  // async selectApplication(applicationId: any) {
  //   this.displayProgressSpinner();
  //   const response: any = await this.createService.loadPayment(applicationId);
  //   this.progressSpinnerDialog.close();
  //   if (response != null && !response.error) {
  //     if (response.length != 0) {
  //       if (response[0].status == ProjectConstants.responseStatusSuccess) {
  //         this.paymentData = response;
  //         this.paymentCtrl.setValue(this.paymentData[10]);
  //         this.filteredPayment.next(this.paymentData.slice());
  //         this.paymentFilterCtrl.valueChanges
  //           .pipe(takeUntil(this._onDestroy))
  //           .subscribe(() => {
  //             this.filterePayment();
  //           })
  //       } else if (response[0] == ProjectConstants.responseStatusFailure) {
  //         this.exceptionErrorToast()
  //       } else {
  //         this.errorToast(response);
  //       }
  //     }
  //   } else {
  //     this.errorToast(response);
  //   }
  // }
  //


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
      this.lotteryData.filter(lotteryData => lotteryData.lotteryName.toLowerCase().indexOf(search) > -1)
    );
  }
  //

  //application filter
  filtereApplication() {
    if (!this.applicationData) {
      return;
    }
    let search = this.applicationFilterCtrl.value;
    if (!search) {
      this.filteredApplication.next(this.applicationData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredApplication.next(
      this.applicationData.filter(applicationData => applicationData.applicationNo.toLowerCase().indexOf(search) > -1)
    );
  }
  //

  //payment filter
  filterePayment() {
    if (!this.paymentData) {
      return;
    }
    let search = this.paymentFilterCtrl.value;
    if (!search) {
      this.filteredPayment.next(this.paymentData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPayment.next(
      this.paymentData.filter(paymentData => paymentData.paymentAmount.toLowerCase().indexOf(search) > -1)
    );
  }
  //

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

  //submit button
  async submitForm(): Promise<void> {
    if (this.firstFormGroup.valid) {
      const checkDuplicateData = {
        'gtId': this.firstFormGroup.controls['grievanceCtrl'].value,
      }
      this.displayProgressSpinner();
      const responseDuplicate: any = await this.createService.isCheckDeuplicate(checkDuplicateData)
      this.progressSpinnerDialog.close();
      if (responseDuplicate != null && !responseDuplicate.error) {
        if (responseDuplicate.status == ProjectConstants.responseStatusSuccess) {
          if (responseDuplicate.message == ProjectConstants.responseGriExist) {
            const dialogRef = this.dialog.open(GrievanceExistDialogComponent, {
              width: 'fit-content',
              disableClose: true,
            });
            dialogRef.afterClosed().subscribe(async result => {
              var returnval = result;
              if (returnval == ProjectConstants.noMsg) {
                this.router.navigate(['my-grievances'])
              } else {
                this.callRest()
              }
            });
          } else {
            this.callRest()
          }
        } else if (responseDuplicate.status == ProjectConstants.responseStatusFailure) {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg,true)
        } else {
          this.errorToast(responseDuplicate);
        }
      } else {
        this.errorToast(responseDuplicate);
      }
    }
  }
  //

  checkActiveLanguage() {
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
      if (this.activeLang == "en") {
        this.uploadFromEnMr = ProjectConstants.uploadFromEn;
        this.galleryEnMr = ProjectConstants.galleryEn;
        this.cameraEnMr = ProjectConstants.cameraEn;
        this.noGtypeSelectedBoard = ProjectConstants.nogtypeInSelectedBoardEn
        this.regExceptionMsg = ProjectConstants.registrationExceptionEnMsg
        this.networkErrorMsg = ProjectConstants.networkErrorEnMsg
        this.tokenExpireMsg=ProjectConstants.tokenExpireEnMsg
      } else {
        this.uploadFromEnMr = ProjectConstants.uploadFromMr;
        this.galleryEnMr = ProjectConstants.galleryMr;
        this.cameraEnMr = ProjectConstants.cameraMr;
        this.noGtypeSelectedBoard = ProjectConstants.nogtypeInSelectedBoardMr
        this.regExceptionMsg = ProjectConstants.registrationExceptionMrMsg
        this.networkErrorMsg = ProjectConstants.networkErrorMrMsg
        this.tokenExpireMsg=ProjectConstants.tokenExpireMrMsg
      }
    });
  }

  //exception gtype toast
  // async exceptionGtypeErrorToast() {
  //   this.checkActiveLanguage()
  //   const toast = await this.toastController.create({
  //     message: this.noGtypeSelectedBoard,
  //     icon: "information-circle",
  //     position: "top",
  //     cssClass: "toast error-toast",
  //     duration: 5000,
  //   });
  //   toast.present();
  //   setTimeout(() => {
  //   }, 2000);
  // }
  //

  // errortoast against register
  // async exceptionForRegistration() {
  //   this.checkActiveLanguage()
  //   const toast = await this.toastController.create({
  //     message: this.regExceptionMsg,
  //     icon: "information-circle",
  //     position: "top",
  //     cssClass: "toast error-toast",
  //     duration: 5000,
  //   });
  //   toast.present();
  //   setTimeout(() => {
  //     this.router.navigate(['my-grievances'])
  //   }, 2000);
  // }
  //

  //exception toast
  async exceptionErrorToast(msg,isNavigate:boolean) {
    // this.checkActiveLanguage()
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
        this.router.navigate(['my-grievances'])
      }, 2000);
    }
   
  }
  //

  //progress bar function
  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }
  //

  // call to raisegrievance
  async callRest() {
    var lottery
    if (this.firstFormGroup.controls['lotteryCtrl'].value == "") {
      lottery = null
    } else {
      lottery = this.firstFormGroup.controls['lotteryCtrl'].value
    }
    var application
    if (this.firstFormGroup.controls['applicationCtrl'].value == "") {
      application = null
    } else {
      application = this.firstFormGroup.controls['applicationCtrl'].value
    }
    // var payment
    // if (this.firstFormGroup.controls['paymentCtrl'].value == "") {
    //   payment = null
    // } else {
    //   payment = this.firstFormGroup.controls['paymentCtrl'].value
    // }
    if (this.filenm != null) {
      var file1_extension = '.' + this.filenm.split('.')[this.filenm.split('.').length - 1]
    }
    if (this.filenm1 != null) {
      var file2_extension = '.' + this.filenm1.split('.')[this.filenm1.split('.').length - 1]
    }
    if (this.filenm2 != null) {
      var file3_extension = '.' + this.filenm2.split('.')[this.filenm2.split('.').length - 1]
    }
    const data = {
      'fkLotteryid': lottery,
      'fkAppliid': application,
      // 'fkPaymentid': payment,
      'fkBdid': this.firstFormGroup.controls['boardCtrl'].value,
      'fkGtid': this.firstFormGroup.controls['grievanceCtrl'].value,
      'usGriDetails': this.firstFormGroup.controls['remarkCtrl'].value,
      'usGriSubject': this.firstFormGroup.controls['subjectCtrl'].value,
      'file1': this.fileBase64,
      'file1Ext': file1_extension,
      'file2': this.fileBase1_64,
      'file2Ext': file2_extension,
      'file3': this.fileBase2_64,
      'file3Ext': file3_extension,
      'file1Name': this.filenm,
      'file2Name': this.filenm1,
      'file3Name': this.filenm2
    };
    this.displayProgressSpinner();
    const response: any = await this.createService.submitGrievance(data);
    this.progressSpinnerDialog.close();
    if (response != null && !response.error) {
      if (response.status == ProjectConstants.responseStatusSuccess) {
        const dialogRef = this.dialog.open(OtpDialogComponent, {
          width: 'fit-content',
          disableClose: true,
          data: { id: response.pkUsgrid, type: "Grievance" }
        });
        dialogRef.afterClosed().subscribe(async result => {
          if (result == ProjectConstants.dialogCloseYes) {
            const dialogRef = this.dialog.open(GrievanceDialogComponent, {
              width: 'fit-content',
              disableClose: true,
              data: { id: response.pkUsgrid }
            });
            dialogRef.afterClosed().subscribe(result => {
              this.router.navigate(['my-grievances'])
            });
          } else {
            this.router.navigate(['my-grievances'])
          }
        });
      }
      else if (response.status == ProjectConstants.responseStatusFailure) {
        if (response.code == ProjectConstants.registrationExceptionCode) {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.regExceptionMsg,true)
        } else {
          this.checkActiveLanguage()
          this.exceptionErrorToast(this.networkErrorMsg,true)
        }

      } else {
        this.errorToast(response);
      }
    } else {
      this.errorToast(response);
    }
  }
  //

  //check lan 
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
          // localStorage.clear();
          this.progressSpinnerDialog.close();
          this.router.navigate([''])
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
        // localStorage.clear();
        this.progressSpinnerDialog.close();
        this.router.navigate([''])
      }, 2000);
    }
  }
  //

  // checkRegLan() {
  //   this.lan = this.service.getActiveLang();
  //   if (this.lan == "en") {
  //     return "Please complete your registration."
  //   } else {
  //     return "कृपया तुमची नोंदणी पूर्ण करा."
  //   }
  // }

  // checkLan() {
  //   this.lan = this.service.getActiveLang();
  //   if (this.lan == "en") {
  //     return "There was network related or instance related error understanding the request. Please try doing it again."
  //   } else {
  //     return "विनंती समजून घेण्यात नेटवर्कशी संबंधित किंवा उदाहरण संबंधित त्रुटी आली. कृपया ते पुन्हा करण्याचा प्रयत्न करा."
  //   }
  // }

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


  @ViewChild("divToScroll") divToScroll: ElementRef;
  onScroll(event): void {
    if (this.divToScroll.nativeElement.scrollTop > 500) {
      this.scrollToTopVisible = true;
    } else {
      this.scrollToTopVisible = false;
    }
  }


  async getFaqLink(grievanceTypeId: any) {
    const responce = await this.createService.loadFaqLink(grievanceTypeId)
    this.grievanceTypeId = grievanceTypeId;
    this.FaqLink = responce;
    this.showFAQ = true;
  }

  openWindow() {
    const dialogRef = this.dialog.open(FaqDialogComponent, {
      width: 'fit-content',
      disableClose: false,
      data: { id: this.grievanceTypeId }
    });
    // window.open("https://help.helpsite.com/categories/3-customizations,",
    //                               "width=200,height=100");
  }
}




import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { DocumentScanner, ResponseType } from "capacitor-document-scanner";
import { RegistrationStepService } from "../registration-step.service";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { CropImageComponent } from "src/app/question-answer/crop-image/crop-image.component";
import { Subject } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: "app-file-upload-cmp",
    templateUrl: "./file-upload-cmp.component.html",
    styleUrls: ['../registration-step.component.scss']
})
export class FileUploadCmp implements OnInit {
    @Input() uploadFileVisible: boolean = false;
    @Input() isReUploadFileAllowed: boolean = true;
    @Input() selectedImage: string = '';
    fileObj;
    @Input() ocrEntryKey: number;
    @Input() questionCode: string;
    @Input() ocrToBeDone: boolean;
    @Output() evaluateProceedFn = new EventEmitter();
    @Output() setSelectedImage = new EventEmitter<string>();
    @Output() setFileObj = new EventEmitter<File>();
    @Output() setOcrStatus = new EventEmitter<boolean>();
    @Output() setOcrEntryKey = new EventEmitter<number>();
    @Input() ocrFn: Subject<File>;
    reUploadFileVisible: boolean = false;
    ocrStatus: boolean = false;
    errorMessageVisible: boolean = false;
    progressSpinnerDialog: any = null;
    ocrSuccessMessage :string ;
    fileUploadT: boolean = true;

    constructor(
        public actionSheetController: ActionSheetController, private translocoService: TranslocoService,
        private registrationStepService: RegistrationStepService, private dialog: MatDialog,
        private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.ocrFn?.subscribe(v => { 
            this.fileObj = v;
            this.ocr();
        });
    }

    async presentActionSheet() {
        this.uploadFileVisible = true;
        if (
            !window.location.href.toString().startsWith("https://cidcohousing.probitysoftware.in/") &&
            !window.location.href.toString().startsWith("https://uatilms.mhada.gov.in/") &&
            !window.location.href.toString().startsWith("http://localhost:8100/") &&
            !window.location.href.toString().startsWith("https://housing.pmrda.gov.in/")
        ) {
            this.uploadFileVisible = true;
            const actionSheet = await this.actionSheetController.create({
            header: this.translocoService.translate("uploadFrom"),
            cssClass: "my-custom-class",
            buttons: [
                {
                    text: this.translocoService.translate("gallery"),
                    icon: "images",
                    data: "Data value",
                    handler: () => {
                        this.fileUpload();
                    },
                },
                {
                    text: this.translocoService.translate("camera"),
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
            this.uploadFileVisible = true;
            this.fileUpload();
            }, 200);
        }
    }

    fileUpload() {
        document.getElementById("fileupload").click();
    }

    async captureDocImage() {
        const { scannedImages, status } = await DocumentScanner.scanDocument({
          maxNumDocuments: 1,
          responseType: ResponseType.Base64,
        });
        if (status == "success") {
          const base64 = scannedImages[0];
          this.dataURItoBlob(base64);
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
        this.setFileObj.emit(imageFile);
        this.setSelectedImage.emit("data:image/jpeg;base64," + base64Image);
        this.reUploadFileVisible = true;
    }

    async ocr() {
        if(this.ocrToBeDone && this.fileObj) {
            console.log('this.fileObj');
            this.displayProgressSpinner();
            this.registrationStepService.ocr(this.questionCode, this.fileObj)
            .subscribe((data) => {
                this.closeProgressSpinner();
                if(data.status === 'SUCCESS') {
                    if(data.ocrStatus?.toLowerCase() == 'success') {
                        if(data.ocrEntryStatus != null && data.ocrEntryStatus != 'fail') {
                            //this.ocrEntryKey = data.ocrEntryKey;
                            this.setOcrEntryKey.emit(data.ocrEntryKey);
                            this.ocrStatus = true;
                            this.setOcrStatus.emit(true);
                            this.ocrSuccessMessage=data.ocrSuccessMessage;
                        }
                        else {
                            this.registrationStepService.frontendWarningToast(data.octEntryErrorMessage, false);
                        }
                    }
                    else {
                        this.registrationStepService.showErrorMessage(data.octEntryErrorMessage, true);
                    }
                    this.evaluateProceedFn.emit();
                }
                else {
                    this.registrationStepService.showErrorMessage(data.errorMessage, true);
                }
            }, error => {
                console.log(error);
                this.closeProgressSpinner();
                this.registrationStepService.frontendWarningToast("error-network-related-issue", true);
            });
        }
        else {
            this.ocrStatus = true;
            this.setOcrStatus.emit(true);
            this.evaluateProceedFn.emit();
        }
    }

    async handleFileInput(event: any) {
        const files = event.target.files;
        if (files[0].type.split("/")[0] != "image") {
          this.errorMessageVisible = true;
        } else {
          // console.log(files[0]);
          const cropperDialog = this.dialog.open(CropImageComponent, {
            disableClose: true,
            width: "600px",
            height: "90%",
            data: event,
          });
          cropperDialog.afterClosed().subscribe((result) => {
            if (result != "") {
              let data = result.split("data:image/png;base64,");
              this.base64ToBlob(data[1]);
            } else {
              this.reUploadFile();
            }
          });
        }
    }

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
        //this.uploadFileVisible = false;
      
        this.setFileObj.emit(imageFile);
        this.setSelectedImage.emit("data:image/jpeg;base64," + base64Image);
        this.reUploadFileVisible = true;
    }

    reUploadFile() {
        this.fileUploadT = false;
        setTimeout(() => {
            this.fileUploadT = true;
            this.reUploadFileVisible = false;
            this.uploadFileVisible = true;
            this.fileObj = null;
            this.setFileObj.emit(null);
            this.setSelectedImage.emit('');
            this.ocrStatus = false;
            this.ocrSuccessMessage=null;
            this.setOcrStatus.emit(true);
            // this.ocrEntryKey = null;
            this.setOcrEntryKey.emit(null);
            this.evaluateProceedFn.emit();
        }, 100);
    }

    async displayProgressSpinner() {
        this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
            disableClose: true,
            panelClass: "progressSpinner",
        });
      }
    
    async closeProgressSpinner() {
        if(this.progressSpinnerDialog) {
            this.progressSpinnerDialog.close();
        }
    }

    sanitizeUrl(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
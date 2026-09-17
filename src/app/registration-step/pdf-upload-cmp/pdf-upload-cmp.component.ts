import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { DocumentScanner, ResponseType } from "capacitor-document-scanner";
import { RegistrationStepService } from "../registration-step.service";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { CropImageComponent } from "src/app/question-answer/crop-image/crop-image.component";
import * as pdfjsLib from 'pdfjs-dist';
import { DomSanitizer } from "@angular/platform-browser";
import { PDFDocumentProxy } from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.js';

@Component({
    selector: "app-pdf-upload-cmp",
    templateUrl: "./pdf-upload-cmp.component.html",
    styleUrls: ['../registration-step.component.scss']
})
export class PdfUploadCmp implements OnInit {
    @Input() uploadFileVisible: boolean = false;
    @Input() previewImage: string = '';
    fileObj;
    @Input() questionCode: string;
    @Output() evaluateProceedFn = new EventEmitter();
    @Output() setFileObj = new EventEmitter<File>();
    @Output() setPreviewImage = new EventEmitter<string>();
    reUploadFileVisible: boolean = false;
    errorMessageVisible: boolean = false;
    progressSpinnerDialog: any = null;

    constructor(
        public actionSheetController: ActionSheetController, private translocoService: TranslocoService,
        private dialog: MatDialog, private sanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        
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
                }
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

    async handleFileInput(event: any) {
        const files = event.target.files;
        console.log('files[0].type.split("/")[0]', files[0].type.split("/")[0]);
        
        if (files[0].type.split("/")[1] != "pdf") {
          this.errorMessageVisible = true;
        } 
        else {
            this.base64ToBlob(files[0]);
        }
    }

    async base64ToBlob(file: any) {
        this.errorMessageVisible = false;
        
        let fileReader = new FileReader();
        fileReader.onload = async (fileLoadedEvent) => {
            let base64 = fileLoadedEvent.target.result as string;
            base64 = base64.split('base64,')[1];

            const byteString = window.atob(base64);
            const arrayBuffer = new ArrayBuffer(byteString.length);
            const int8Array = new Uint8Array(arrayBuffer);
            for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([int8Array], { type: "application/pdf" });

            let fileName = "ILMS_" + new Date().getTime() + ".pdf";
            const imageFile = new File([blob], fileName, { type: "application/pdf" });
            
            this.setFileObj.emit(imageFile);
            // this.setSelectedPdf.emit("data:application/pdf;base64," + base64);

            const previewImage = await this.generatePdfPreview(blob);
            this.setPreviewImage.emit(previewImage);

            this.reUploadFileVisible = true;
        };
        fileReader.readAsDataURL(file);
    }

    reUploadFile() {
        this.reUploadFileVisible = false;
        this.uploadFileVisible = true;
        this.fileObj = null;
        this.setFileObj.emit(null);
        this.setPreviewImage.emit('');
        this.evaluateProceedFn.emit();
    }

    async generatePdfPreview(pdfBlob: Blob): Promise<string> {
        const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(pdfBlob));
    
        return loadingTask.promise.then((pdf: PDFDocumentProxy) => {
          return pdf.getPage(1).then((page) => {
            const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
    
            canvas.height = viewport.height;
            canvas.width = viewport.width;
    
            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
    
            return page.render(renderContext).promise.then(() => {
              // Convert the canvas to an image (base64)
              return canvas.toDataURL('image/png');
            });
          });
        });
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
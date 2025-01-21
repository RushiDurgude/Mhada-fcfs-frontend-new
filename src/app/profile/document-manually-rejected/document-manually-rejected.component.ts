import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { LoaderComponent } from "src/app/loader/loader.component";
import { QuestionAnswerService } from "src/app/question-answer/question-answer.service";
import { SharedService } from "src/app/toolbar/shared.service";

@Component({
  selector: "app-document-manually-rejected",
  templateUrl: "./document-manually-rejected.component.html",
  styleUrls: ["./document-manually-rejected.component.scss"],
})
export class DocumentManuallyRejectedComponent implements OnInit {
  activeLang: string = "";
  domicileToken: string = "";
  progressSpinnerDialog: any = null;

  constructor(
    public dialogRef: MatDialogRef<DocumentManuallyRejectedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sharedService: SharedService,
    public toastController: ToastController,
    private translocoService: TranslocoService,
    public questionAnswerService: QuestionAnswerService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
    });
  }

  async updateDomicileToken() {
    let domicile = this.data[0];
    for (let i = 0; i < domicile.length; i++) {
      if (domicile[i].qsCode == "Q_DOMICILE") {
        let fileObj = {
          quesId: domicile[i].pkQsid,
          quesCode: domicile[i].qsCode,
          regId: localStorage.getItem("regId"),
          ansOption: "",
          email: "",
          otp: "",
          barcode: this.domicileToken.trim(),
          panNo: "",
          aadharNo: "",
          docuLocation: "",
          mediaType: "image",
          docImage: "",
          ocrString: null,
        };
        this.displayProgressSpinner();
        const response: any = await this.questionAnswerService.updateDomicileApplicationToken(fileObj);
        this.progressSpinnerDialog.close();
        if (response != null && !response.error) {
          if (response.toLowerCase() == "success") {
            this.successToast(this.translocoService.translate("domicile-token-success"));
            this.dialogRef.close("refresh");
          } else {
            this.errorToast(this.translocoService.translate("error-network-related"));
            this.dialogRef.close("refresh");
          }
        } else {
          this.errorToast(response);
          this.dialogRef.close("refresh");
        }
      }
    }
  }

  // TOAST MESSAGES
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

  async frontendWarningToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      icon: "information-circle",
      position: "top",
      cssClass: "toast warning-toast",
      duration: 5000,
    });
    toast.present();
  }

  async backendWarningToast(message: any) {
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
    const toast = await this.toastController.create({
      message: this.translocoService.translate("error-network-related"),
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 5000,
    });
    toast.present();
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  closeEsignDialog() {
    this.dialogRef.close("refresh");
  }
}

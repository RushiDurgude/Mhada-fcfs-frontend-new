import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ExternalApisService } from "../external-apis.service";

@Component({
  selector: "app-success",
  templateUrl: "./success.component.html",
  styleUrls: ["./success.component.scss"],
})
export class SuccessComponent implements OnInit {
  consentAccepted = false;
  pdfSrc: any = "";
  isVisible = false;
  progressSpinnerDialog = null;
  constructor(
    private router: Router,
    private externalApisService: ExternalApisService,
    public toastController: ToastController,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    localStorage.setItem("lastRoute", this.router.url);
    // setTimeout(() => {
    //   this.isVisible = true;
    // }, 1000);
    this.getEaadharFromDigi();
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  async getEaadharFromDigi() {
    let fileObj = {
      regId: localStorage.getItem("regId"),
    };

    this.displayProgressSpinner();
    const response: any = await this.externalApisService.downloadAffidavit(JSON.stringify(fileObj));
    this.progressSpinnerDialog.close();

    // const blob = new File([response], "name.pdf");
    // this.pdfSrc = blob;
    // this.pdfSrc = this._base64ToArrayBuffer(response);
    let file = new Blob([response], { type: "application/pdf" });
    var fileURL = URL.createObjectURL(file);
    this.pdfSrc = fileURL;
    setTimeout(() => {
      this.isVisible = true;
    }, 1000);
    if (response != null && !response.error) {
      if (response.length > 0) {
      } else {
        const toast = await this.toastController.create({
          message: "Cannot read PDF file.",
          icon: "information-circle",
          position: "top",
          cssClass: "toast warning-toast",
          duration: 3000,
        });
        toast.present();
      }
    } else {
      const toast = await this.toastController.create({
        message:
          "There was network related or instance related error understanding the request. Please try doing it again.",
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 2000,
      });
      toast.present();
    }
  }

  _base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

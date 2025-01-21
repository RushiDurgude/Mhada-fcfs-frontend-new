import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Directory, Filesystem } from "@capacitor/filesystem";
import { ToastController } from "@ionic/angular";
import { LoaderComponent } from 'src/app/loader/loader.component';
import { SharedService } from 'src/app/toolbar/shared.service';
import { ProjectConstants } from '../project-constants';

@Component({
  selector: 'app-viewattachment',
  templateUrl: './viewattachment.component.html',
  styleUrls: ['./viewattachment.component.scss'],
})
export class ViewattachmentComponent implements OnInit {
  imageSrc: string = "";
  showImg: boolean = false;
  imageUrl:any;
  pdfSrc: any = "";
  saveEnMrMSg=ProjectConstants.fileDownloadSuccessEn
  activeLang=""
  progressSpinnerDialog: any = null;
  date: Date = new Date();
  constructor(public dialogRef: MatDialogRef<ViewattachmentComponent>,
    public domSanitizer:DomSanitizer,
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private sharedService: SharedService,
    public toastController: ToastController,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.checkActiveLanguage()
    if (this.data[2] == "application/pdf") {
      this.showImg = false
      const byteArray = new Uint8Array(
        atob(this.data[0])
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      let blob = new Blob([byteArray], { type: this.data[2]});
      this.pdfSrc = URL.createObjectURL(blob);
    } else {
      const byteArray = new Uint8Array(
        atob(this.data[0])
          .split("")
          .map((char) => char.charCodeAt(0))
      );
    
      let blob = new Blob([byteArray], { type: this.data[2]});
      this.pdfSrc = URL.createObjectURL(blob);
      this.imageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
      this.showImg = true;
    }

  }

  //download attachement when click on download btn
  async downloadAttach() {
    this.displayProgressSpinner();
    let platform = localStorage.getItem("platform");
        if (platform == "android" || platform == "ios") {
          try {
            let ret = await Filesystem.mkdir({
              path: "ihlms",
              directory: Directory.Documents,
              recursive: false,
            });
          } catch (e) {
            console.log("Folder already exists");
          }
          const date = new Date().toDateString(),
          time = new Date().getTime()
          await Filesystem.writeFile({
              path:
              "ihlms/" +
              this.data[1]+ "_" +date+"_"+time+
              '.' + this.data[3].split('.').pop(),
            data: "data:"+this.data[2]+";base64," +this.data[0],
            directory: Directory.Documents,
          });
          this.checkActiveLanguage()
          this.successToast(this.saveEnMrMSg)
          this.progressSpinnerDialog.close();
        } else {
          const byteArray = new Uint8Array(
            atob(this.data[0])
              .split("")
              .map((char) => char.charCodeAt(0))
          );
          const date = new Date().toDateString(),
          time = new Date().getTime()
          let blob = new Blob([byteArray], { type: this.data[2]});
          var src = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = src;
          link.download = this.data[1]+ "_" +date+"_"+time+
          '.' + this.data[3].split('.').pop();
          link.click();
          this.progressSpinnerDialog.close();
          this.checkActiveLanguage()
          this.successToast(this.saveEnMrMSg)
        }
  }
  //

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
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

  checkActiveLanguage() {
    this.sharedService.name.subscribe((data) => {
      this.activeLang = data;
      if (this.activeLang == "en") {
        this.saveEnMrMSg=ProjectConstants.fileDownloadSuccessEn
    } else {
        this.saveEnMrMSg=ProjectConstants.fileDownloadSuccessMr
     }
    });
  }
}

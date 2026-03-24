import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Device } from '@capacitor/device';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { ModalController, ToastController } from '@ionic/angular';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class ViewPdfComponent implements OnInit {
  base64: string;
  pdfSrc: any;
  documentName: string;
  fileName: string;
  screenWidth: any;
  pdfDownloaded: boolean = false;

  isDarkMode: boolean = false;

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.screenWidth = window.innerWidth;
  }

  // constructor(private themeService : ThemeService, private modalCtrl: ModalController, private toastController: ToastController, 
  //   private dialogRef: MatDialogRef<ViewPdfComponent>, private fileOpener: FileOpener) {
  //   this.screenWidth = window.innerWidth;
  //   this.isDarkMode = themeService.isDarkMode()
  // }

   constructor(private themeService : ThemeService, private modalCtrl: ModalController, private toastController: ToastController, private fileOpener: FileOpener) {
    this.screenWidth = window.innerWidth;
    this.isDarkMode = themeService.isDarkMode()
  }

  ngOnInit(): void { 
    const byteArray = new Uint8Array(
      atob(this.base64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    let blob = new Blob([byteArray], { type: "application/pdf" });
    this.pdfSrc = URL.createObjectURL(blob);
  }

  // async downloadPdf() {
  //   let folder = Directory.Documents;
  //   let device = await Device.getInfo();
  //   if (device.operatingSystem == "android" && device.platform == "android" && device.osVersion >= "11") {
  //     if (device.osVersion >= "13") {
  //       folder = Directory.External;
  //     } else {
  //       folder = Directory.Documents;
  //     }
  //   }

  //   let platform = localStorage.getItem("platform");
  //   if (platform == "android" || platform == "ios") {
  //     if (device.osVersion < "13" || device.platform == "ios") {
  //       try {
  //         let ret = await Filesystem.mkdir({
  //           path: "ihlms",
  //           directory: folder,
  //           recursive: false,
  //         });
  //         console.log("folder ", ret);
  //       } catch (e) {
  //         console.log("Folder already exists");
  //       }
  //     }

  //     await Filesystem.writeFile({
  //       path: (device.osVersion >= "13" ? "" : "ihlms/") +this.fileName ,
  //       data: "data:application/pdf;base64," + this.base64,
  //       directory: folder,
  //     }).then((path: any) => {
  //       this.openFile(path.uri);
  //     });;

  //     this.pdfDownloaded = true;
  //    // this.dialogRef.close("downloaded");
  //    this.modalCtrl.dismiss("downloaded", "success");
  //   } else {
  //     window.open(this.pdfSrc, "_blank");
  //   }
  // }


  async downloadPdf() {
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
        await Filesystem.mkdir({
          path: "ihlms",
          directory: folder,
          recursive: false,
        });
      } catch (e) {
        console.log("Folder already exists");
      }
    }

    await Filesystem.writeFile({
      path: (device.osVersion >= "13" ? "" : "ihlms/") + this.fileName,
      data: "data:application/pdf;base64," + this.base64,
      directory: folder,
    }).then((path: any) => {
      this.openFile(path.uri);
    });

    this.pdfDownloaded = true;

   
    this.modalCtrl.dismiss("downloaded", "success");

  } else {
    window.open(this.pdfSrc, "_blank");
  }
}
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async openFile(path: string) {
    try {
      this.fileOpener
        .open(path, "application/pdf")
        .then(() => console.log("File is opened"))
        .catch((e) => console.log("Error opening file"));
    } catch (error) {
      console.log("open file error : ");
    }
  }
}

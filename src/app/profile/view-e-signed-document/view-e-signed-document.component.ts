import { DatePipe } from "@angular/common";
import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { ToastController } from "@ionic/angular";
import { Device } from "@capacitor/device";
import { FileOpener } from "@ionic-native/file-opener/ngx";
@Component({
  selector: "app-view-e-signed-document",
  templateUrl: "./view-e-signed-document.component.html",
  styleUrls: ["./view-e-signed-document.component.scss"],
  providers: [DatePipe],
})
export class ViewESignedDocumentComponent implements OnInit {
  pdfSrc: any = "";
  screenWidth: any;
  pdfDownloaded: boolean = false;
  date: Date = new Date();
  constructor(
    public toastController: ToastController,
    public dialogRef: MatDialogRef<ViewESignedDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public base64: any,
    public datepipe: DatePipe,
    private fileOpener: FileOpener
  ) {
    this.screenWidth = window.innerWidth;
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.screenWidth = window.innerWidth;
  }

  ngOnInit() {
    // convert base64 to blob
    const byteArray = new Uint8Array(
      atob(this.base64[0])
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    let blob = new Blob([byteArray], { type: "application/pdf" });
    this.pdfSrc = URL.createObjectURL(blob);
  }

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
          let ret = await Filesystem.mkdir({
            path: "ihlms",
            directory: folder,
            recursive: false,
          });
          console.log("folder ", ret);
        } catch (e) {
          console.log("Folder already exists");
        }
      }

      let docName =
        "ihlms/" +
        this.base64[1] +
        "_self_declaration_" +
        this.datepipe.transform(this.date, "yyyyMMdd_HHmmss") +
        ".pdf";

      if (device.osVersion >= "13") {
        docName = docName.replace("ihlms/", "");
      }
      await Filesystem.writeFile({
        // path: "eSign.pdf",
        path: docName,
        data: "data:application/pdf;base64," + this.base64[0],
        directory: folder,
        // encoding: Encoding.UTF8,
        // recursive: true,
      }).then((path: any) => {
        // if (device.osVersion >= "13" && device.platform == "android") {
        this.openFile(path.uri);
        // }
      });
      this.pdfDownloaded = true;
      this.dialogRef.close("downloaded");
    } else {
      window.open(this.pdfSrc, "_blank");
    }
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

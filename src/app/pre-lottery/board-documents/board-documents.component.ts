import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import {
  api_url,
  PreLotteryApplicationService,
} from "../services/pre-lottery-application.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { BoardDocumentModel } from "../models/board-document-model";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ToastController } from "@ionic/angular";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { SharedService } from "src/app/toolbar/shared.service";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { Device } from "@capacitor/device";

@Component({
  selector: "app-board-documents",
  templateUrl: "./board-documents.component.html",
  styleUrls: ["../pre-lottery.component.scss"],
})
export class BoardDocumentsComponent implements OnInit {
  boardDocuments: BoardDocumentModel[] = [];
  api_url: string = "";
  loaded: boolean = false;
  progressSpinnerDialog: any = null;
  boardKey: number;
  lang: string;
  index: number = 0;
  mode: string;
  pdfSrc;
  sanitizedUrl: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private dialog: MatDialog,
    private router: Router,
    private translocoService: TranslocoService,
    private sanitizer: DomSanitizer,
    private toastController: ToastController,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<BoardDocumentsComponent>,
    private fileOpener: FileOpener
  ) {
    this.api_url = api_url;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.boardKey = +params["boardKey"];
      this.mode = params["mode"];

      if (this.boardKey) {
        this.loadData();
      }
    });
    this.lang = this.translocoService.getActiveLang();

    this.sharedService.name.subscribe((lang) => {
      console.log("lang subs called" + lang);
      if (lang !== this.lang) {
        this.lang = lang;
        this.init();
      }
    });
  }

  init() {
    if (this.boardDocuments[this.index].fileType === "PDF") {
      console.log("init called for pdf");
      this.pdfSrc = this.pdfSrcUrl(
        this.lang === "en"
          ? this.boardDocuments[this.index].urlEn
          : this.boardDocuments[this.index].urlMr
      );
    } else {
      console.log("init called for html");
      this.sanitizedUrl = this.sanitize(
        this.lang === "en"
          ? this.boardDocuments[this.index].urlEn
          : this.boardDocuments[this.index].urlMr
      );
    }
  }

  loadData() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
      .fetchBoardDocumentsForBoard(this.boardKey)
      .subscribe(
        async (data) => {
          console.log(data);
          this.progressSpinnerDialog.close();
          if (data.status === "SUCCESS") {
            this.boardDocuments = data.boardDocuments;
            console.log(" this.boardDocuments", this.boardDocuments);

            this.loaded = true;
            this.init();
          } else {
            this.preLotteryApplicationService.showErrorToast(data.errorMessage);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  proceedToLottery() {
    if (this.index < this.boardDocuments.length - 1) {
      this.index++;
      this.init();
    } else {
      if (this.mode && this.mode === "VIEW") {
        this.router.navigate(
          ["/app", "select-lottery", this.boardKey, this.mode],
          { replaceUrl: true }
        );
      } else {
        this.router.navigate(
          ["/app", "select-lottery", this.boardKey],
          { replaceUrl: true }
        );
      }
    }
  }

  pdfSrcUrl(base64) {
    console.log("for src - " + base64);
    const byteArray = new Uint8Array(
      atob(base64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    let blob = new Blob([byteArray], { type: "application/pdf" });
    return URL.createObjectURL(blob);
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async downloadPdf() {
    let folder = Directory.Documents;
    let device = await Device.getInfo();
    if (
      device.operatingSystem == "android" &&
      device.platform == "android" &&
      device.osVersion >= "11"
    ) {
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

      await Filesystem.writeFile({
        path:
          (device.osVersion >= "13" ? "" : "ihlms/") +
          this.boardDocuments[this.index].headerLabelEn +
          ".pdf",
        data:
          "data:application/pdf;base64," + this.lang === "en"
            ? this.boardDocuments[this.index].urlEn
            : this.boardDocuments[this.index].urlMr,
        directory: folder,
      }).then((path: any) => {
        this.openFile(path.uri);
      });

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

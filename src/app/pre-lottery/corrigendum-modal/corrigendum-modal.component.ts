import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { ModalController, ToastController } from "@ionic/angular";
import { LoaderComponent } from "src/app/loader/loader.component";
import { Page } from "../models/Page";
import { RegistrationLOIModel } from "../models/RegistrationLOIModel";
import { PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { CorrigendumRequestModal } from "../models/CorrigendumRequestModel";
import { Device } from "@capacitor/device";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-letter-of-intimation",
  templateUrl: "./corrigendum-modal.component.html",
  styleUrls: [
    "../pre-lottery.component.scss",
    "./corrigendum-modal.component.scss",
  ],
})
export class CorrigendumModalComponent implements AfterViewInit {
  page: Page<CorrigendumRequestModal>;
  registrationLetterKey: number;
  isLoading: boolean;
  loiCounter: number;
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<CorrigendumRequestModal> =
    new MatTableDataSource();
  displayedColumns: string[] = ["key", "corrigendumName", "action"];
  pageSizeOptions: number[] = [10, 25, 100];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(
    private dialog: MatDialog,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private dialogRef: MatDialogRef<CorrigendumModalComponent>,
    private fileOpener: FileOpener,
    public datepipe: DatePipe
  ) {}
  ngAfterViewInit(): void {
    console.log(this.page);
    this.dataSource = new MatTableDataSource(this.page?.content);
    setTimeout(() => {
      this.dataLoaded = true;
      this.paginator.pageIndex = this.currentPage;
      this.paginator.length = this.page?.totalElements;
    });
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.onLoad();
  }

  async onLoad() {
    this.preLotteryApplicationService
      .downloadCorrigendum(this.currentPage, this.pageSize)
      .subscribe(
        async (data) => {
          this.page = data;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          if (this.loiCounter < 1) {
            this.loiCounter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(
                error,
                "error-Letter-of-intimation-list-load"
              )
              .then((num) => {
                //new error message
                this.onLoad();
              });
          }
        }
      );
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  downloadImage(base64: string) {
    const fileExtension = "jpg"; // Assuming the image is always in JPEG format
    const fileName =
      "Image_" +
      this.datepipe.transform(new Date(), "yyyyMMdd_HHmmss") +
      `.${fileExtension}`;
    const base64ImgData = base64.split(",")[1] || base64;

    const byteArray = new Uint8Array(
      atob(base64ImgData)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    const blob = new Blob([byteArray], { type: "image/jpeg" });

    // Create a link element and trigger a download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  async downloadPdf(base64, pdfSrc) {
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
    // console.log(platform, "00-0-0-0-0-0-0-0-0-0-0");
    if (platform == "android" || platform == "ios") {
      if (device.osVersion < "13" || device.platform == "ios") {
        try {
          let ret = await Filesystem.mkdir({
            path: "ihlms",
            directory: folder,
            recursive: false,
          });
          // console.log("folder ", ret);
        } catch (e) {
          console.log("Folder already exists");
        }
      }

      const fileExtension = base64.startsWith("data:application/pdf")
        ? "pdf"
        : "jpg"; // Adjust accordingly
      const fileName =
        "Corrigendum_" +
        this.datepipe.transform(new Date(), "yyyyMMdd_HHmmss") +
        `.${fileExtension}`;

      await Filesystem.writeFile({
        path: (device.osVersion >= "13" ? "" : "ihlms/") + fileName,
        data: `data:${
          base64.startsWith("data:application/pdf")
            ? "application/pdf"
            : "image/jpeg"
        };base64,${base64}`,
        directory: folder,
      }).then((path: any) => {
        this.openFile(path.uri);
        // console.log("where is data ?????");
      });
      // window.open(pdfSrc, "_blank");

      this.dialogRef.close("downloaded");
    } else {
      // console.log("test");
      window.open(pdfSrc, "_blank");
    }
  }

  downloadCorrigendum(key: number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchCorrigendumPdfs(key).subscribe(
      async ({ status, data, errorMessage }) => {
        this.loiCounter = 0;
        if (status === "SUCCESS") {
          const base64Data = data.split(",")[1] || data;
          // console.log("+++++++++++++++++++++++", base64Data);

          this.progressSpinnerDialog.close();
          const byteArray = new Uint8Array(
            atob(base64Data)
              .split("")
              .map((char) => char.charCodeAt(0))
          );
          let blob = new Blob([byteArray]);
          if (data.startsWith("data:application/pdf")) {
            // PDF file
            blob = new Blob([byteArray], { type: "application/pdf" });
            let pdfSrc = URL.createObjectURL(blob);
            // console.log("prooooooooooo");

            this.downloadPdf(data, pdfSrc);
          } else if (data.startsWith("data:image/jpeg")) {
            // blob = new Blob([byteArray], { type: "image/jpeg" });
            // console.log("kiran varekarrderrrr");

            this.downloadImage(data);
          }
        } else {
          this.progressSpinnerDialog.close();
          const toast = await this.toastController.create({
            message: errorMessage,
            icon: "information-circle",
            position: "top",
            cssClass: "toast error-toast",
            duration: 4000,
          });
          toast.present();
        }
      },
      (error) => {
        this.progressSpinnerDialog.close();
        if (this.loiCounter < 1) {
          this.loiCounter++;
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-unable-fetch-file")
            .then((num) => {
              this.downloadCorrigendum(key);
            });
        }
      }
    );
  }

  async openFile(path: string) {
    try {
      this.fileOpener
        .open(path, "application/pdf")
        .then(() => console.log("File is opened"))
        .catch((e) => console.log("Error opening file", e));
    } catch (error) {
      console.log(error);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, "cancel");
  }
}

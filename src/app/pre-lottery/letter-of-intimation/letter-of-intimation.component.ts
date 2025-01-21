import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ModalController, ToastController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { Page } from '../models/Page';
import { RegistrationLOIModel } from '../models/RegistrationLOIModel';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';
import { Device } from '@capacitor/device';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-letter-of-intimation',
  templateUrl: './letter-of-intimation.component.html',
  styleUrls: ['../pre-lottery.component.scss', './letter-of-intimation.component.scss']
})
export class LetterOfIntimationComponent implements AfterViewInit {
  page: Page<RegistrationLOIModel>;
  registrationLetterKey: number;
  isLoading: boolean;
  loiCounter: number;
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<RegistrationLOIModel> = new MatTableDataSource();
  displayedColumns: string[] = [
    "key",
    "lottery",
    "action",  
  ];
  pageSizeOptions: number[] = [10, 25, 100];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;

  constructor(private dialog: MatDialog, private modalCtrl: ModalController,  private toastController: ToastController, 
    private preLotteryApplicationService: PreLotteryApplicationService, 
    private dialogRef: MatDialogRef<LetterOfIntimationComponent>, private fileOpener: FileOpener) { }
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
  
  async onLoad(){
    this.preLotteryApplicationService.fetchLOIs(
      this.currentPage, this.pageSize).subscribe(async (data) => {
      this.page = data;
      this.isLoading = false;
    },
    (error) => {
        console.log(error);
        this.isLoading = false;
        if(this.loiCounter < 1) {
          this.loiCounter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
          "error-Letter-of-intimation-list-load").then(num => {//new error message
            this.onLoad();
          });
        }
    });
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  async downloadPdf(fileName, base64, pdfSrc) {
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
    console.log('platform', platform);
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
        path: (device.osVersion >= "13" ? "" : "ihlms/") +fileName ,
        data: "data:application/pdf;base64," + base64,
        directory: folder,
      }).then((path: any) => {
        this.openFile(path.uri);
      });
      
      this.dialogRef.close("downloaded");
    } else {
      window.open(pdfSrc, "_blank");
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

  downloadLOI(key: number) {
    this.displayProgressSpinner();
    console.log(key);
    this.preLotteryApplicationService
    .fetchApplicationLoi(key)
    .subscribe(async ({status, data, errorMessage}) => {
      this.loiCounter = 0;
      if(status === 'SUCCESS') {
        this.progressSpinnerDialog.close();
        const byteArray = new Uint8Array(
          atob(data)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        let blob = new Blob([byteArray], { type: "application/pdf" });
        let pdfSrc = URL.createObjectURL(blob);

        let lotteryCode = this.page.content.find(rl => rl.registrationLetterKey === key)?.lotteryCode;

        this.downloadPdf("LOI_"+lotteryCode+"_"+new Date().getTime()+".pdf", data, pdfSrc);        
      }
      else {
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
    }, error => {
      this.progressSpinnerDialog.close();
      if(this.loiCounter < 1) {
        this.loiCounter++;
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
        "error-unable-fetch-file").then(num => {
          this.downloadLOI(key);
        });
      }
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}

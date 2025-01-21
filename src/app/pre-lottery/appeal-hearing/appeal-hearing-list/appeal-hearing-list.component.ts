import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PreLotteryApplicationService } from "../../services/pre-lottery-application.service";
import { ApplicationListItemModel } from "../../models/application-list-item.model";
import { IonModal, ModalController, ToastController } from "@ionic/angular";
import { FilterListComponent } from "../../filter-list/filter-list.component";
import { MatDialog } from "@angular/material/dialog";
import { LoaderComponent } from "src/app/loader/loader.component";
import { TranslocoService } from "@ngneat/transloco";
// import {MatIconModule} from '@angular/material/icon';
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Page } from "src/app/pre-lottery/models/Page";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { LetterOfIntimationComponent } from "../../letter-of-intimation/letter-of-intimation.component";
import { TimelineDataModel } from "../../models/timeline-data.model";
import { PostLotteryApplicationListItemModel } from "../../models/post-lottery-application-list";
import { ViewPdfComponent } from "../../view-pdf/view-pdf.component";
import { ApplicationNocListModel } from "../../models/application-noc-list-model";
import { NocListWrapper } from "../../models/noc-list-wrapper";
import { AppealApplicationFormModel } from "../../models/appeal-application-form.model";

@Component({
  selector: "app-appeal-hearing-list",
  templateUrl: "./appeal-hearing-list.component.html",
  styleUrls: [
    "../../pre-lottery.component.scss",
    "./appeal-hearing-list.component.scss",
  ],
})
export class AppealHearingListComponent implements OnInit {
  applicationList: ApplicationListItemModel[] = [];
  dataLoaded: boolean = false;
  dataFiltered: boolean = true;
  progressSpinnerDialog: any = null;
  counter: number = 0;
  loiCounter: number = 0;
  isSearchDisabled: boolean = false;
  isLoading = false;
  page: Page<AppealApplicationFormModel>;
  filterForm: FormGroup = new FormGroup({});
  timelineData: TimelineDataModel[];
  pageMode: string;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;

  dataSource: MatTableDataSource<AppealApplicationFormModel> =
    new MatTableDataSource();
  displayedColumns: string[] = [
    "id",
    "applicationNo",
    // "applicationEmdPaymentStatus",
    "applicantName",
    "appealType",
    "appealHearingStatus",
    "appealDate",
    "action",
    // "applicationDrawStatus",
    // "sanctionLetter",
  ];

  selectedTab: number = 0;

  pageSizeOptions: number[] = [10, 25, 100];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;

  allowedForApply: boolean = false;
  isAllowedForSurrenderAll: boolean = false;
  receiptCounter: number = 0;
  polCounter: number = 0;
  applicationKey: number;
  applicationNo: string;
  applicantName: string;
  appealType: string;
  appealDate: string;

  additionalDocument: string;
  appealLetter: string;
  appealHearingStatus: string;
  remark: string;
  selectedFile: File;
  selectedFile1: File;
  demoFile1: string;
  remark1: string;
  demoFile2: string;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController,
    private dialog: MatDialog,
    private toastController: ToastController,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.applicationKey = +params["applicationKey"];
      this.appealType = params["appealType"];

      console.log("hfshdddddd for View Details", this.appealType);
    });

    this.onLoad(this.appealType, this.applicationKey);
  }

  onLoad(appealType: string, applicationKey: number) {
    this.isLoading = true;
    this.preLotteryApplicationService
      .fetchappealdtlList(
        appealType,
        applicationKey,
        this.currentPage,
        this.pageSize,
        this.filterForm.value.filterText
      )
      .subscribe(
        (data) => {
          // if (data.content[0].status === "SUCCESS") {
          console.log("on load Data", data.content);
          this.dataSource = new MatTableDataSource(data.content);
          // this.page = data.page;

          // setTimeout(() => {
          //   this.paginator.pageIndex = this.currentPage;
          //   this.paginator.length = this.page.totalElements;
          //   console.log("page", this.currentPage);
          // });
          this.isSearchDisabled = false;
          this.isLoading = false;
          this.dataLoaded = true;
          // } else {
          //   // this.showErrorToast(data.errorMessage);
          // }
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.isSearchDisabled = false;
          if (this.counter < 1) {
            this.counter++;
            this.preLotteryApplicationService
              .checkErrorForExpiredToken(error, "error-application-noc-load")
              .then((num) => {
                this.onLoad(appealType, applicationKey);
              });
          }
        }
      );
  }
  viewClassForAppealStatus(appealHearingStatus: string) {
    if (appealHearingStatus === "PENDING") {
      return "bg-blue-400";
    } else if (appealHearingStatus === "APPROVED") {
      return "bg-green-400";
    } else if (appealHearingStatus === "REJECTED") {
      return "bg-pink-500";
    } else if (appealHearingStatus === "Allowed_For_Hearing") {
      return "bg-pink-500";
    } else {
      return "";
    }
  }
  viewAppealForm(applicationKey: number) {
    console.log("this.applicationKey rushi aahe ka" + this.applicationKey);

    this.preLotteryApplicationService
      .fetchapplicantdtl(this.applicationKey, this.appealType)
      .subscribe((data) => {
        console.log("API status************", data);
        if (data.status === "SUCCESS") {
          this.applicationNo = data.applicationNo;
          this.applicantName = data.applicantName;
          this.appealType = data.appealType;
          this.applicationKey = data.applicationKey;
          this.appealHearingStatus = data.appealHearingStatus;
          console.log("this.appealHearingStatus", this.appealHearingStatus);
          this.remark1 = data.remark;
          this.demoFile1 = data.appealLetterFile;
          console.log("this.demoFile1", this.demoFile1);
          this.demoFile2 = data.additionalDocumentFile;
          console.log("this.demoFile2", this.demoFile2);

          console.log("ahe ka re aba", this.applicationNo);
          this.router.navigate([
            "/pre-lottery",
            "appeal-hearing",
            "applicant-hearing-view",
            this.applicationKey,
            this.appealType,
          ]);
        }
      });
  }

  async showErrorToast(errorMessage: string) {
    const toast = await this.toastController.create({
      message: errorMessage,
      icon: "information-circle",
      position: "top",
      cssClass: "toast error-toast",
      duration: 4000,
    });
    toast.present();
    this.isLoading = false;
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

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

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.onLoad(applicationKey);
  }
}

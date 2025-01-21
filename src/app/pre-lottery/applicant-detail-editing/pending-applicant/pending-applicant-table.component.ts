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
import { ApplicantPendingDetailModel } from "../../models/ApplicantPendingDetailModel";
import { ApplicantEditingDetailModel } from "../../models/ApplicantEditingDetailModel";

@Component({
  selector: "app-noc-list",
  templateUrl: "./pending-applicant-table.component.html",
  styleUrls: [
    "../../pre-lottery.component.scss",
    "./pending-applicant-table.component.scss",
  ],
})
export class PendingApplicantComponent implements OnInit {
  applicationList: ApplicationListItemModel[] = [];
  dataLoaded: boolean = false;
  dataFiltered: boolean = true;
  progressSpinnerDialog: any = null;
  counter: number = 0;
  loiCounter: number = 0;
  isSearchDisabled: boolean = false;
  isLoading = false;
  page: Page<ApplicantPendingDetailModel>;
  filterForm: FormGroup = new FormGroup({});
  timelineData: TimelineDataModel[];
  pageMode: string;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;

  dataSource: MatTableDataSource<ApplicantEditingDetailModel> =
    new MatTableDataSource();
  displayedColumns: string[] = [
    "id",
    "applicationNo",
    // "applicationEmdPaymentStatus",
    // "selectedType",
    // "selectedFileName",
    "status",
    "createdDate",
    "selectedType",
    // "applicationDrawStatus",
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
  applicationNo: number;
  nocStatus: string;
  nocPaymentStaus: string;

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
      // this.displayProgressSpinner();

      this.applicationNo = +params["applicationKey"];
      //   console.log("this.applicationKey  ahe ka????", this.applicationNo);
    });
    this.onLoad();
  }

  formatDate(dateString: string): string {
    const dateParts = dateString.split("_").map(Number);
    if (dateParts.length === 6) {
      const date = new Date(
        dateParts[2],
        dateParts[1] - 1,
        dateParts[0],
        dateParts[3],
        dateParts[4],
        dateParts[5]
      );
      return (
        date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
        " " +
        date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      );
    } else {
      return "";
    }
  }

  onLoad() {
    this.isLoading = true;
    this.preLotteryApplicationService
      .fetchPendingDetailsLists(
        this.currentPage,
        this.pageSize,
        this.applicationNo
        // this.filterForm.value.filterText
      )
      .subscribe(
        (data) => {
          // if (data.status === "SUCCESS") {
          // console.log("on load Data", data.content[0].selectedType);
          this.dataSource = new MatTableDataSource(data.content);
          // this.page = data.pageable;

          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            // this.paginator.length = this.page.totalElements;
            console.log("page", this.currentPage);
          });
          this.isSearchDisabled = false;
          this.isLoading = false;
          this.dataLoaded = true;
          // } else {
          //   this.showErrorToast("Data Failed to Fetch");
          // }
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
          this.isSearchDisabled = false;
          if (this.counter < 1) {
            this.counter++;
            // this.preLotteryApplicationService
            //   .checkErrorForExpiredToken(error, "error-application-noc-load")
            //   .then((num) => {
            //     this.onLoad();
            //   });
          }
        }
      );
  }

  editApplicantDetail() {
    const selectedType = this.dataSource.data[0].selectedType;
    const applicationNo = this.dataSource.data[0].applicationNo;
    this.router.navigate(["/app/applicant-detail-editing"], {
      queryParams: {
        applicationNo: applicationNo,
        selectedType: selectedType,
      },
    });
  }

  hasPendingSelectedType(data: ApplicantEditingDetailModel[]): boolean {
    return data.some((item) => item.selectedType === "PENDING");
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

  viewClassForStatus(selectedType: string) {
    if (selectedType === "PENDING") {
      return "bg-blue-400";
    } else if (selectedType === "APPROVED") {
      return "bg-green-400";
    } else if (selectedType === "REJECTED") {
      return "bg-pink-500";
    } else {
      return "";
    }
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.onLoad();
  }
}

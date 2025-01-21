import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { ApplicationListItemModel } from "../models/application-list-item.model";
import {
  AlertController,
  IonModal,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { FilterListComponent } from "../filter-list/filter-list.component";
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
import { LetterOfIntimationComponent } from "../letter-of-intimation/letter-of-intimation.component";
import { TimelineDataModel } from "../models/timeline-data.model";
import { PostLotteryApplicationListItemModel } from "../models/post-lottery-application-list";
import { ViewPdfComponent } from "../view-pdf/view-pdf.component";
import { CorrigendumModalComponent } from "../corrigendum-modal/corrigendum-modal.component";
import { MatRadioChange, MatRadioModule } from "@angular/material/radio";

@Component({
  selector: "app-application-detail-list",
  templateUrl: "./applicant-editing.component.html",
  styleUrls: [
    "../pre-lottery.component.scss",
    "./applicant-editing.component.scss",
  ],
})
export class ApplicantDetailComponent implements OnInit {
  isSearchDisabled: boolean = false;
  isLoading = false;
  page: Page<ApplicationListItemModel>;
  filterForm: FormGroup = new FormGroup({});
  timelineData: TimelineDataModel[];
  form: FormGroup = new FormGroup({});
  applicationKey: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("paginator") paginator: MatPaginator;

  dataSource: MatTableDataSource<ApplicationListItemModel> =
    new MatTableDataSource();

  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild("paginator1") paginator1: MatPaginator;
  dataSourcePostLottery: MatTableDataSource<PostLotteryApplicationListItemModel> =
    new MatTableDataSource();

  selectedTab: number = 0;

  pageSizeOptions: number[] = [10, 25, 100];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;

  pageSizeOptions1: number[] = [10, 25, 100];
  totalRows1 = 0;
  pageSize1 = 10;
  currentPage1 = 0;
  selectedChild: string = "Photo";
  selectedOption: string = "";
  selectedType: any;
  status: string;
  constructor(
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController,
    private dialog: MatDialog,
    private toastController: ToastController,
    private router: Router,
    private alertController: AlertController,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.selectedTab = 0;
      this.applicationKey = +params["applicationNo"];
      this.selectedType = params["selectedType"];
      this.status = params["status"];

      // console.log(" this.status", this.status);

      if (params["post"]) {
        this.selectedTab = 1;
      }
    });

    this.filterForm = new FormGroup({
      filterText: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });

    if (
      (this.selectedType === "APPROVED" && this.status === "Marital Status") ||
      (this.selectedType === "REJECTED" && this.status === "Marital Status")
    ) {
      this.selectedChild = "Marital Status";
    } else if (this.selectedType === "APPROVED" && this.status === "Photo") {
      this.selectedChild = "Marital Status";
    } else if (this.selectedType === "REJECTED" && this.status === "Photo") {
      this.selectedChild = "Marital Status";
    } else {
      this.selectedChild = "Photo";
    }
    // this.onLoad();
  }

  toggleChild(event: MatRadioChange) {
    // console.log("Selected Child:", event);
    this.selectedChild = event.value;
  }

  onSearch() {
    if (this.filterForm.valid) {
      this.currentPage = 0;
      this.currentPage1 = 0;
      //   this.onLoad();
    } else {
      this._snackBar.open(
        "Please enter Filter text (minimum - 3 char) for Application",
        "Close",
        {
          horizontalPosition: "right",
          verticalPosition: "top",
          panelClass: "warning-toast1",
          duration: 3 * 1000,
        }
      );
      this.isSearchDisabled = false;
    }
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
  }
  resetFilter() {
    this.filterForm.controls["filterText"].setValue(null);
    this.currentPage = 0;
    this.currentPage1 = 0;
    // this.onLoad();
  }
  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterListComponent,
      componentProps: {
        timelineData: [],
      },
    });
    modal.present();
  }

  //   async displayProgressSpinner() {
  //     this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
  //       disableClose: true,
  //       panelClass: "progressSpinner",
  //     });
  //   }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    // this.onLoad();
  }

  pageChanged1(event: PageEvent) {
    console.log({ event });
    this.pageSize1 = event.pageSize;
    this.currentPage1 = event.pageIndex;
    // this.onLoad();
  }
}

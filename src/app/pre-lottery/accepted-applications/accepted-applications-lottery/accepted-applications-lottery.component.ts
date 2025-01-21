import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PreLotteryApplicationService } from '../../services/pre-lottery-application.service';
import { ModalController, ToastController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { TranslocoService } from '@ngneat/transloco';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { LotteryResponseModel } from "../../models/LotteryResponseModel";
import { Page } from '../../models/Page';
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ViewPdfComponent } from '../../view-pdf/view-pdf.component';



@Component({
  selector: 'app-accepted-applications-lottery',
  templateUrl: './accepted-applications-lottery.component.html',
  styleUrls: ['./accepted-applications-lottery.component.scss']
})
export class AcceptedApplicationsComponent implements OnInit {
  dataLoaded: boolean = false;
  progressSpinnerDialog: any = null;
  type: string;
  
  dataSource: MatTableDataSource<LotteryResponseModel> = new MatTableDataSource();
  page: Page<LotteryResponseModel>;
  pageSizeOptions: number[] = [10, 25, 100];
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  filterForm: FormGroup = new FormGroup({});
  isSearchDisabled: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    "id",
    "lotteryCode",
    "lotteryName",
    "lotteryBoard",
    "status",
    "action"
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController, private dialog: MatDialog, 
    private toastController: ToastController, private translocoService: TranslocoService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.filterForm = new FormGroup({
      filterText: new FormControl(null, [Validators.required, Validators.minLength(3)])
    });

    this.loadData();
  }

  resetFilter() {
    this.filterForm.controls['filterText'].setValue(null);
    this.loadData();
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData();
  }

  onSearch() {
    if (this.filterForm.valid) {
      console.log("onSearch");
      console.log(this.filterForm.valid);
      this.loadData();
    }
    else {
      this._snackBar.open("Please enter Filter text (minimum - 3 char) for Lottery", "Close", {
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: "warning-toast1",
        duration: 3 * 1000,
      });
      this.isSearchDisabled = false;
    }
  }
  
  loadData() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchLotteryListForAcceptedApplications(this.currentPage, this.pageSize, this.filterForm.value.filterText).subscribe((page) => {
      console.log('Lottery Call');
      console.log(page.content);
      this.page = page;
      this.dataSource = new MatTableDataSource(page.content);
      this.progressSpinnerDialog.close();
      setTimeout(() => {
        console.log(this.paginator);
        this.paginator.pageIndex = this.currentPage;
        this.paginator.length = page.totalElements;
        this.progressSpinnerDialog.close();
      });

    }, async error => {
      this.progressSpinnerDialog.close();
      const toast = await this.toastController.create({
        message: this.translocoService.translate("error-accepted-list"),//Unable to fetch Lotter list for published draft list
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 4000,
      });
      toast.present();
    });
  }

  viewLottery(lotteryKey : number){
    console.log(lotteryKey);
    console.log('LOttery View Call');
    this.router.navigate(['/app', 'accepted-applications', 'accepted-applications-scheme', lotteryKey]);
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  showAcceptedApplicationPdf(lotteryKey : number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchPublishedApplicationsPdf(lotteryKey)
    .subscribe(async ({status, data, errorMessage}) => {
      if(status === 'SUCCESS') {
        this.progressSpinnerDialog.close();
        const modal = await this.modalCtrl.create({
          component: ViewPdfComponent,
          componentProps: {
            base64: data,
            documentName: "Accepted Applications",
            fileName: "Accepted_Applications.pdf"
          }
        });
        modal.present();
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
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, "error-unable-fetch-file").then(num => {
          this.showAcceptedApplicationPdf(lotteryKey);
        });
      // }
    });
  }


  showRejectedApplicationPdf(lotteryKey : number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchRejectedApplicationsPdf(lotteryKey)
    .subscribe(async ({status, data, errorMessage}) => {
      if(status === 'SUCCESS') {
        this.progressSpinnerDialog.close();
        const modal = await this.modalCtrl.create({
          component: ViewPdfComponent,
          componentProps: {
            base64: data,
            documentName: "Rejected Applications",
            fileName: "Rejected_Applications.pdf"
          }
        });
        modal.present();
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
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, "error-unable-fetch-file").then(num => {
          this.showRejectedApplicationPdf(lotteryKey);
        });
      // }
    });
  }

}

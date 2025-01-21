import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PreLotteryApplicationService } from '../../services/pre-lottery-application.service';
import { ModalController, ToastController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { TranslocoService } from '@ngneat/transloco';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { CategoryResponseModel } from "../../models/CategoryResponseModel";
import { Page } from '../../models/Page';
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ViewPdfComponent } from '../../view-pdf/view-pdf.component';



@Component({
  selector: 'app-accepted-applications-category',
  templateUrl: './accepted-applications-category.component.html',
  styleUrls: ['./accepted-applications-category.component.scss']
})
export class AcceptedApplicationsCategoryComponent implements OnInit {
  dataLoaded: boolean = false;
  progressSpinnerDialog: any = null;
  type: string;
  
  dataSource: MatTableDataSource<CategoryResponseModel> = new MatTableDataSource();
  page: Page<CategoryResponseModel>;
  pageSizeOptions: number[] = [10, 25, 100];
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  filterForm: FormGroup = new FormGroup({});
  isSearchDisabled: boolean = false;

  lotteryCode : string ;
  lotteryName : string ;
  schemeCode : string ;
  schemeName : string ;

  lotteryKey : number;
  schemeKey : number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    "id",
    "categoryCode",
    "categoryName",
    "action"
  ];

  constructor(
    private router : Router,
    private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController, private dialog: MatDialog, 
    private toastController: ToastController, private translocoService: TranslocoService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.lotteryKey = +params["lotteryKey"];
      this.schemeKey = +params["schemeKey"];
      console.log('Lottery Key :',this.lotteryKey, ' Scheme Key :',this.schemeKey);
      this.filterForm = new FormGroup({
        filterText: new FormControl(null, [Validators.required, Validators.minLength(2)])
      });
      
      this.loadData();
    });
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
      this._snackBar.open("Please enter Filter text for Category", "Close", {
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: "warning-toast",
        duration: 3 * 1000,
      });
      this.isSearchDisabled = false;
    }
  }

  backToScheme(){

    console.log('Back To Scheme Call');
    this.router.navigate(['/app', 'accepted-applications', 'accepted-applications-scheme', this.lotteryKey]);
  }
  
  loadData() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchCategoryListForAcceptedApplications(this.lotteryKey,this.schemeKey, this.currentPage, this.pageSize, this.filterForm.value.filterText).subscribe((data) => {
      console.log('Category Call');
      console.log(data.page.content);


      if(data.status === 'SUCCESS') {
        console.log(data.page.content);
        this.lotteryCode = data.lotteryCode;
        this.lotteryName = data.lotteryName;
        this.schemeCode = data.schemeCode;
        this.schemeName = data.schemeName;
        this.page = data.page;
        this.dataSource = new MatTableDataSource(data.page.content);
        
        setTimeout(() => {
          console.log(this.paginator);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data.page.totalElements;
          this.progressSpinnerDialog.close();
        });
      }
      else {
        this.preLotteryApplicationService.showErrorToast(data.errorMessage); 
      }

    }, async error => {
      this.progressSpinnerDialog.close();
      const toast = await this.toastController.create({
        message: this.translocoService.translate("error-category-list"),
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 4000,
      });
      toast.present();
    });
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }


  showPDF(categoryKey : number) {
    this.displayProgressSpinner();
    this.preLotteryApplicationService
    .fetchAcceptedApplicationsPdf(this.lotteryKey, this.schemeKey, categoryKey)
    .subscribe(async ({status, data, errorMessage}) => {
      if(status === 'SUCCESS') {
        this.progressSpinnerDialog.close();
        const modal = await this.modalCtrl.create({
          component: ViewPdfComponent,
          componentProps: {
            base64: data,
            documentName: "Accepted Applications",
            fileName: this.schemeKey+"_"+categoryKey+".pdf"
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
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
        "error-unable-fetch-file").then(num => {
          this.showPDF(categoryKey);
        });
      // }
    });
  }



}

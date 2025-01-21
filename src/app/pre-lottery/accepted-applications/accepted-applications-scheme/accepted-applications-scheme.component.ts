import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PreLotteryApplicationService } from '../../services/pre-lottery-application.service';
import { ModalController, ToastController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { TranslocoService } from '@ngneat/transloco';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { SchemeResponseModel } from "../../models/SchemeResponseModel";
import { Page } from '../../models/Page';
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";



@Component({
  selector: 'app-accepted-applications',
  templateUrl: './accepted-applications-scheme.component.html',
  styleUrls: ['./accepted-applications-scheme.component.scss']
})
export class AcceptedApplicationsSchemeComponent implements OnInit {
  dataLoaded: boolean = false;
  progressSpinnerDialog: any = null;
  type: string;
  
  dataSource: MatTableDataSource<SchemeResponseModel> = new MatTableDataSource();
  page: Page<SchemeResponseModel>;
  pageSizeOptions: number[] = [10, 25, 100];
  isLoading = false;
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  filterForm: FormGroup = new FormGroup({});
  isSearchDisabled: boolean = false;
  lotteryKey :number;
  lotteryCode: string;
  lotteryName: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = [
    "id",
    "schemeCode",
    "schemeName",
    "incomeGroupCode",
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
      console.log('Lottery Key :',this.lotteryKey)
      this.filterForm = new FormGroup({
        filterText: new FormControl(null, [Validators.required, Validators.minLength(3)])
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
      this._snackBar.open("Please enter Filter text (minimum - 3 char) for Scheme", "Close", {
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: "warning-toast",
        duration: 3 * 1000,
      });
      this.isSearchDisabled = false;
    }
  }
  
  loadData() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchSchemeListForAcceptedApplications
    (this.lotteryKey, this.currentPage, this.pageSize, this.filterForm.value.filterText).subscribe((data) => {
      this.progressSpinnerDialog.close();
      console.log('Scheme Call');
      if(data.status === 'SUCCESS') {
        console.log(data.page.content);
        this.lotteryCode = data.lotteryCode;
        this.lotteryName = data.lotteryName;
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
        message: this.translocoService.translate("error-scheme-list"),
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 4000,
      });
      toast.present();
    });
  }

  viewCategory(schemeKey : number){
    console.log('View Category Call',schemeKey,' lotteryKey :',this.lotteryKey);
    this.router.navigate(['/app', 'accepted-applications', 'accepted-applications-category', this.lotteryKey, schemeKey]);
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }
}

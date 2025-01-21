import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PreLotteryApplicationService } from '../../services/pre-lottery-application.service';
import { ApplicationListItemModel } from '../../models/application-list-item.model';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { FilterListComponent } from '../../filter-list/filter-list.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { TranslocoService } from '@ngneat/transloco';
// import {MatIconModule} from '@angular/material/icon';
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Page } from "src/app/pre-lottery/models/Page";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LetterOfIntimationComponent } from '../../letter-of-intimation/letter-of-intimation.component';
import { TimelineDataModel } from '../../models/timeline-data.model';
import { PostLotteryApplicationListItemModel } from '../../models/post-lottery-application-list';
import { ViewPdfComponent } from '../../view-pdf/view-pdf.component';
import { ApplicationNocListModel } from '../../models/application-noc-list-model';
import { NocListWrapper } from '../../models/noc-list-wrapper';

@Component({
  selector: 'app-noc-list',
  templateUrl: './noc-list.component.html',
  styleUrls: ['../../pre-lottery.component.scss', './noc-list.component.scss']
})
export class NocListComponent implements OnInit {
  applicationList: ApplicationListItemModel[] = [];
  dataLoaded: boolean = false;
  dataFiltered: boolean = true;
  progressSpinnerDialog: any = null;
  counter: number = 0;
  loiCounter: number = 0;
  isSearchDisabled: boolean = false;
  isLoading = false;
  page: Page<ApplicationNocListModel>;
  filterForm: FormGroup = new FormGroup({});
  timelineData: TimelineDataModel[];
  pageMode: string ;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  dataSource: MatTableDataSource<ApplicationNocListModel> = new MatTableDataSource();
  displayedColumns: string[] = [
    "id",
    "applicationNo",
    "applicationEmdPaymentStatus",
    "schemeName",
    "categoryCode",
    "applicationDrawStatus",
    "sanctionLetter"
  ];
  
  selectedTab: number = 0;

  pageSizeOptions: number[] = [10, 25, 100];
  totalRows = 0;
  pageSize = 10;
  currentPage = 0;
  isNotEligibleError: String;
  allowedForApply: boolean = false;
  showCancelNoc: boolean;
  stopApplyAtAlmntPoss: boolean;
  isAllowedForSurrenderAll : boolean = false;
  receiptCounter: number = 0;
  polCounter: number = 0;

  nocStatus: string;

  nocPaymentStaus: string;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController, private dialog: MatDialog, 
    private toastController: ToastController, 
    private translocoService: TranslocoService) { }

    ngOnInit(): void {
       this.onLoad();
    }
  
  onLoad() {
    this.isLoading = true;
    this.preLotteryApplicationService.fetchNocDetailsLists(this.currentPage, this.pageSize, 
      this.filterForm.value.filterText).subscribe((data) => {
      
      if(data.status === 'SUCCESS') {
        console.log("on load Data",data.page.content);
        this.dataSource = new MatTableDataSource(data.page.content);
        this.page = data.page;
        this.allowedForApply = data.allowedForApply;
        this.showCancelNoc = data.showCancelNoc;
        this.stopApplyAtAlmntPoss = data.stopApplyAtAlmntPoss;

        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = this.page.totalElements;
          console.log('page', this.currentPage);
          
        });
        this.isSearchDisabled = false;
        this.isLoading = false;
        this.dataLoaded = true;
      }
      else {
        this.isNotEligibleError = data.errorMessage;
        this.showErrorToast(data.errorMessage);
      }
    },
    (error) => {
        console.log(error);
        this.isLoading = false;
        this.isSearchDisabled = false;
        if(this.counter < 1) {
          this.counter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
          "error-application-noc-load").then(num => {
            this.onLoad();
          });
        }
    }
    );
  }

  viewNocForm(mortNocKey: number) {
    console.log("View NOC Form Details called ******** key for NOC view Details"+mortNocKey);
    this.router.navigate(['/app', 'noc', 'noc-form-view', mortNocKey]);  
    
  }

  editNocForm(mortNocKey: number) {
    console.log("View NOC Form Details called ******** key for NOC view Details"+mortNocKey);
    this.pageMode= 'EDIT';
    this.router.navigate(['/app', 'noc', 'noc-form-edit', mortNocKey,this.pageMode]);  
    
  }

  payNoc(registrationKey: number) {
    console.log("View NOC Form Details called ******** key for NOC view Details"+registrationKey);
    
    this.router.navigate(['/app', 'noc-payment', registrationKey]);  
    
  }

  
  // CancleNoc(mortNocKey: number) {
  //   console.log("Cancel NOC called ******** key for NOC Cancel"+mortNocKey);
  //   if(confirm("Do you want to Cancel NOC")) {
  //     this.preLotteryApplicationService.cancelNoc(mortNocKey).subscribe((data: any)=>{
  //       if(data.status === 'SUCCESS') {

  //         console.log("Cancel NOC Done");
  //         this.successToast("NOC cancelled");
  //         this.onLoad();
  //        // this.router.navigate(['/noc/noc-list']);
  //       }
  //       else {
  //         this.showErrorToast(data.errorMessage);
  //       }
  //     }
  //     );
  //   } 
  // }
  


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

  viewClassForNocStatus(nocStatus: string) {
    if(nocStatus === 'PENDING') {
        return 'bg-blue-400';
    }
    else if(nocStatus === 'APPROVED') {
        return 'bg-green-400';
    }
    else if(nocStatus === 'CANCELLED') {
        return 'bg-orange-400';
    }
    else if(nocStatus === 'REJECTED') {
        return 'bg-pink-500';
    } 
    else if(nocStatus === 'NOC_PAYMENT_PENDING') {
      return 'bg-pink-500';
    }
    else if(nocStatus === 'CANCEL_REQUESTED') {
      return 'bg-orange-400';
    } 
    else {
        return '';
    }
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.onLoad();
  }

  viewNocCancelRequestForm(mortNocKey: number) {
    console.log("View NOC Cancel Request Form Details called ******** key for NOC Cancel Request Form Details"+mortNocKey);
    this.router.navigate(['/app', 'noc', 'noc-cancel-request-form', mortNocKey]);  
    
  }

}

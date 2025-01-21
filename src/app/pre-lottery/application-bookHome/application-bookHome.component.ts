import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { ModalController, ToastController } from "@ionic/angular";
import { TranslocoService } from "@ngneat/transloco";
import { LoaderComponent } from "src/app/loader/loader.component";
import { ApplicationListItemModel } from "../models/application-list-item.model";
import { ApplicationModel } from "../models/application.model";
import { api_url,PreLotteryApplicationService } from "../services/pre-lottery-application.service";
import { ViewPdfComponent } from "../view-pdf/view-pdf.component";
import { FloorTenementModel } from "../models/FloorTenementModel";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ZoomedImageModalComponent } from "src/app/zoom-image/zoomed.component";

@Component({
  selector: "app-application-bookHome",
  templateUrl: "./application-bookHome.component.html",
  styleUrls: ["../pre-lottery.component.scss", "./application-new.component.scss"],
})
export class ApplicationBookHomeComponent implements OnInit {
  api_url: string = '';
  applicationKey: number;
  categoryKey: number;
  schemeKey: number;
  applicationModel: ApplicationListItemModel;
  progressSpinnerDialog: any = null;
  formLoadStatus: string;
  formLoadErrorMessage: string;
  loaded: boolean = false;
  counter: number = 0;
  polCounter: number = 0;
  selectedWing:string;
  buildingNo:string;
  category:string;
  wingList: string[] = [];
  buildingList: string[] = [];
  categoryList: string[] = [];
  floorGrid: { number: FloorTenementModel[] };
  availableCount:number;
  allotedCount:number;
  bookedCount:number;
  nACount:number;
  appForm: FormGroup = new FormGroup({});
  flatSelected: FloorTenementModel;

  constructor(
    private preLotteryApplicationService: PreLotteryApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private translocoService: TranslocoService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.api_url = api_url;
    this.route.params.subscribe((params: Params) => {
      this.applicationKey = +params["applicationKey"];

      let refundStatus = params["refund"];
      if(refundStatus) {
        this.successToast(this.translocoService.translate("success-refund-details-updated"));
      }

      this.loadData();
    });

    this.appForm = new FormGroup({
      wing: new FormControl(null)
    });
  }

  async successToast(msg) {
    await this._snackBar.open(
      msg,
      "Close", {
        horizontalPosition: "right",
        verticalPosition: "top",
        panelClass: "success-toast1",
        duration: 3 * 1000,
      }
    );
  }

  loadData() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchApplicationDetail(this.applicationKey).subscribe(
      (applicationModel) => {
        console.log('closing',applicationModel);
        this.progressSpinnerDialog.close();
        this.applicationModel = applicationModel;
        this.formLoadStatus = applicationModel.status;
        this.formLoadErrorMessage = applicationModel.errorMessage;
        this.schemeKey = applicationModel.schemeKey;
        this.categoryKey = applicationModel.categoryKey;
        this.loadCategory();
        this.loaded = true;
      },
      (error) => {
        this.progressSpinnerDialog.close();
        if (this.counter < 1) {
          this.counter++;
          this.preLotteryApplicationService
            .checkErrorForExpiredToken(error, "error-application-detail-load")
            .then((num) => {
              this.loadData();
            });
        }
      }
    );
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  async viewPOL() {
    this.fetchPOL();
  }

  fetchPOL() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchPOL(this.applicationKey).subscribe(
      async ({ status, data, errorMessage }) => {
        if (status === "SUCCESS") {
          this.progressSpinnerDialog.close();
          const modal = await this.modalCtrl.create({
            component: ViewPdfComponent,
            componentProps: {
              base64: data,
              documentName: "Provisional Offer Letter",
              fileName: "POL_" + new Date().getTime() + ".pdf",
            },
          });
          modal.present();
        } else {
          this.progressSpinnerDialog.close();
          this.showErrorToast(errorMessage);
        }
      },
      (error) => {
        this.progressSpinnerDialog.close();
        if (this.polCounter < 1) {
          this.polCounter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error, "error-pol-load").then((num) => {
            this.loadData();
          });
        }
      }
    );
  }

  loadCategory() {  
    this.preLotteryApplicationService.fetchCategoryList(this.applicationKey)
    .subscribe((data:any) => {
        this.categoryList = data.categoryList;
    },
    (error) => {
        console.log(error);
    });
 }

 loadBuildings(event: any) { 
  let category = event?.target?.value;
  console.log("categorycode", event?.target?.value);
  this.category = category;
  this.preLotteryApplicationService.fetchBuildingList(this.applicationKey,category)
  .subscribe((data:any) => {
      this.buildingList = data.buildingList;
  },
  (error) => {
      console.log(error);
  });
}

//    loadBuildings() { 
//     this.preLotteryApplicationService.fetchBuildingList(this.applicationKey)
//     .subscribe((data:any) => {
//         this.buildingList = data.buildingList;
//     },
//     (error) => {
//         console.log(error);
//     });
//  }

 async loadWings(event: any) {//buildingNo: string) {
  this.flatSelected=null;
  console.log("event?.target", event?.target?.value);
  let buildingNo = event?.target?.value;
  console.log("buildingNo", event?.target?.value);
  this.selectedWing = "N";
  console.log("in Onload");
  this.buildingNo = buildingNo;
  this.appForm.patchValue({
    wing: null
  });
  this.wingList = [];
  this.floorGrid = null;
  this.availableCount = null;
  this.allotedCount = null;
  this.nACount = null;
  this.bookedCount = null;
  this.displayProgressSpinner();
  this.preLotteryApplicationService.fetchWingList(this.applicationKey,
    buildingNo,this.category)
    .subscribe((data: any) => {
      this.progressSpinnerDialog.close();
      this.wingList = data.wingList;
    },
      (error) => {
        this.progressSpinnerDialog.close();
        console.log(error);
      });
}

async loadFloorGrid(event: any) {//(wing: string) {
  this.flatSelected=null;
  console.log("event?.target", event?.target?.value);
  let wing = event?.target?.value;
  console.log("wing", event?.target?.value);
  this.selectedWing = "Y";
  console.log("in Onload",wing);
  this.floorGrid = null;
  this.availableCount = null;
  this.allotedCount = null;
  this.nACount = null;
  this.bookedCount = null;
  this.displayProgressSpinner();
  this.preLotteryApplicationService.fetchFloorGrid(this.applicationKey,
    this.buildingNo,wing,this.category)
  .subscribe((data:any) => {
      this.progressSpinnerDialog.close();
      this.floorGrid = data.gridData;
      this.availableCount = data.availableCount;
      this.allotedCount = data.allotedCount;
      this.nACount = data.nacount;
      console.log("nacount+++",data);
      console.log("this.floorGrid -> ",this.floorGrid);      
      this.bookedCount = data.bookedCount;
  },
  (error) => {
    this.progressSpinnerDialog.close();
      console.log(error);

  });
}

selectFlat(flat: FloorTenementModel) {
  this.flatSelected = flat;
  console.log("this.flatSelected",this.flatSelected);
}

 buildingListdrop(o1: any, o2: any): boolean {
  return o1 && o2 ? o1.key === o2.key : o1 === o2;
}

wingListDrop(o1: any, o2: any): boolean {
  return o1 && o2 ? o1.key === o2.key : o1 === o2;
}

floorListDrop(o1: any, o2: any): boolean {
  return o1 && o2 ? o1.key === o2.key : o1 === o2;
}

flatNoListDrop(o1: any, o2: any): boolean {
  return o1 && o2 ? o1.key === o2.key : o1 === o2;
}

getStatusColor(flat: FloorTenementModel, flatSelected: FloorTenementModel): string {
  if(flatSelected?.key === flat.key) {
    return "selected";
  }
  else {
    switch (flat.status) {
      case 'TENEMENT_ALLOTED':
        return 'sold'; // Red
      case 'TENEMENT_NOT_ALLOTTED':
        return 'available'; // Green
     case 'PENDING_PAYMENT':
          return 'pendingPayment'; // orange
     case 'NA':
          return 'na'; // orange
      // Add more cases for other statuses
      default:
        return '#3498db'; // Default color
    }
  }
} 

onSubmit() {
  console.log(this.appForm.valid, this.appForm.value);
  this.submitForm();
}

submitForm() {
  this.displayProgressSpinner();
  console.log('TenementId', this.flatSelected?.key);
  this.preLotteryApplicationService
    .saveSelectedTenement(
      this.applicationKey,
      this.flatSelected?.key
    )
    .subscribe((application) => {
      this.progressSpinnerDialog.close();
      console.log('application', application);
      if (application.status === 'SUCCESS') {
        this.showSucessToast(application.successMsg);
        this.loadData();
      }
      else {
        this.showErrorToast(application.errorMessage);
      }
    }, error => {
      this.progressSpinnerDialog.close();
      
    });
}

async showSucessToast(sucessMessage: string) {
  const toast = await this.toastController.create({
    message: sucessMessage,
    icon: "information-circle",
    position: "top",
    cssClass: "toast success-toast",
    duration: 4000,
  });
  toast.present();
}

openZoomedModal(imageSrc: string): void {
  console.log("Zoom Called")
  this.dialog.open(ZoomedImageModalComponent, {
    data: { imageSrc }
  });
}

}

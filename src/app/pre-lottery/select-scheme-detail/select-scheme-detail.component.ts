import { AfterViewInit, Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { SchemeModel } from '../models/scheme.model';
import { api_url, PreLotteryApplicationService } from '../services/pre-lottery-application.service';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom, SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { MatDialog } from '@angular/material/dialog';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { LotteryCategoryModel } from '../models/lottery-category.model';
import { FloorTenementModel } from '../models/FloorTenementModel';
import { FormGroup } from '@angular/forms';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-select-scheme-detail',
  templateUrl: './select-scheme-detail.component.html',
  styleUrls: ['../pre-lottery.component.scss','./select-scheme-detail.component.scss']})
export class SelectSchemeDetailComponent implements OnInit, AfterViewInit {
  scheme: SchemeModel;
  boardKey: number;
  lotteryKey: number;
  schemeKey: number;
  gmapUrl: SafeResourceUrl;

  selectedWing:string;
  buildingNo:string;
  category:string;
  wingList: string[] = [];
  buildingList: string[] = [];
  floorGrid: { number: FloorTenementModel[] };
  availableCount:number;
  allotedCount:number;
  bookedCount:number;
  nACount:number;
  flatSelected: FloorTenementModel;
  appForm: FormGroup = new FormGroup({});


  categoryList: LotteryCategoryModel[] = [];
  api_url: string = '';
  viewMode: string;
  @ViewChild('swiperSlideShow1') swiperSlideShow1!: SwiperComponent;
  @ViewChild('swiperSlideShow2') swiperSlideShow2!: SwiperComponent;
  @ViewChild('swiperSlideShow3') swiperSlideShow3!: SwiperComponent;
  config: SwiperOptions = {
    slidesPerView: 1, 
    spaceBetween: 20,
    loop: true,
    speed: 400,
    centeredSlides: true
  };
  progressSpinnerDialog: any = null;
  counter: number = 0;

  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService, 
    private sanitizer: DomSanitizer, 
    private dialog: MatDialog,
    private toastController: ToastController,
    private translocoService: TranslocoService, private modalCtrl: ModalController) { }

  ngOnInit(): void {
    this.api_url = api_url;
    this.route.params.subscribe((params: Params) => {
      this.boardKey = +params['boardKey'];
      this.lotteryKey = +params['lotteryKey'];
      this.schemeKey = +params['schemeKey'];
      this.viewMode = params['viewMode'];
      this.loadData();
    });
  }
  
  loadData() {
    this.displayProgressSpinner();
    if(this.viewMode === 'APPLY') {
      this.preLotteryApplicationService.fetchSchemeForLotterySchemeForApplying(this.schemeKey)
      .subscribe(scheme => {
        this.counter = 0;
        this.scheme = scheme;
        this.progressSpinnerDialog.close();
        this.gmapUrl = this.sanitize('https://www.google.com/maps/embed/v1/place?'+
                                  'q='+scheme?.latitude+'%2C'+scheme?.longitude+'&'+
                                  'key=AIzaSyAITG1Y4TiuzUJvBLDriXkcpH256t0wbcg');
      }, error => {
        this.progressSpinnerDialog.close();
        if(this.counter < 1) {
          this.counter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
          "error-select-scheme-detail-load").then(num => {
            this.loadData();
          });
        }
      });
    }
    else {
      this.preLotteryApplicationService.fetchSchemeForLotterySchemeForGuest(this.schemeKey)
      .subscribe(scheme => {
        this.counter = 0;
        this.scheme = scheme;
        this.progressSpinnerDialog.close();
        this.gmapUrl = this.sanitize('https://www.google.com/maps/embed/v1/place?'+
                                  'q='+scheme?.latitude+'%2C'+scheme?.longitude+'&'+
                                  'key=AIzaSyAITG1Y4TiuzUJvBLDriXkcpH256t0wbcg');
      }, error => {
        this.progressSpinnerDialog.close();
      });
    }
    // Load tenement details only for Aurangabad Board
    if (this.boardKey === 4) {
      this.loadCategory();
    } 
   }

  ngAfterViewInit(): void {
    this.config = {
      ...this.config,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      }
    }
    
    setTimeout(() => {
      this.swiperSlideShow1?.swiperRef?.autoplay?.start();
      this.swiperSlideShow2?.swiperRef?.autoplay?.start();
      this.swiperSlideShow3?.swiperRef?.autoplay?.start();
    }, 3000);
  }

  sanitize(url: string) {
    console.log('sanitize called');
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  async zoom(img: string)  {
    const modal = await this.modalCtrl.create({
      component: ImageModalComponent,
      componentProps: {
        img
      },
      cssClass: 'transparent-modal'
    });
    modal.present();
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

  loadCategory() {  
    this.preLotteryApplicationService.fetchCategoryListNew(this.schemeKey)
      .subscribe((data: any) => {
        this.categoryList = data;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>",this.categoryList);
      },
      (error) => {
        console.log('Error fetching category list:', error);
      });
  }

  loadBuildings(event: any) { 
  let category = event?.target?.value;
  console.log("categorycode", event?.target?.value);
  this.category = category;
  // const categoryCode = this.selectedCategory?.categoryCode;
  // console.log("categorycode", categoryCode);
  // this.category = categoryCode;
 this.preLotteryApplicationService.fetchBuildingListNew(this.schemeKey,category)
  .subscribe((data:any) => {
      this.buildingList = data.buildingList;
  },
  (error) => {
      console.log(error);
  });
}

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
  this.preLotteryApplicationService.fetchWingListNew(this.schemeKey,
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
  this.preLotteryApplicationService.fetchFloorGridNew(this.schemeKey,
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
getFlatRowIndexes(flatCount: number): number[] {
  return Array.from({ length: Math.ceil(flatCount / 10) }, (_, i) => i);
}

getStatusColor(flat: any): string {

  if (flat.status === 'TENEMENT_ALLOTED') {
    return 'sold';
  }

  if (flat.status === 'PENDING_PAYMENT') {
    return 'pendingPayment';
  }

  if (flat.status === 'NA') {
    return 'na';
  }

  return 'available';
}

selectFlat(flat: FloorTenementModel) {
  this.flatSelected = flat;
  console.log("this.flatSelected",this.flatSelected);
}

}

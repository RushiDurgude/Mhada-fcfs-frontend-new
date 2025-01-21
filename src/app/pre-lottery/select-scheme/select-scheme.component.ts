import { AfterViewInit, Component, OnInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SchemeModel } from '../models/scheme.model';
import { api_url, PreLotteryApplicationService } from '../services/pre-lottery-application.service';
import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom, SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { MatDialog } from '@angular/material/dialog';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { LoaderComponent } from 'src/app/loader/loader.component';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom]);

@Component({
  selector: 'app-select-scheme',
  templateUrl: './select-scheme.component.html',
  styleUrls: ['../pre-lottery.component.scss', './select-scheme.component.scss']
})
export class SelectSchemeComponent implements OnInit, AfterViewInit {
  schemes: SchemeModel[] = [];
  boardKey: number;
  lotteryKey: number;
  api_url: string;
  viewMode: string;
  @ViewChildren('swiperSlideShow') swiperSlideShow: SwiperComponent[];
  config: SwiperOptions = {};
  loaded: boolean = false;
  progressSpinnerDialog: any = null;
  counter: number = 0;
  filteredSchemes: SchemeModel[] = [];
  filterText: string;
  filterLoading: boolean = false;
  advancedSearch: boolean = false;
  lotteryCode: string;
  lotteryName: string;

  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService,
    private dialog: MatDialog,
    private toastController: ToastController,
    private translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.api_url = api_url;
    this.route.params.subscribe((params: Params) => {
      this.boardKey = +params['boardKey'];
      this.lotteryKey = +params['lotteryKey'];
      this.viewMode = params['viewMode'];
      this.loadData();
    });
  }

  fuzzySearch(s: SchemeModel, filterText: string) {
    let filterArr = filterText.split(' ');
    for(let i = 0; i < filterArr.length; i++) {
      let filterObj = filterArr[i];
      if(s.schemeCode.toUpperCase().indexOf(filterObj.toUpperCase()) >= 0
      || s.schemeName.toUpperCase().indexOf(filterObj.toUpperCase()) >= 0
      || s.address.toUpperCase().indexOf(filterObj.toUpperCase()) >= 0) {
        return true;
      }
    }
    return false;
  }

  onSearchFilter() {
    console.log('filterText', this.filterText);
    if(this.filterText && this.filterText.length > 0) {
      this.filteredSchemes = this.schemes.filter(s => {
        return this.fuzzySearch(s, this.filterText);
      });
    }
    else {
      this.filteredSchemes = this.schemes;
    }
    this.progressSpinnerDialog.close();
  }

  onResetFilter() {
    this.filterText = "";
    this.onSearchFilter();
  }

  onChangeFilterText(e) {
    this.displayProgressSpinner();
    console.log(e.target.value);
    if(e.target.value && e.target.value.length > 0) {
      this.filteredSchemes = this.schemes.filter(s => {
        return this.fuzzySearch(s, this.filterText);
      });
    }
    else {
      this.filteredSchemes = this.schemes;
    }
    this.progressSpinnerDialog.close();
  }

  loadData() {
    console.log('test this',this.viewMode);
    this.displayProgressSpinner();
    if(this.viewMode === 'APPLY') {
      this.preLotteryApplicationService.fetchSchemesForLotteryForApplying(this.lotteryKey)
      .subscribe(data => {
        this.progressSpinnerDialog.close();
        if(data.status === 'SUCCESS') {
          this.schemes = data.schemeList;
          this.filteredSchemes = this.schemes;
          this.lotteryCode = data.schemeList?.length > 0 ? data.schemeList[0].lotteryCode : null;
          this.lotteryName = data.schemeList?.length > 0 ? data.schemeList[0].lotteryName : null;
          this.loaded = true;
        }
        else {
          this.preLotteryApplicationService.showErrorToast(data.errorMessage);
        }
      }, error => {
        this.progressSpinnerDialog.close();
        if(this.counter < 1) {
          this.counter++;
          this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
          "error-select-scheme-load").then(num => {
            this.loadData();
          });
        }
      });
    }
    else  {
      
      this.preLotteryApplicationService.fetchGuestSchemesForLotteryForApplying(this.lotteryKey)
      .subscribe(data => {
        this.progressSpinnerDialog.close();
        if(data.status === 'SUCCESS') {
          this.schemes = data.schemeList;
          this.filteredSchemes = this.schemes;
          this.lotteryCode = data.schemeList?.length > 0 ? data.schemeList[0].lotteryCode : null;
          this.lotteryName = data.schemeList?.length > 0 ? data.schemeList[0].lotteryName : null;
          this.loaded = true;
        }
        else {
          this.preLotteryApplicationService.showErrorToast(data.errorMessage);
        }
      }, error => {
        this.progressSpinnerDialog.close();
      });
    }
  }

  ngAfterViewInit(): void {
    this.config = {
      // autoplay: {
      //   delay: 3000,
      //   disableOnInteraction: false
      // }
    }
    
    // this.swiperSlideShow.forEach(s => {
    //   console.log('here');
    //   s.swiperRef.autoplay.start();
    // });
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
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
  }
}

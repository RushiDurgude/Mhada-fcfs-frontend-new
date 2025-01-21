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
}

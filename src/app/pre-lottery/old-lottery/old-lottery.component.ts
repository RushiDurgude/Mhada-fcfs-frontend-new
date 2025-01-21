import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ImportantDatesComponent } from '../important-dates/important-dates.component';
import { LotteryModel } from '../models/lottery.model';
import { TimelineDataModel } from '../models/timeline-data.model';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';
import { ThemePalette } from '@angular/material/core';
import { ThemeService } from 'src/app/theme.service';

@Component({
  selector: 'app-old-lottery',
  templateUrl: './old-lottery.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class OldLotteryComponent implements OnInit {
  lotteries: LotteryModel[] = [];
  viewMode: string;
  @ViewChild(IonModal) modal: IonModal;
  timelineData: TimelineDataModel[];
  loaded: boolean = false;
  progressSpinnerDialog: any = null;
  counter: number = 0;

  isDarkMode: boolean = false;
  
  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController, private dialog: MatDialog,
    private toastController: ToastController,private themeService: ThemeService) {

      this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.displayProgressSpinner();
    this.viewMode = 'VIEW';
    this.preLotteryApplicationService.fetchOldLotteries()
    .subscribe(lotteries => {
      this.lotteries = lotteries;
      this.loaded = true;
      this.progressSpinnerDialog.close();
    }, error => {
      this.progressSpinnerDialog.close();
      if(this.counter < 1) {
        this.counter++;
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
        "error-select-lottery-load").then(num => {
          this.loadData();
        });
      }
    });      
  }

  async openModal(lottery: LotteryModel) {
    this.timelineData = [
      new TimelineDataModel('Application Start', lottery.applicationStartDateFullTime, 
        'royal-success', this.checkDateStatus(lottery.applicationStartDateStatus)[0], 
        this.checkDateStatus(lottery.applicationStartDateStatus)[1]),
      new TimelineDataModel('Payment Start', lottery.onlinePaymentStartDateFullTime, 
      'royal-success', this.checkDateStatus(lottery.onlinePaymentStartDateStatus)[0], 
      this.checkDateStatus(lottery.onlinePaymentStartDateStatus)[1]),
      new TimelineDataModel('Application End', lottery.applicationEndDateFullTime, 
        'royal-danger', this.checkDateStatus(lottery.applicationEndDateStatus)[0], 
        this.checkDateStatus(lottery.applicationEndDateStatus)[1]),
      new TimelineDataModel('Online Payment End', lottery.onlinePaymentEndDateFullTime, 
        'royal-danger', this.checkDateStatus(lottery.onlinePaymentEndDateStatus)[0], 
        this.checkDateStatus(lottery.onlinePaymentEndDateStatus)[1]),
      new TimelineDataModel('RTGS/ NEFT Payment End', lottery.rtgsNeftEndDateFullTime, 
        'royal-danger', this.checkDateStatus(lottery.rtgsNeftEndDateStatus)[0], 
        this.checkDateStatus(lottery.rtgsNeftEndDateStatus)[1]),
      new TimelineDataModel('Draft Application Publish', lottery.draftPublishApplicationDateFullTime, 
        'royal-success', this.checkDateStatus(lottery.draftPublishApplicationDateStatus)[0], 
        this.checkDateStatus(lottery.draftPublishApplicationDateStatus)[1]),
      new TimelineDataModel('Final Application Publish', lottery.finalPublishApplicationDateFullTime, 
        'royal-success', this.checkDateStatus(lottery.finalPublishApplicationDateStatus)[0], 
        this.checkDateStatus(lottery.finalPublishApplicationDateStatus)[1]),
      new TimelineDataModel('Lottery Draw', lottery.lotteryRunDateFullTime, 
        'royal-success', this.checkDateStatus(lottery.lotteryRunDateStatus)[0], 
        this.checkDateStatus(lottery.lotteryRunDateStatus)[1]),
      new TimelineDataModel('Refund Start', lottery.refundStartDateFullTime, 
        'royal-success', this.checkDateStatus(lottery.refundStartDateStatus)[0], 
        this.checkDateStatus(lottery.refundStartDateStatus)[1]),
    ];

    const modal = await this.modalCtrl.create({
      component: ImportantDatesComponent,
      componentProps: {
        timelineData: this.timelineData,
        lotteryName: lottery.lotteryName
      }
    });
    modal.present();
  }

  checkDate(date: Date): string[] {
    return new Date(date) <= new Date()
      ? ['checkmark-circle-sharp', 'timeline-icon-success']
      : ['alert-circle-sharp', 'timeline-icon-warning'];
  }

  checkDateStatus(status: string): string[] {
    return status === 'SUCCESS'
      ? ['checkmark-circle-sharp', 'timeline-icon-success']
      : ['alert-circle-sharp', 'timeline-icon-warning'];
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

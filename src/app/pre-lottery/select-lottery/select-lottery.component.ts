import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ImportantDatesComponent } from '../important-dates/important-dates.component';
import { LotteryModel } from '../models/lottery.model';
import { TimelineDataModel } from '../models/timeline-data.model';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';

@Component({
  selector: 'app-select-lottery',
  templateUrl: './select-lottery.component.html',
  styleUrls: ['../pre-lottery.component.scss','./select-lottery.component.scss']
})
export class SelectLotteryComponent implements OnInit {
  lotteries: LotteryModel[] = [];
  viewMode: string;
  @ViewChild(IonModal) modal: IonModal;
  timelineData: TimelineDataModel[];
  loaded: boolean = false;
  progressSpinnerDialog: any = null;
  counter: number = 0;
  boardKey: number;
  mode: string;

  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController, private dialog: MatDialog,
    private toastController: ToastController,) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.boardKey = +params['boardKey'];
      this.mode = params['mode'];
      this.loadData();  
    });
  }

  loadData() {
      this.displayProgressSpinner();
      if(this.boardKey && !this.mode) {
        this.viewMode = 'APPLY';
        this.preLotteryApplicationService.fetchLotteriesForBoardForApplying(this.boardKey)
        .subscribe(data => {
          this.progressSpinnerDialog.close();
          if(data.status === 'SUCCESS') {
            this.lotteries = data.lotteryList;
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
            "error-select-lottery-load").then(num => {
              this.loadData();
            });
          }
        });
      }
      else {
        this.viewMode = 'VIEW';
        this.preLotteryApplicationService.fetchActiveLotteries()
        .subscribe(lotteries => {
          if(this.boardKey && this.mode) {
            this.lotteries = lotteries.filter(l => l.boardModel.key === this.boardKey);
          }
          else {
            this.lotteries = lotteries;
          }
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
  }

  async openModal(lottery: LotteryModel) {
    this.timelineData = [
      new TimelineDataModel('Application Start', lottery.applicationStartDateFullTime, 
        'royal-success', this.checkDateStatus(lottery.applicationStartDateStatus)[0], 
        this.checkDateStatus(lottery.applicationStartDateStatus)[1]),
      new TimelineDataModel('Emd Payment Start', lottery.onlinePaymentStartDateFullTime, 
      'royal-success', this.checkDateStatus(lottery.onlinePaymentStartDateStatus)[0], 
      this.checkDateStatus(lottery.onlinePaymentStartDateStatus)[1]),
      new TimelineDataModel('Application End', lottery.applicationEndDateFullTime, 
        'royal-danger', this.checkDateStatus(lottery.applicationEndDateStatus)[0], 
        this.checkDateStatus(lottery.applicationEndDateStatus)[1]),
      new TimelineDataModel('Online Emd Payment End', lottery.onlinePaymentEndDateFullTime, 
        'royal-danger', this.checkDateStatus(lottery.onlinePaymentEndDateStatus)[0], 
        this.checkDateStatus(lottery.onlinePaymentEndDateStatus)[1]),
      new TimelineDataModel('RTGS/ NEFT Emd Payment End', lottery.rtgsNeftEndDateFullTime, 
        'royal-danger', this.checkDateStatus(lottery.rtgsNeftEndDateStatus)[0], 
        this.checkDateStatus(lottery.rtgsNeftEndDateStatus)[1]),
      // new TimelineDataModel('Draft Application Publish', lottery.draftPublishApplicationDateFullTime, 
      //   'royal-success', this.checkDateStatus(lottery.draftPublishApplicationDateStatus)[0], 
      //   this.checkDateStatus(lottery.draftPublishApplicationDateStatus)[1]),
      // new TimelineDataModel('Final Application Publish', lottery.finalPublishApplicationDateFullTime, 
      //   'royal-success', this.checkDateStatus(lottery.finalPublishApplicationDateStatus)[0], 
      //   this.checkDateStatus(lottery.finalPublishApplicationDateStatus)[1]),
      // new TimelineDataModel('Lottery Draw', lottery.lotteryRunDateFullTime, 
      //   'royal-success', this.checkDateStatus(lottery.lotteryRunDateStatus)[0], 
      //   this.checkDateStatus(lottery.lotteryRunDateStatus)[1]),
      // new TimelineDataModel('Refund Start', lottery.refundStartDateFullTime, 
      //   'royal-success', this.checkDateStatus(lottery.refundStartDateStatus)[0], 
      //   this.checkDateStatus(lottery.refundStartDateStatus)[1]),
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

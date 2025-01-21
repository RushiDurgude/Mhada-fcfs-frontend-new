import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';
import { ApplicationListItemModel } from '../models/application-list-item.model';
import { ModalController, ToastController } from '@ionic/angular';
import { FilterListComponent } from '../filter-list/filter-list.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['../pre-lottery.component.scss', './application-list.component.scss']
})
export class ApplicationListComponent implements OnInit {
  applicationList: ApplicationListItemModel[] = [];
  dataLoaded: boolean = false;
  dataFiltered: boolean = true;
  progressSpinnerDialog: any = null;
  counter: number = 0;

  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService,
    private modalCtrl: ModalController, private dialog: MatDialog, 
    private toastController: ToastController, private translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.loadData();
  }
  
  loadData() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchApplicationList()
    .subscribe(applicationList => {
      this.applicationList = applicationList;
      this.dataLoaded = true;
      this.progressSpinnerDialog.close();
    }, async error => {
      this.progressSpinnerDialog.close();
      if(this.counter < 1) {
        this.counter++;
        this.preLotteryApplicationService.checkErrorForExpiredToken(error, 
        "error-application-list-load").then(num => {
          this.loadData();
        });
      }
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
  
  async openFilter() {
    const modal = await this.modalCtrl.create({
      component: FilterListComponent,
      componentProps: {
        timelineData: []
      }
    });
    modal.present();
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }
}

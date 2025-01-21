import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { SharedService } from 'src/app/toolbar/shared.service';
import { AnnouncementModel } from '../models/announcment.model';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class NewsComponent implements OnInit {
  news: AnnouncementModel[] = [];
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  lang: string;
  
  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService, 
    private dialog: MatDialog, private translocoService: TranslocoService, 
    private toastController: ToastController, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchActiveNews()
    .subscribe(news => {
      this.news = news;
      this.dataLoaded = true;
      this.progressSpinnerDialog.close();
    }, async error => {
      this.progressSpinnerDialog.close();
      const toast = await this.toastController.create({
        message: this.translocoService.translate("error-news-load"),
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 4000,
      });
      toast.present();
    });

    this.sharedService.name.subscribe((lang) => {
      this.lang = lang;
    });
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

}

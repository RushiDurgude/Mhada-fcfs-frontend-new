import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementModel } from '../models/announcment.model';
import { PreLotteryApplicationService } from '../services/pre-lottery-application.service';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/toolbar/shared.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['../pre-lottery.component.scss']
})
export class HelpComponent implements OnInit {
  helpLinks: AnnouncementModel[] = [];
  helpVideos: AnnouncementModel[] = [];
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;

  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService, 
    private sanitizer: DomSanitizer, private dialog: MatDialog, 
    private translocoService: TranslocoService, private toastController: ToastController,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    // this.displayProgressSpinner();
    // this.preLotteryApplicationService.fetchActiveHelp()
    // .subscribe(helpList => {
    //   this.dataLoaded = true;
    //   this.helpLinks = helpList.filter(h => 
    //     h.announcementType === 'HELP_LINK' || h.announcementType === 'HELP_EXTERNAL_LINK'
    //   );
      
    //   this.helpVideos = helpList.filter(h => 
    //     h.announcementType === 'HELP_VIDEO'
    //   );
    //   this.progressSpinnerDialog.close();
    // }, async error => {
    //   this.progressSpinnerDialog.close();
    //   const toast = await this.toastController.create({
    //     message: this.translocoService.translate("error-help-load"),
    //     icon: "information-circle",
    //     position: "top",
    //     cssClass: "toast error-toast",
    //     duration: 4000,
    //   });
    //   toast.present();
    // });
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

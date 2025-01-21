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
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['../pre-lottery.component.scss', './quick-links.component.scss']
})
export class QuickLinksComponent implements OnInit {
  helpLinks: AnnouncementModel[] = [];
  helpVideos: AnnouncementModel[] = [];
  cidcoHelpLinks: AnnouncementModel[] = [];
  // pmrdaHelpLinks: AnnouncementModel[] = [];
  // mumbaiHelpLinks: AnnouncementModel[] = [];
  // konkanHelpLinks: AnnouncementModel[] = [];
  // puneHelpLinks: AnnouncementModel[] = [];
  // aurangabadHelpLinks: AnnouncementModel[] = [];
  // nashikHelpLinks: AnnouncementModel[] = [];
  // nagpurHelpLinks: AnnouncementModel[] = [];
  // mhada_CDPHelpLinks: AnnouncementModel[] = [];
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  lang: string;
  filterForm: FormGroup = new FormGroup({});

  constructor(private route: ActivatedRoute, 
    private preLotteryApplicationService: PreLotteryApplicationService, 
    private sanitizer: DomSanitizer, private dialog: MatDialog, 
    private translocoService: TranslocoService, private toastController: ToastController,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      filterText: new FormControl(null, [Validators.required, Validators.minLength(3)])
    });
    this.load();
  }
    // this.onLoad();
    load() {
    this.displayProgressSpinner();
    this.preLotteryApplicationService.fetchActiveHelp()
    .subscribe(helpList => {
      this.dataLoaded = true;
      this.helpLinks = helpList.filter(h => 
        h.announcementType === 'HELP_LINK' || h.announcementType === 'HELP_EXTERNAL_LINK'
      );
      
      this.helpVideos = helpList.filter(h => 
        h.announcementType === 'HELP_VIDEO'
      );
      this.progressSpinnerDialog.close();
      
      console.log("this.helpLinks >> ",this.helpLinks);
      console.log("this.helpVideos >> ",this.helpVideos);

    }, async error => {
      this.progressSpinnerDialog.close();
      const toast = await this.toastController.create({
        message: this.translocoService.translate("error-help-load"),
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 4000,
      });
      toast.present();
    });

    this.preLotteryApplicationService.fetchActiveHelpCidco()
    .subscribe(helpList => {
      this.dataLoaded = true;
      this.cidcoHelpLinks = helpList.filter(h => 
        h.announcementType === 'HELP_LINK' || h.announcementType === 'HELP_EXTERNAL_LINK'
      );
      
      this.helpVideos = helpList.filter(h => 
        h.announcementType === 'HELP_VIDEO'
      );
      this.progressSpinnerDialog.close();
    }, async error => {
      this.progressSpinnerDialog.close();
      const toast = await this.toastController.create({
        message: this.translocoService.translate("error-help-load"),
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 4000,
      });
      toast.present();
    });

    // this.preLotteryApplicationService.fetchActiveHelpPmrda()
    // .subscribe(helpList => {
    //   this.dataLoaded = true;
    //   this.pmrdaHelpLinks = helpList.filter(h => 
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

    // this.preLotteryApplicationService.fetchActiveHelpMumbai()
    // .subscribe(helpList => {
    //   this.dataLoaded = true;
    //   this.mumbaiHelpLinks = helpList.filter(h => 
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

  //  this.preLotteryApplicationService.fetchActiveHelpKonkan()
  //   .subscribe(helpList => {
  //     this.dataLoaded = true;
  //     this.konkanHelpLinks = helpList.filter(h => 
  //       h.announcementType === 'HELP_LINK' || h.announcementType === 'HELP_EXTERNAL_LINK'
  //     );
      
  //     this.helpVideos = helpList.filter(h => 
  //       h.announcementType === 'HELP_VIDEO'
  //     );
  //     this.progressSpinnerDialog.close();
  //   }, async error => {
  //     this.progressSpinnerDialog.close();
  //     const toast = await this.toastController.create({
  //       message: this.translocoService.translate("error-help-load"),
  //       icon: "information-circle",
  //       position: "top",
  //       cssClass: "toast error-toast",
  //       duration: 4000,
  //     });
  //     toast.present();
  //   });

    // this.preLotteryApplicationService.fetchActiveHelpPune()
    // .subscribe(helpList => {
    //   this.dataLoaded = true;
    //   this.puneHelpLinks = helpList.filter(h => 
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
    
    // this.preLotteryApplicationService.fetchActiveHelpAurangabad()
    // .subscribe(helpList => {
    //   this.dataLoaded = true;
    //   this.aurangabadHelpLinks = helpList.filter(h => 
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

    // this.preLotteryApplicationService.fetchActiveHelpNashik()
    // .subscribe(helpList => {
    //   this.dataLoaded = true;
    //   this.nashikHelpLinks = helpList.filter(h => 
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

    // this.preLotteryApplicationService.fetchActiveHelpNagpur()
    // .subscribe(helpList => {
    //   this.dataLoaded = true;
    //   this.nagpurHelpLinks = helpList.filter(h => 
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

    // this.preLotteryApplicationService.fetchActiveHelpMhada_CDP()
    // .subscribe(helpList => {
    //   this.dataLoaded = true;
    //   this.mhada_CDPHelpLinks = helpList.filter(h => 
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

    this.sharedService.name.subscribe((lang) => {
      this.lang = lang;
    });
  }


  resetFilter() {
      this.filterForm.controls['filterText'].setValue(null);
      this.load();
    }



    // onSearch() {
      
    //     console.log("onSearch");
    //     this.onLoad();
      
    // }

   
onSearch() {
    const searchText = this.filterForm.value.filterText;

    if (!searchText) {
        this.showPopupMessage();
    } else {
        console.log("onSearch");
        this.onLoad();
    }
}

async showPopupMessage() {
    const toast = await this.toastController.create({
        message: 'Please enter any link',
        icon: 'information-circle',
        position: 'top',
        cssClass: 'toast error-toast',
        duration: 4000,
    });
    toast.present();
}

    onLoad() {

      // let payload: any ={
      //   announcementMr:this.filterForm.value.filterText
      // } 
      this.preLotteryApplicationService.fetchQuickLinkWithFilter(this.filterForm.value.filterText)
    .subscribe(helpList => {
      this.dataLoaded = true;
      this.helpLinks = helpList.filter(h => 
        h.announcementType === 'HELP_LINK' || h.announcementType === 'HELP_EXTERNAL_LINK'
      );
      
      this.helpVideos = helpList.filter(h => 
        h.announcementType === 'HELP_VIDEO'
      );
      this.progressSpinnerDialog.close();
    }, async error => {
      this.progressSpinnerDialog.close();
      const toast = await this.toastController.create({
        message: this.translocoService.translate("error-help-load"),
        icon: "information-circle",
        position: "top",
        cssClass: "toast error-toast",
        duration: 4000,
      });
      toast.present();
    });

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



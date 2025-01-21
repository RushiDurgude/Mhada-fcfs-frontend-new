import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { LoaderComponent } from 'src/app/loader/loader.component';
import { ToastController } from '@ionic/angular';
import { SharedService } from 'src/app/toolbar/shared.service';
import { categories, CertEntryService } from '../cert-entry.service';
import { CertIssuingAuthorityModel } from 'src/app/pre-lottery/models/cert-issuing-authority,model';

@Component({
  selector: 'app-cert-entry-category-dashboard',
  templateUrl: './cert-entry-category-dashboard.component.html',
  styleUrls: ['../../pre-lottery/pre-lottery.component.scss', './cert-entry-category-dashboard.component.scss']
})
export class CertEntryCategoryDashboardComponent implements OnInit {
  progressSpinnerDialog: any = null;
  dataLoaded: boolean = false;
  pan: string;
  emailId: string;
  categories: {[key: string]: {en: string, mr: string}};
  issuingAuthorities: CertIssuingAuthorityModel;
  lang: string;

  constructor(private route: ActivatedRoute, 
    private dialog: MatDialog,
    private router: Router,
    private certEntryService: CertEntryService,
    private translocoService: TranslocoService, private toastController: ToastController,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.pan = params['pan'];
      this.loadData();  
    });
    this.categories = categories;
    this.sharedService.name.subscribe((lang) => {
      console.log('lang', lang)
      this.lang = lang;
    });
  }

  loadData() {
    this.displayProgressSpinner();
    if(this.pan) {
      this.certEntryService.initEmailForWithPAN(this.pan)
      .subscribe(data => {
        this.progressSpinnerDialog.close();
        if(data.status === 'SUCCESS') {
          if(data.emailId && data.emailId.length > 0) {
            this.emailId = data.emailId;

            this.certEntryService.issuingAuthority()
            .subscribe(data => {
              if(data.status === 'SUCCESS') {
                this.issuingAuthorities = data
              }
            }, error => {

            });
          }
          else {
            this.router.navigate(['/cert-entry', 'email-entry', this.pan], { replaceUrl: true });
          }
        }
        else {
          this.certEntryService.showErrorToast(data.errorMessage);
        }
      }, error => {
        this.progressSpinnerDialog.close();
      });
    }
    else {
      this.progressSpinnerDialog.close();
      this.certEntryService.showErrorToast(this.translocoService.translate('error-invalid-pan'));
      this.router.navigate(['/cert-entry', 'pan-validation'], { replaceUrl: true });
    }
  }

  categoryClick(category: string) {
    if(category) {
      this.router.navigate(['/cert-entry', 'category', this.pan, category], { replaceUrl: true });
    }
  }

  async displayProgressSpinner() {
    this.progressSpinnerDialog = this.dialog.open(LoaderComponent, {
      disableClose: true,
      panelClass: "progressSpinner",
    });
  }

}
